import { txType } from '../tx/'
import * as crypto from '../crypto/'
import { api } from '../client/'
const MAXTOTALSUPPLY = 9000000000000000000

const validateSymbol = (symbol)=>{
  if(!symbol) {
    throw new Error("suffixed token symbol cannot be empty")
  }

  const splitSymbols = symbol.split('-')

  //check length with .B suffix
  if(!/^[a-zA-z\d]{3,10}$/.test(splitSymbols[0])) {
    throw new Error("symbol length is limited to 3~10")
  }
}

const validateAmount = async (amount, symbol, fromAddress, httpClient, type="free") => {
  if(amount <= 0 || amount > MAXTOTALSUPPLY){
    throw new Error("invalid amount")
  }

  try {
    const { result } = await httpClient.request("get", `${api.getAccount}/${fromAddress}`)
    const balance = result.balances.find(b=>b.symbol.toUpperCase() === symbol.toUpperCase())
    if(!balance){
      throw new Error(`the account doesn't have ${symbol}`)
    }

    if(Number(balance[type])<Number(amount)){
      throw new Error(`the account doesn't have enougth balance`)
    }

  } catch(err) {
    //if get account failed. still broadcast
    console.log(err)
  }
}

class TokenManagement {
  static instance

  constructor(bncClient) {
    if(!TokenManagement.instance) {
      this._bncClient = bncClient
      TokenManagement.instance = this
    }

    return TokenManagement.instance
  }

  /**
   * create a new asset on Binance Chain
   * @param {String} senderAddress 
   * @param {String} tokenName 
   * @param {String} symbol 
   * @param {Number} totalSupply 
   * @param {Boolean} mintable 
   * @return {Promise} resolves with response (success or fail)
   */
  async issue(senderAddress, tokenName, symbol, totalSupply=0, mintable=false) {
    if(!senderAddress) {
      throw new Error("sender address cannot be empty")
    }

    if(tokenName.length > 32) {
      throw new Error("token name is limited to 32 characters")
    }
  
    if(!/^[a-zA-z\d]{3,8}$/.test(symbol)) {
      throw new Error("symbol should be alphanumeric and length is limited to 3~8")
    }
  
    if(totalSupply <= 0 || totalSupply > MAXTOTALSUPPLY) {
      throw new Error("invalid supply amount")
    }

    totalSupply = Math.pow(10,8) * totalSupply
  
    const issueMsg = {
      from: crypto.decodeAddress(senderAddress),
      name: tokenName,
      symbol,
      total_supply: totalSupply,
      mintable,
      msgType: txType.IssueMsg
    }

    const signIssueMsg = {
      from: senderAddress, 
      name: tokenName,
      symbol,
      total_supply: totalSupply,
      mintable,
    }

    const signedTx = await this._bncClient._prepareTransaction(issueMsg, signIssueMsg, senderAddress)
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * freeze some amount of token
   * @param {String} fromAddress 
   * @param {String} symbol 
   * @param {String} amount 
   * @return {Promise} resolves with response (success or fail)
   * @return {Promise} resolves with response (success or fail)
   */
  async freeze(fromAddress, symbol, amount) {

    validateSymbol(symbol)

    validateAmount(amount, symbol, fromAddress, this._bncClient._httpClient, 'free')

    amount = Math.pow(10,8) * amount
    const freezeMsg = {
      from: crypto.decodeAddress(fromAddress),
      symbol,
      amount,
      msgType: txType.FreezeMsg
    }

    const freezeSignMsg = {
      amount: amount,
      from: fromAddress,
      symbol
    }

    const signedTx = await this._bncClient._prepareTransaction(freezeMsg, freezeSignMsg, fromAddress)
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * unfreeze some amount of token
   * @param {String} fromAddress 
   * @param {String} symbol 
   * @param {String} amount 
   */
  async unfreeze(fromAddress, symbol, amount){
    validateSymbol(symbol)

    validateAmount(amount, symbol, fromAddress, this._bncClient._httpClient, 'frozen')

    amount = Math.pow(10,8) * amount
    const unfreezeMsg = {
      from: crypto.decodeAddress(fromAddress),
      symbol,
      amount,
      msgType: txType.UnfreezeMsg
    }

    const unfreezeSignMsg = {
      amount: amount,
      from: fromAddress,
      symbol
    }

    const signedTx = await this._bncClient._prepareTransaction(unfreezeMsg, unfreezeSignMsg, fromAddress)
    return this._bncClient._broadcastDelegate(signedTx)
  } 

  /**
   * burn some amount of token
   * @param {String} fromAddress 
   * @param {String} symbol 
   * @param {Number} amount 
   */
  async burn(fromAddress, symbol, amount) {
    validateSymbol(symbol)

    validateAmount(amount, symbol, fromAddress, this._bncClient._httpClient)

    amount = Math.pow(10,8) * amount
    const burnMsg = {
      from: crypto.decodeAddress(fromAddress),
      symbol,
      amount,
      msgType: txType.BurnMsg
    }

    const burnSignMsg = {
      amount: amount,
      from: fromAddress,
      symbol
    }

    const signedTx = await this._bncClient._prepareTransaction(burnMsg, burnSignMsg, fromAddress)
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * mint tokens for an existing token
   * @param {String} fromAddress 
   * @param {String} symbol 
   * @param {Number} amount 
   */
  async mint(fromAddress, symbol, amount) {
    validateSymbol(symbol)

    if(amount <= 0 || amount > MAXTOTALSUPPLY) {
      throw new Error("invalid amount")
    }

    amount = Math.pow(10,8) * amount
    const mintMsg = {
      from: crypto.decodeAddress(fromAddress),
      symbol,
      amount,
      msgType: txType.MintMsg
    }

    const mintSignMsg = {
      amount: amount,
      from: fromAddress,
      symbol
    }

    const signedTx = await this._bncClient._prepareTransaction(mintMsg, mintSignMsg, fromAddress)
    return this._bncClient._broadcastDelegate(signedTx)
  }
}

export default TokenManagement