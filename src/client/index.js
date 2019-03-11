/**
 * @module client
 */
import * as crypto from "../crypto"
import Transaction from "../tx"
import HttpRequest from "../utils/request"
import Big from "big.js"

const api = {
  broadcast: "/api/v1/broadcast",
  nodeInfo: "/api/v1/node-info",
  getAccount: "/api/v1/account"
}

/**
 * The default signing delegate which uses the local private key.
 * @param  {Transaction} tx      the transaction
 * @param  {Object}      signMsg the canonical sign bytes for the msg
 * @return {Transaction}
 */
export const DefaultSigningDelegate = async function(tx, signMsg) {
  return tx.sign(this.privateKey, signMsg)
}

/**
 * The Ledger signing delegate.
 * @param  {LedgerApp}  ledgerApp
 * @param  {preSignCb}  function
 * @param  {postSignCb} function
 * @param  {errCb} function
 * @return {function}
 */
export const LedgerSigningDelegate = (ledgerApp, preSignCb, postSignCb, errCb) => async function (
  tx, signMsg
) {
  const signBytes = tx.getSignBytes(signMsg)
  preSignCb && preSignCb(signBytes)
  let pubKeyResp, sigResp
  try {
    pubKeyResp = await ledgerApp.getPublicKey()
    sigResp = await ledgerApp.sign(signBytes)
    postSignCb && postSignCb(pubKeyResp, sigResp)
  } catch (err) {
    console.warn("LedgerSigningDelegate error", err)
    errCb && errCb(err)
  }
  if (sigResp && sigResp.signature) {
    const pubKey = crypto.getPublicKey(pubKeyResp.pk.toString("hex"))
    return tx.addSignature(pubKey, sigResp.signature)
  }
  return tx
}

/**
 * validate the input number.
 * @param {Number} value
 */
const checkNumber = (value)=>{
  if(Math.pow(2, 63) < value){
    throw new Error("number should be less than 2^63")
  }
}

/**
 * The Binance Chain client.
 */
export class BncClient {
  /**
   * @param {string} server Binance Chain public url
   */
  constructor(server) {
    if(!server) {
      throw new Error("Binance chain server should not be null")
    }
    this._httpClient = new HttpRequest(server)
    this._signingDelegate = DefaultSigningDelegate
  }

  async initChain() {
    if(!this.chainId) {
      const data = await this._httpClient.request("get", api.nodeInfo)
      this.chainId = data.result.node_info && data.result.node_info.network
    }
    return this
  }

  async setPrivateKey(privateKey) {
    if(privateKey !== this.privateKey) {
      const address = crypto.getAddressFromPrivateKey(privateKey)
      const data = await this._httpClient.request("get", `${api.getAccount}/${address}`)
      this.account_number = data.result.account_number
    }
    this.privateKey = privateKey
    return this
  }

  setSigningDelegate(delegate) {
    if (typeof delegate !== "function") throw new Error("delegate must be a function")
    this._signingDelegate = delegate
  }

  useDefaultSigningDelegate() {
    this._signingDelegate = DefaultSigningDelegate
  }

  useLedgerSigningDelegate(ledgerApp, preSignCb, postSignCb, errCb) {
    this._signingDelegate = LedgerSigningDelegate(ledgerApp, preSignCb, postSignCb, errCb)
  }

  /**
   * Transfer tokens from one address to another.
   * @param {String} fromAddress
   * @param {String} toAddress
   * @param {Number} amount
   * @param {String} asset
   * @param {String} memo
   * @param {Number} sequence
   */
  async transfer(fromAddress, toAddress, amount, asset, memo, sequence) {
    const accCode = crypto.decodeAddress(fromAddress)
    const toAccCode = crypto.decodeAddress(toAddress)
    amount = parseInt(amount * Math.pow(10, 8))

    checkNumber(amount)

    const coin = {
      denom: asset,
      amount: amount,
    }

    const msg = {
      inputs: [{
        address: accCode,
        coins: [coin]
      }],
      outputs: [{
        address: toAccCode,
        coins: [coin]
      }],
      msgType: "MsgSend"
    }

    const signMsg = {
      inputs: [{
        address: fromAddress,
        coins: [{
          amount: amount,
          denom: asset
        }]
      }],
      outputs: [{
        address: toAddress,
        coins: [{
          amount: amount,
          denom: asset
        }]
      }]
    }

    return await this._sendTransaction(msg, signMsg, fromAddress, sequence, memo, true)
  }

  /**
   * Cancel an order.
   * @param {String} fromAddress
   * @param {String} symbol the market pair
   * @param {String} refid the order ID of the order to cancel
   * @param {Number} sequence
   */
  async cancelOrder(fromAddress, symbol, refid, sequence) {
    const accCode = crypto.decodeAddress(fromAddress)

    const msg = {
      sender: accCode,
      symbol: symbol,
      refid: refid,
      msgType: "CancelOrderMsg"
    }

    const signMsg = {
      refid: refid,
      sender: fromAddress,
      symbol: symbol
    }

    return this._sendTransaction(msg, signMsg, fromAddress, sequence, "")
  }

