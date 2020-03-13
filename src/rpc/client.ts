/**
 * @module rpc
 */
import { Big, BigSource } from "big.js"
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
import BaseRpc from "./"
import {
  validateSymbol,
  validateTradingPair,
  validateOffsetLimit
} from "../utils/validateHelper"
import { NETWORK_PREFIX_MAPPING } from "../client"
import Transaction from "../tx"
import { abciQueryResponseResult } from "../types/abciResponse"
import { Coin } from "../types/send"

const BASENUMBER = Math.pow(10, 8)

const divide = (num: BigSource) => {
  return +new Big(num).div(BASENUMBER).toString()
}

const convertObjectArrayNum = <T extends { [k: string]: BigSource }>(
  objArr: Array<T>,
  keys: Array<keyof T>
): void => {
  objArr.forEach(item => {
    keys.forEach(key => {
      item[key] = divide(item[key]) as any
    })
  })
}

/**
 * The Binance Chain Node rpc client
 */
class Client extends BaseRpc {
  private netWork: keyof typeof NETWORK_PREFIX_MAPPING

  /**
   * @param {String} uriString dataseed address
   * @param {String} netWork Binance Chain network
   */
  constructor(
    uriString: string = "localhost:27146",
    netWork: keyof typeof NETWORK_PREFIX_MAPPING
  ) {
    super(uriString)
    this.netWork = netWork || "mainnet"
  }

  /**
   * The RPC broadcast delegate broadcasts a transaction via RPC. This is intended for optional use as BncClient's broadcast delegate.
   * @param {Transaction} signedTx the signed transaction
   * @return {Promise}
   */
  async broadcastDelegate(signedTx: Transaction) {
    // amino encode the signed TX
    const encoded = signedTx.serialize()
    // broadcast it via RPC; we have to use a promise here because that's
    // what the BncClient expects as the return value of this function.
    const res: any = await this.broadcastTxSync({
      tx: Buffer.from(encoded, "hex")
    })
    if (`${res.code}` === "0") {
      return res
    } else {
      throw new Error(`broadcastDelegate: non-zero status code ${res.code}`)
    }
  }

  getBech32Prefix() {
    if (this.netWork === "mainnet") {
      return "bnb"
    }

    if (this.netWork === "testnet") {
      return "tbnb"
    }

    return ""
  }

  /**
   * @param {String} symbol - required
   * @returns {Object} token detail info
   */
  async getTokenInfo(symbol: string) {
    validateSymbol(symbol)

    const path = "/tokens/info/" + symbol

    const res: abciQueryResponseResult = await this.abciQuery({ path })
    const bytes = Buffer.from(res.response.value, "base64")
    const tokenInfo = new Token()
    decoder.unMarshalBinaryLengthPrefixed(bytes, tokenInfo)
    const bech32Prefix = this.getBech32Prefix()
    const ownerAddress = crypto.encodeAddress(tokenInfo.owner, bech32Prefix)

    delete tokenInfo.aminoPrefix
    //TODO all the result contains aminoPrefix, need to improve
    return { ...tokenInfo, owner: ownerAddress }
  }

  /**
   * get tokens by offset and limit
   * @param {Number} offset
   * @param {Number} limit
   * @returns {Array} token list
   */
  async listAllTokens(offset: number, limit: number) {
    validateOffsetLimit(offset, limit)
    const path = `tokens/list/${offset}/${limit}`
    const res: abciQueryResponseResult = await this.abciQuery({ path })
    const bytes = Buffer.from(res.response.value, "base64")
    const tokenArr = [new TokenOfList()]
    const { val: tokenList }: any = decoder.unMarshalBinaryLengthPrefixed(
      bytes,
      tokenArr
    )

    decoder.unMarshalBinaryLengthPrefixed(bytes, tokenList)

    return tokenList.map((item: TokenOfList) => ({
      ...item,
      owner: crypto.encodeAddress(item.owner, this.getBech32Prefix())
    }))
  }

  /**
   * @param {String} address
   * @returns {Object} Account info
   */
  async getAccount(address: string) {
    const res: any = await this.abciQuery({
      path: `/account/${address}`
    })
    const accountInfo = new AppAccount()
    const bytes = Buffer.from(res.response.value, "base64")
    decoder.unMarshalBinaryBare(bytes, accountInfo)
    const bech32Prefix = this.getBech32Prefix()

    return {
      name: accountInfo.name,
      locked: accountInfo.locked,
      frozen: accountInfo.frozen,
      base: {
        ...accountInfo.base,
        address: crypto.encodeAddress(accountInfo.base.address, bech32Prefix)
      }
    }
  }

  /**
   * @param {Array} balances
   */
  async getBalances(address: string) {
    const account = await this.getAccount(address)
    let coins: Coin[] = []
    const balances: TokenBalance[] = []
    if (account) {
      coins = (account.base && account.base.coins) || []
      convertObjectArrayNum<any>(coins, ["amount"])
      convertObjectArrayNum<any>(account.locked, ["amount"])
      convertObjectArrayNum<any>(account.frozen, ["amount"])
    }

    coins.forEach(item => {
      const locked: any =
        account.locked.find(lockedItem => item.denom === lockedItem.denom) || {}
      const frozen: any =
        account.frozen.find(frozenItem => item.denom === frozenItem.denom) || {}
      const bal = new TokenBalance()
      bal.symbol = item.denom
      bal.free = +new Big(item.amount).toString()
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
  async getBalance(address: string, symbol: string) {
    validateSymbol(symbol)
    const balances = await this.getBalances(address)
    const bal = balances.find(
      item => item.symbol.toUpperCase() === symbol.toUpperCase()
    )
    return bal
  }

  /**
   * @param {String} address
   * @param {String} symbol
   * @returns {Object}
   */
  async getOpenOrders(address: string, symbol: string) {
    const path = `/dex/openorders/${symbol}/${address}`
    const res = await this.abciQuery({ path })
    const bytes = Buffer.from(res.response.value, "base64")
    const result = [new OpenOrder()]
    const { val: openOrders }: any = decoder.unMarshalBinaryLengthPrefixed(
      bytes,
      result
    )
    convertObjectArrayNum(openOrders, ["price", "quantity", "cumQty"])
    return openOrders
  }

  /**
   * @param {Number} offset
   * @param {Number} limit
   * @returns {Array}
   */
  async getTradingPairs(offset: number, limit: number) {
    validateOffsetLimit(offset, limit)
    const path = `/dex/pairs/${offset}/${limit}`
    const res = await this.abciQuery({ path })
    const bytes = Buffer.from(res.response.value, "base64")
    const result = [new TradingPair()]
    const { val: tradingPairs }: any = decoder.unMarshalBinaryLengthPrefixed(
      bytes,
      result
    )
    convertObjectArrayNum(tradingPairs, ["list_price", "tick_size", "lot_size"])
    return tradingPairs
  }

  /**
   * @param {String} tradePair
   * @returns {Array}
   */
  async getDepth(tradePair: string) {
    validateTradingPair(tradePair)
    const path = `dex/orderbook/${tradePair}`
    const res = await this.abciQuery({ path })
    const bytes = Buffer.from(res.response.value, "base64")
    const result = new OrderBook()
    const { val: depth }: any = decoder.unMarshalBinaryLengthPrefixed(
      bytes,
      result
    )
    convertObjectArrayNum(depth.levels, [
      "buyQty",
      "buyPrice",
      "sellQty",
      "sellPrice"
    ])
    return depth
  }
}

export default Client
