import { decodeAddress } from "../crypto"
import Transaction from "../tx"
import HttpRequest from "../utils/request"
import Account from "../account"

const api = {
  broadcast: "/api/v1/broadcast",
  nodeInfo: "/api/v1/node-info",
  getSimulateAccount: "/api/v1/simulate/account/"
}

class BncClient {

  /**
   * @param {string} Binance Chain public url
   */
  constructor(server) {
    if(!server) {
      throw new Error("Binance chain server should not be null")
    }

    this._httpClient = new HttpRequest(server)
    this.account = new Account(this._httpClient)
  }

  async initChain() {
    if(!this.chainId) {
      const data = await this._httpClient.request("get", api.nodeInfo)
      this.chainId = data.node_info && data.node_info.network || "chain-bnb"
    }

    return this
  }

  setPrivateKey(privateKey) {
    this.privateKey = privateKey
    return this
  }

  /**
   *
   * @param {String} fromAddress
   * @param {String} toAddress
   * @param {Number} amount
   * @param {String} asset
   * @param {String} memo
   */
  async transfer(fromAddress, toAddress, amount, asset, memo, sequence) {
    const accCode = decodeAddress(fromAddress)
    const toAccCode = decodeAddress(toAddress)
    amount = amount * Math.pow(10, 8)

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
          amount: amount.toString(),
          denom: asset
        }]
      }],
      outputs: [{
        address: toAddress,
        coins: [{
          amount: amount.toString(),
          denom: asset
        }]
      }]
    }

    return await this._sendTransaction(msg, signMsg, fromAddress, sequence, memo, true)
  }

  async cancelOrder(fromAddress, symbols, orderIds, refids, sequence) {
    const accCode = decodeAddress(fromAddress)
    const requests = []
    orderIds.forEach((orderId, index) => {
      const msg = {
        sender: accCode,
        symbol: symbols[index],
        id: orderId,
        refid: refids[index],
        msgType: "CancelOrderMsg"
      }

      const signMsg = {
        id: orderId,
        refid: refids[index],
        sender: fromAddress,
        symbol: symbols[index]
      }

      requests.push(this._sendTransaction(msg, signMsg, fromAddress, sequence+index, ""))
    })

    return Promise.all(requests)
  }

  /**
   * placeOrder
   * @param {String} address
   * @param {String} symbol
   * @param {String} side
   * @param {Number} price
   * @param {Number} quantity
   * @param {Number} sequence
   */
  async placeOrder(address, symbol, side, price, quantity, sequence) {
    if(side !== 1 && side !== 2){
      throw new Error("side can only be 1 or 2")
    }

    const accCode = decodeAddress(address)

    if(sequence !== 0 && !sequence){
      const data = await this._httpClient.request("get", `${api.getAccount}/${address}`)
      sequence = data.result && data.result.sequence
    }

    const placeOrderMsg = {
      sender: accCode,
      id: `${accCode.toString("hex")}-${sequence+1}`.toUpperCase(),
      symbol: symbol,
      ordertype: 2,
      side,
      price: Math.floor(price * Math.pow(10, 8)),
      quantity: Math.floor(quantity * Math.pow(10, 8)),
      timeinforce: 1,
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
      timeinforce: 1,
    }

    return await this._sendTransaction(placeOrderMsg, signMsg, address, sequence, "", true)
  }

  /**
   * send single transaction to binance chain
   * @param {Object} concrete msg type
   * @param {Object} stdSignMsg
   * @param {String} address
   * @param {Number} sequence
   * @param {String} memo
   * @param {Boolean} sync
   * @return {Object} response (success or fail)
   */
  async _sendTransaction(msg, stdSignMsg, address, sequence=null, memo="", sync=false ){
    if(!sequence && address) {
      const data = await this._httpClient.request("get", `/api/v1/account/${address}`)
      sequence = data.result.sequence
      this.account_number = data.result.account_number
    }

    if(!this.account_number){
      const data = await this._httpClient.request("get", `/api/v1/account/${address}`)
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

    const txBytes = tx.sign(this.privateKey, stdSignMsg).serialize()
    return await this._sendTx(txBytes, sync)
  }

  /**
   * send multiple transaction to binance chain
   * @param {Array} concrete msg type array
   * @param {Array} signature msg array
   * @param {Boolean} sync
   * @param {Number} sequence
   * @return {Object} send transaction response(success or fail)
   */
  async _sendBatchTransaction(msgs, stdSignMsgs, address, sequence=null, memo="", sync=false ) {
    if(!sequence && address) {
      const data = await this._httpClient.request("get", `/api/v1/account/${address}`)
      sequence = data.result.sequence
      this.account_number = data.result.account_number
    }

    if(!this.account_number){
      const data = await this._httpClient.request("get", `/api/v1/account/${address}`)
      this.account_number = data.result.account_number
    }

    const batchBytes = []

    msgs.forEach((msg, index)=>{
      const options = {
        account_number: parseInt(this.account_number),
        chain_id: this.chainId,
        memo: "",
        msg,
        sequence: parseInt(sequence),
        type: msg.msgType,
      }

      const tx = new Transaction(options)

      const txBytes = tx.sign(this.privateKey, stdSignMsgs[index]).serialize()
    })

    return await this._sendTx(batchBytes.join(","), sync)
  }

  async _sendTx(tx, sync=true) {
    const opts = {
      data: tx,
      headers: {
        "content-type": "text/plain",
      }
    }
    const data = await this._httpClient.request("post", `${api.broadcast}?sync=${sync}`, null, opts)
    return data
  }
}

export default BncClient