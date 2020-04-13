/**
 * @module rpc
 */
import { Big } from "big.js"
import { unMarshalBinaryLengthPrefixed, unMarshalBinaryBare } from "../amino"
import * as crypto from "../crypto"
import BaseRpc from "./baseRpc"
import {
  validateSymbol,
  validateTradingPair,
  validateOffsetLimit,
} from "../utils"
import { NETWORK_PREFIX_MAPPING } from "../client"
import Transaction from "../tx"
import {
  Token,
  AppAccount,
  OpenOrder,
  TradingPair,
  OrderBook,
  TokenOfList,
  TokenBalance,
  Coin,
  AminoPrefix,
  abciQueryResponseResult,
  StdTx,
  ResponseDeliverTx,
} from "../types"

import { convertObjectArrayNum, getMsgByAminoPrefix } from "../utils"

/**
 * The Binance Chain Node rpc client
 */
class RpcClient extends BaseRpc {
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
      tx: Buffer.from(encoded, "hex"),
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
    unMarshalBinaryLengthPrefixed(bytes, tokenInfo)
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
    const { val: tokenList }: any = unMarshalBinaryLengthPrefixed(
      bytes,
      tokenArr
    )

    unMarshalBinaryLengthPrefixed(bytes, tokenList)

    return tokenList.map((item: TokenOfList) => ({
      ...item,
      owner: crypto.encodeAddress(item.owner, this.getBech32Prefix()),
    }))
  }

  /**
   * @param {String} address
   * @returns {Object} Account info
   */
  async getAccount(address: string) {
    const res: any = await this.abciQuery({
      path: `/account/${address}`,
    })
    const accountInfo = new AppAccount()
    const bytes = Buffer.from(res.response.value, "base64")
    unMarshalBinaryBare(bytes, accountInfo)
    const bech32Prefix = this.getBech32Prefix()

    return {
      name: accountInfo.name,
      locked: accountInfo.locked,
      frozen: accountInfo.frozen,
      base: {
        ...accountInfo.base,
        address: crypto.encodeAddress(accountInfo.base.address, bech32Prefix),
      },
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

    coins.forEach((item) => {
      const locked: any =
        account.locked.find((lockedItem) => item.denom === lockedItem.denom) ||
        {}
      const frozen: any =
        account.frozen.find((frozenItem) => item.denom === frozenItem.denom) ||
        {}
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
      (item) => item.symbol.toUpperCase() === symbol.toUpperCase()
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
    const { val: openOrders }: any = unMarshalBinaryLengthPrefixed(
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
    const { val: tradingPairs }: any = unMarshalBinaryLengthPrefixed(
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
    const { val: depth }: any = unMarshalBinaryLengthPrefixed(bytes, result)
    convertObjectArrayNum(depth.levels, [
      "buyQty",
      "buyPrice",
      "sellQty",
      "sellPrice",
    ])
    return depth
  }

  async getTxByHash(hash: Buffer | string, prove: boolean = true) {
    if (!Buffer.isBuffer(hash)) {
      hash = Buffer.from(hash, "hex")
    }

    const res = await this.tx({
      hash,
      prove,
    })

    const txBytes = Buffer.from(res.tx, "base64")
    const msgAminoPrefix = txBytes.slice(8, 12).toString("hex")
    const msgType = getMsgByAminoPrefix(msgAminoPrefix)
    const type: StdTx = {
      msg: [msgType.defaultMsg()],
      signatures: [
        {
          pub_key: Buffer.from(""),
          signature: Buffer.from(""),
          account_number: 0,
          sequence: 0,
        },
      ],
      memo: "",
      source: 0,
      data: "",
      aminoPrefix: AminoPrefix.StdTx,
    }

    const { val: result }: any = unMarshalBinaryLengthPrefixed(txBytes, type)

    const txResult = this.parseTxResult(res.tx_result)

    //TODO remove aminoPrefix
    return { ...res, tx: result, tx_result: txResult }
  }

  private parseTxResult(txResult: ResponseDeliverTx) {
    if (txResult.data) {
      txResult.data = Buffer.from(txResult.data, "base64").toString()
    }

    if (txResult.events && txResult.events.length > 0) {
      for (let i = 0; i < txResult.events.length; i++) {
        const event = txResult.events[i]
        if (event.attributes && event.attributes.length > 0) {
          event.attributes = event.attributes.map((item) => ({
            key: Buffer.from(item.key, "base64").toString(),
            value: Buffer.from(item.value, "base64").toString(),
          }))
        }
      }
    }

    if (txResult.tags && txResult.tags.length > 0) {
      txResult.tags = txResult.tags.map((item) => ({
        key: Buffer.from(item.key, "base64").toString(),
        value: Buffer.from(item.value, "base64").toString(),
      }))
    }

    return { ...txResult }
  }
}

export default RpcClient
