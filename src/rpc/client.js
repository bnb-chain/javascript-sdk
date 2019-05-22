/**
 * @module rpc
 */
import { 
  Token, 
  AppAccount,
  OpenOrder,
  TradingPair,
  OrderBook,
  TokenOfList,
  TokenBalance 
} from "../decoder/types"
import * as decoder from "../decoder"
import * as crypto from "../crypto"
import BaseRpc from "."
import big from "big.js"

const validateSymbol = (symbol)=>{
  if(!symbol) {
    throw new Error("symbol should not be null")
  }

  const splitSymbols = symbol.split("-")
  if(!/^[a-zA-z\d\.]{3,10}$/.test(splitSymbols[0])) {
    throw new Error("symbol length is limited to 3~10")
  }
}

const validateTradingPair = (pair)=>{
  const symbols = pair.split("_")
  if(symbols.length !== 2){
    throw new Error("the pair should in format \"symbol1_symbol2\"")
  }

  validateSymbol(symbols[0])
  validateSymbol(symbols[1])
}

const validateOffsetLimit = (offset, limit) =>{
  if(offset < 0){
    throw new Error("offset can't be less than 0")
  }

  if(limit < 0){
    throw new Error("limit can't be less than 0")
  }
}

const divide = (num)=>{
  return +(new big(num).div(Math.pow(10,8)).toString())
}

const convertObjectArrayNum = (objArr, keys)=>{
  objArr.forEach(item=>{
    keys.forEach(key=>{
      item[key] = divide(item[key])
    })
  })
}

/**
 * The Binance Chain Node rpc client
 */
class Client extends BaseRpc {

  /**
   * @param {String} uriString dataseed address
   * @param {String} netWork Binance Chain network
   */
  constructor (uriString="localhost:27146", netWork) {
    super(uriString)
    this.netWork = netWork || 'mainnet'
  }

  getBech32Prefix(){
    if(this.netWork === 'mainnet') {
      return 'bnb'
    }
  
    if(this.netWork === 'testnet'){
      return 'tbnb'
    }
  
    return ''
  }

  /**
   * @param {String} symbol - required
   * @returns {Object} token detail info
   */
  async getTokenInfo(symbol) {
    validateSymbol(symbol)

    const path = "/tokens/info/" + symbol

    const res = await this.abciQuery({path})
    const bytes = Buffer.from(res.response.value, "base64")
    const result = new Token()
    const { val: tokenInfo } = decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    const bech32Prefix = this.getBech32Prefix()
    tokenInfo.owner = crypto.encodeAddress(tokenInfo.owner, bech32Prefix)
    return tokenInfo
  }

  /**
   * get tokens by offset and limit
   * @param {Number} offset 
   * @param {Number} limit 
   * @returns {Array} token list
   */
  async listAllTokens(offset, limit) {
    validateOffsetLimit(offset, limit)
    const path = `tokens/list/${offset}/${limit}`
    const res = await this.abciQuery({path})
    const bytes = Buffer.from(res.response.value, "base64")
    const result = [new TokenOfList()]
    const { val: tokenList } =decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    const bech32Prefix = this.getBech32Prefix()
    tokenList.forEach((item)=>{
      item.owner = crypto.encodeAddress(item.owner, bech32Prefix)
    })
    return tokenList
  }

  /**
   * @param {String} address
   * @returns {Object} Account info
   */
  async getAccount(address) {
    const addr = crypto.decodeAddress(address)
    const addrHex = Buffer.concat([Buffer.from("account:"), addr])

    const res = await this.abciQuery({
      path: "/store/acc/key", 
      data: addrHex
    })

    const result = new AppAccount()
    const bytes = Buffer.from(res.response.value, "base64")
    const { val: accountInfo }  = decoder.unMarshalBinaryBare(bytes, result)
    const bech32Prefix = this.getBech32Prefix()
    accountInfo.base.address = crypto.encodeAddress(accountInfo.base.address, bech32Prefix)
    return accountInfo
  }

  /**
   * @param {Array} balances 
   */
  async getBalances(address) {
    const account = await this.getAccount(address)
    let coins = []
    const balances = []
    if(account) {
      coins = account.base && account.base.coins || []
      convertObjectArrayNum(coins, ["amount"])
      convertObjectArrayNum(account.locked, ["amount"])
      convertObjectArrayNum(account.frozen, ["amount"])
    }

    coins.forEach(item=>{
      const locked = account.locked.find(lockedItem=>item.denom === lockedItem.denom) || {}
      const frozen = account.frozen.find(frozenItem=>item.denom === frozenItem.denom) || {}
      const bal = new TokenBalance()
      bal.symbol = item.denom
      bal.free = item.amount
      bal.locked = locked.amount || 0
      bal.frozen = frozen.amount || 0
      balances.push(bal)
    })

    return balances
  }

  /**
   * get balance by symbol and address
   * @param {String} address 
   * @param {String} symbol 
   * @returns {Object}
   */
  async getBalance(address, symbol){
    validateSymbol(symbol)
    const balances = await this.getBalances(address)
    const bal = balances.find(item=>item.symbol.toUpperCase() === symbol.toUpperCase())
    return bal
  }

  /**
   * @param {String} address 
   * @param {String} symbol 
   * @returns {Object}
   */
  async getOpenOrders(address, symbol) {
    const path = `/dex/openorders/${symbol}/${address}`
    const res = await this.abciQuery({path})
    const bytes = Buffer.from(res.response.value, "base64")
    const result = [new OpenOrder()]
    const { val: openOrders }  = decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    convertObjectArrayNum(openOrders, ["price", "quantity", "cumQty"])
    return openOrders
  }

  /**
   * @param {Number} offset 
   * @param {Number} limit 
   * @returns {Array}
   */
  async getTradingPairs(offset, limit){
    validateOffsetLimit(offset, limit)        
    const path = `/dex/pairs/${offset}/${limit}`
    const res = await this.abciQuery({path})
    const bytes = Buffer.from(res.response.value, "base64")
    const result = [new TradingPair()]
    const { val: tradingPairs }  = decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    convertObjectArrayNum(tradingPairs, ["list_price", "tick_size", "lot_size"])
    return tradingPairs
  }

  /**
   * @param {String} tradePair 
   * @returns {Array}
   */
  async getDepth(tradePair){
    validateTradingPair(tradePair)
    const path = `dex/orderbook/${tradePair}`
    const res = await this.abciQuery({path})
    const bytes = Buffer.from(res.response.value, "base64")
    const result = new OrderBook()
    const { val: depth }  = decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    convertObjectArrayNum(depth.levels, ["buyQty", "buyPrice", "sellQty", "sellPrice"])
    return depth
  }
}

export default Client