  /**
   * Place an order.
   * @param {String} address
   * @param {String} symbol the market pair
   * @param {Number} side (1-Buy, 2-Sell)
   * @param {Number} price
   * @param {Number} quantity
   * @param {Number} sequence
   * @param {Number} timeinforce (1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel))
   */
  async placeOrder(address, symbol, side, price, quantity, sequence, timeinforce=1) {
    if(side !== 1 && side !== 2){
      throw new Error("side can only be 1 or 2")
    }

    if(timeinforce !== 1 && timeinforce !== 3){
      throw new Error("timeinforce can only be 1 or 3")
    }

    const accCode = crypto.decodeAddress(address)

    if(sequence !== 0 && !sequence){
      const data = await this._httpClient.request("get", `${api.getAccount}/${address}`)
      sequence = data.result && data.result.sequence
    }

    const bigPrice = new Big(price)
    const bigQuantity = new Big(quantity)

    const placeOrderMsg = {
      sender: accCode,
      id: `${accCode.toString("hex")}-${sequence+1}`.toUpperCase(),
      symbol: symbol,
      ordertype: 2,
      side,
      price: parseFloat(bigPrice.mul(Math.pow(10, 8)).toString(), 10),
      quantity: parseFloat(bigQuantity.mul(Math.pow(10, 8)).toString(), 10),
      timeinforce: timeinforce,
      msgType: "NewOrderMsg",
    }

    const signMsg = {
      id: placeOrderMsg.id,
      ordertype: placeOrderMsg.ordertype,
      price: placeOrderMsg.price,
      quantity: placeOrderMsg.quantity,
      sender: address,
      side: placeOrderMsg.side,
      symbol: placeOrderMsg.symbol,
      timeinforce: timeinforce,
    }

    checkNumber(placeOrderMsg.price)
    checkNumber(placeOrderMsg.quantity)

    return await this._sendTransaction(placeOrderMsg, signMsg, address, sequence, "", true)
  }

  /**
   * Broadcast a raw transaction to the blockchain.
   * @param {Object} msg the msg object
   * @param {Object} stdSignMsg the sign doc object used to generate a signature
   * @param {String} address
   * @param {Number} sequence the account sequence (optional, fetched if not given)
   * @param {String} memo transaction memo, optional
   * @param {Boolean} sync use synchronous mode, optional
   * @return {Object} response (success or fail)
   */
  async _sendTransaction(msg, stdSignMsg, address, sequence=null, memo="", sync=true) {
    if(!sequence && address) {
      const data = await this._httpClient.request("get", `${api.getAccount}/${address}`)
      sequence = data.result.sequence
      this.account_number = data.result.account_number
    }

    const options = {
      account_number: parseInt(this.account_number),
      chain_id: this.chainId,
      memo: memo,
      msg,
      sequence: parseInt(sequence),
      type: msg.msgType,
    }

    const tx = new Transaction(options)
    const signedTx = await this._signingDelegate.call(this, tx, stdSignMsg)
    const signedBz = signedTx.serialize()

    const opts = {
      data: signedBz,
      headers: {
        "content-type": "text/plain",
      }
    }

    return await this._httpClient.request("post", `${api.broadcast}?sync=${sync}`, null, opts)
  }

  /**
   * get balance
   * @param {String} address
   */
  async getBalance(address) {
    if(!address) {
      throw new Error("address should not be null")
    }

    try {
      const data = await this._httpClient.request("get", `${api.getAccount}/${address}`)
      return data.result.balances
    } catch(err) {
      return []
    }
  }

  /**
   * get account
   * @param {String} address
   */
  async getAccount(address) {
    if(!address) {
      throw new Error("address should not be null")
    }

    try {
      const data = await this._httpClient.request("get", `${api.getAccount}/${address}`)
      return data
    } catch(err) {
      return null
    }
  }

  /**
   * Creates a private key.
   * @return {Object}
   * {
   *  address,
   *  privateKey
   * }
   */
  createAccount() {
    const privateKey = crypto.generatePrivateKey()
    return {
      privateKey,
      address: crypto.getAddressFromPrivateKey(privateKey)
    }
  }

  /**
   *
   * @param {String} password
   *  {
   *  privateKey,
   *  address,
   *  keystore
   * }
   */
  createAccountWithKeystore(password){
    if(!password){
      throw new Error("password should not be null")
    }

    const privateKey = crypto.generatePrivateKey()
    const address = crypto.getAddressFromPrivateKey(privateKey)
    const keystore = crypto.generateKeyStore(privateKey, password)
    return {
      privateKey,
      address,
      keystore
    }
  }

  /**
   * @return {Object}
   * {
   *  privateKey,
   *  address,
   *  mnemonic
   * }
   */
  createAccountWithMneomnic() {
    const mnemonic = crypto.generateMnemonic()
    const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
    const address = crypto.getAddressFromPrivateKey(privateKey)
    return {
      privateKey,
      address,
      mnemonic
    }
  }

  /**
   * @param {String} keystore
   * @param {String} password
   * {
   * privateKey,
   * address
   * }
   */
  recoverAccountFromKeystore(keystore, password){
    const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password)
    const address = crypto.getAddressFromPrivateKey(privateKey)
    return {
      privateKey,
      address
    }
  }

  /**
   * @param {String} mneomnic
   * {
   * privateKey,
   * address
   * }
   */
  recoverAccountFromMneomnic(mneomnic){
    const privateKey = crypto.getPrivateKeyFromMnemonic(mneomnic)
    const address = crypto.getAddressFromPrivateKey(privateKey)
    return {
      privateKey,
      address
    }
  }

  /**
   * @param {String} privateKey
   * {
   * privateKey,
   * address
   * }
   */
  recoverAccountFromPrivateKey(privateKey){
    const address = crypto.getAddressFromPrivateKey(privateKey)
    return {
      privateKey,
      address
    }
  }

  /**
   * @param {String} address
   * @return {Boolean}
   */
  checkAddress(address){
    return crypto.checkAddress(address)
  }

  /**
   * Returns the address for the current account if setPrivateKey has been called on this client.
   * @return {String}
   */
  getClientKeyAddress(){
    if (!this.privateKey) throw new Error("No private key set on client.")
    return crypto.getAddressFromPrivateKey(this.privateKey)
  }
}
