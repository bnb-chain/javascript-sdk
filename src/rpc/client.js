import { 
  Token, 
  AppAccount,
  OpenOrder,
  TradingPair,
  OrderBook,
  TokenOfList 
} from '../decoder/types'
import * as decoder from '../decoder'
import * as crypto from '../crypto'
import BaseRpc from '.'

const validateSymbol = (symbol)=>{
  if(!symbol) {
    throw new Error("symbol should not be null")
  }

  const splitSymbols = symbol.split("-")
  if(!/^[a-zA-z\d\.]{3,10}$/.test(splitSymbols[0])) {
    throw new Error("symbol length is limited to 3~10")
  }
}

const validateOffsetLimit = (offset, limit) =>{
  if(offset < 0){
    throw new Error("offset can't be less than 0")
  }

  if(limit < 0){
    throw new Error("limit can't be less than 0")
  }
}

class Client extends BaseRpc{
  constructor (uriString="localhost:27146") {
    super(uriString)
  }

  /**
   * @param {String} symbol - required
   */
  async getTokenInfo(symbol) {
    validateSymbol(symbol)

    const path = "/tokens/info/" + symbol

    const res = await this.abciQuery({path})
    const bytes = Buffer.from(res.response.value, 'base64')
    console.log(bytes.toString('hex'))
    const result = new Token()
    const { val: tokenInfo } = decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    tokenInfo.owner = crypto.encodeAddress(tokenInfo.owner, 'tbnb')
    return tokenInfo
  }

  async listAllTokens(offset, limit) {
    validateOffsetLimit(offset, limit)
    const path = `tokens/list/${offset}/${limit}`
    const res = await this.abciQuery({path})
    const bytes = Buffer.from(res.response.value, 'base64')
    const result = [new TokenOfList()]
    const { val: tokenList } =decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    tokenList.forEach((item)=>{
      item.owner = crypto.encodeAddress(item.owner, 'tbnb')
    })
    return tokenList
  }

  /**
   * @param {String} address
   */
  async getAccount(address) {
    const addr = crypto.decodeAddress(address)
    const addrHex = Buffer.concat([Buffer.from('account:'), addr])

    const res = await this.abciQuery({
      path: `/store/acc/key`, 
      data: addrHex
    })

    const result = new AppAccount()
    const bytes = Buffer.from(res.response.value, 'base64')
    const { val: accountInfo }  = decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    return accountInfo
  }

  async getFee(){
    const path = `param/fees`
    const res = await this.abciQuery({path})
    const bytes = Buffer.from(res.response.value, 'base64')
  }

  async getOpenOrders(address, symbol) {
    const path = `/dex/openorders/${symbol}/${address}`
    const res = await this.abciQuery({path})
    const bytes = Buffer.from(res.response.value, 'base64')
    const result = new OpenOrder()
    const { val: openOrders }  = decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    return openOrders
  }

  async getTradingPairs(offset, limit){
    validateOffsetLimit(offset, limit)        

    const path = `/dex/pairs/${offset}/${limit}`
    const res = await this.abciQuery({path})
    const bytes = Buffer.from(res.response.value, 'base64')
    const result = new TradingPair()

    const { val }  = decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    return val
  }

  async getDepth(tradePair){
    const path = `dex/orderbook/${tradePair}`
    const res = await this.abciQuery({path})
    const bytes = Buffer.from(res.response.value, 'base64')
    
    const result = new OrderBook()
    const { val }  = decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    return val
  }
}

export default Client