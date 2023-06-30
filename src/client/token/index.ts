import Big, { BigSource } from "big.js"

import { api, BncClient } from ".."
import * as crypto from "../../crypto"
import {
  Coin,
  AminoPrefix,
  IssueMiniTokenMsg,
  IssueTinyTokenMsg,
  SetTokenUriMsg,
} from "../../types"
import HttpRequest from "../../utils/request"
import { validateSymbol, checkCoins } from "../../utils/validateHelper"

const MAXTOTALSUPPLY = 9000000000000000000
const MINI_TOKEN_MAX_TOTAL_SUPPAY = 1000000
const TINY_TOKEN_MAX_TOTAL_SUPPAY = 10000

const validateNonZeroAmount = async (
  amountParam: BigSource,
  symbol: string,
  fromAddress: string,
  httpClient: HttpRequest,
  type = "free"
) => {
  const amount = new Big(amountParam)
  if (amount.lte(0) || amount.gt(MAXTOTALSUPPLY)) {
    throw new Error("invalid amount")
  }

  try {
    const { result } = await httpClient.request(
      "get",
      `${api.getAccount}/${fromAddress}`
    )
    const balance = result.balances.find(
      (b: { symbol: string }) => b.symbol.toUpperCase() === symbol.toUpperCase()
    )
    if (!balance) {
      throw new Error(`the account doesn't have ${symbol}`)
    }

    if (amount.gte(balance[type])) {
      throw new Error(`the account doesn't have enougth balance`)
    }
  } catch (err) {
    //if get account failed. still broadcast
  }
}

export const validateMiniTokenSymbol = (symbol: string) => {
  if (!symbol) {
    throw new Error("suffixed token symbol cannot be empty")
  }

  const splitedSymbol = symbol.split("-")
  if (splitedSymbol.length != 2) {
    throw new Error("suffixed mini-token symbol must contain a hyphen ('-')")
  }

  if (!splitedSymbol[1]) {
    throw new Error(
      `suffixed mini-token symbol must contain just one hyphen (" - ")`
    )
  }

  if (!/^[a-zA-z\d]{3,8}$/.test(splitedSymbol[0])) {
    throw new Error(
      "symbol should be alphanumeric and length is limited to 3~8"
    )
  }

  if (!splitedSymbol[1].endsWith("M")) {
    throw new Error("mini-token symbol suffix must end with M")
  }
}

/**
 * issue or view tokens
 */
class TokenManagement {
  private _bncClient!: BncClient

  /**
   * @param {Object} bncClient
   */
  constructor(bncClient: BncClient) {
    this._bncClient = bncClient
  }

  /**
   * create a new asset on BNB Beacon Chain
   * @param {String} - senderAddress
   * @param {String} - tokenName
   * @param {String} - symbol
   * @param {Number} - totalSupply
   * @param {Boolean} - mintable
   * @returns {Promise} resolves with response (success or fail)
   */
  async issue(
    senderAddress: string,
    tokenName: string,
    symbol: string,
    totalSupply = 0,
    mintable = false
  ) {
    if (!senderAddress) {
      throw new Error("sender address cannot be empty")
    }

    if (tokenName.length > 32) {
      throw new Error("token name is limited to 32 characters")
    }

    if (!/^[a-zA-z\d]{3,8}$/.test(symbol)) {
      throw new Error(
        "symbol should be alphanumeric and length is limited to 3~8"
      )
    }

    if (totalSupply <= 0 || totalSupply > MAXTOTALSUPPLY) {
      throw new Error("invalid supply amount")
    }

    totalSupply = Number(new Big(totalSupply).mul(Math.pow(10, 8)).toString())

    const issueMsg = {
      from: crypto.decodeAddress(senderAddress),
      name: tokenName,
      symbol,
      total_supply: totalSupply,
      mintable,
      aminoPrefix: AminoPrefix.IssueMsg,
    }

    const signIssueMsg = {
      from: senderAddress,
      name: tokenName,
      symbol,
      total_supply: totalSupply,
      mintable,
    }

    const signedTx = await this._bncClient._prepareTransaction(
      issueMsg,
      signIssueMsg,
      senderAddress
    )
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * issue a new mini-token, total supply should be less than 1M
   * @param {String} - senderAddress
   * @param {String} - tokenName
   * @param {String} - symbol
   * @param {Number} - totalSupply
   * @param {Boolean} - mintable
   * @param {string} - token_uri
   * @returns {Promise} resolves with response (success or fail)
   */
  async issueMiniToken(
    senderAddress: string,
    tokenName: string,
    symbol: string,
    totalSupply = 0,
    mintable = false,
    tokenUri?: string
  ) {
    if (!senderAddress) {
      throw new Error("sender address cannot be empty")
    }

    if (tokenName.length > 32) {
      throw new Error("token name is limited to 32 characters")
    }

    if (!/^[a-zA-z\d]{3,8}$/.test(symbol)) {
      throw new Error(
        "symbol should be alphanumeric and length is limited to 3~8"
      )
    }

    if (totalSupply <= 0 || totalSupply > MINI_TOKEN_MAX_TOTAL_SUPPAY) {
      throw new Error("invalid supply amount")
    }

    totalSupply = Number(new Big(totalSupply).mul(Math.pow(10, 8)).toString())

    const issueMiniMsg = new IssueMiniTokenMsg({
      name: tokenName,
      symbol,
      total_supply: totalSupply,
      mintable,
      token_uri: tokenUri,
      from: senderAddress,
    })

    const signedTx = await this._bncClient._prepareTransaction(
      issueMiniMsg.getMsg(),
      issueMiniMsg.getSignMsg(),
      senderAddress
    )

    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * issue a new tiny-token, total supply should be less than 10K
   * @param {String} - senderAddress
   * @param {String} - tokenName
   * @param {String} - symbol
   * @param {Number} - totalSupply
   * @param {Boolean} - mintable
   * @param {string} - token_uri
   * @returns {Promise} resolves with response (success or fail)
   */
  async issueTinyToken(
    senderAddress: string,
    tokenName: string,
    symbol: string,
    totalSupply = 0,
    mintable = false,
    tokenUri?: string
  ) {
    if (!senderAddress) {
      throw new Error("sender address cannot be empty")
    }

    if (tokenName.length > 32) {
      throw new Error("token name is limited to 32 characters")
    }

    if (!/^[a-zA-z\d]{3,8}$/.test(symbol)) {
      throw new Error(
        "symbol should be alphanumeric and length is limited to 3~8"
      )
    }

    if (totalSupply <= 0 || totalSupply > TINY_TOKEN_MAX_TOTAL_SUPPAY) {
      throw new Error("invalid supply amount")
    }

    totalSupply = Number(new Big(totalSupply).mul(Math.pow(10, 8)).toString())

    const issueMiniMsg = new IssueTinyTokenMsg({
      name: tokenName,
      symbol,
      total_supply: totalSupply,
      mintable,
      token_uri: tokenUri,
      from: senderAddress,
    })

    const signedTx = await this._bncClient._prepareTransaction(
      issueMiniMsg.getMsg(),
      issueMiniMsg.getSignMsg(),
      senderAddress
    )

    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * set token URI of mini-token
   */
  async setTokenUri({
    fromAddress,
    tokenUri,
    symbol,
  }: {
    fromAddress: string
    tokenUri: string
    symbol: string
  }) {
    validateMiniTokenSymbol(symbol)

    if (tokenUri.length > 2048) {
      throw new Error("uri cannot be longer than 2048 characters")
    }

    if (!fromAddress) {
      throw new Error("address cannot be empty")
    }

    const setUriMsg = new SetTokenUriMsg({
      from: fromAddress,
      token_uri: tokenUri,
      symbol,
    })

    const signedTx = await this._bncClient._prepareTransaction(
      setUriMsg.getMsg(),
      setUriMsg.getSignMsg(),
      fromAddress
    )
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * freeze some amount of token
   * @param {String} fromAddress
   * @param {String} symbol
   * @param {String} amount
   * @returns {Promise}  resolves with response (success or fail)
   */
  async freeze(fromAddress: string, symbol: string, amount: BigSource) {
    validateSymbol(symbol)

    validateNonZeroAmount(
      amount,
      symbol,
      fromAddress,
      this._bncClient._httpClient,
      "free"
    )

    amount = +Number(new Big(amount).mul(Math.pow(10, 8)).toString())

    const freezeMsg = {
      from: crypto.decodeAddress(fromAddress),
      symbol,
      amount: amount,
      aminoPrefix: AminoPrefix.FreezeMsg,
    }

    const freezeSignMsg = {
      amount: amount,
      from: fromAddress,
      symbol,
    }

    const signedTx = await this._bncClient._prepareTransaction(
      freezeMsg,
      freezeSignMsg,
      fromAddress
    )
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * unfreeze some amount of token
   * @param {String} fromAddress
   * @param {String} symbol
   * @param {String} amount
   * @returns {Promise}  resolves with response (success or fail)
   */
  async unfreeze(fromAddress: string, symbol: string, amount: BigSource) {
    validateSymbol(symbol)

    validateNonZeroAmount(
      amount,
      symbol,
      fromAddress,
      this._bncClient._httpClient,
      "frozen"
    )

    amount = +Number(new Big(amount).mul(Math.pow(10, 8)).toString())

    const unfreezeMsg = {
      from: crypto.decodeAddress(fromAddress),
      symbol,
      amount: amount,
      aminoPrefix: AminoPrefix.UnfreezeMsg,
    }

    const unfreezeSignMsg = {
      amount: amount,
      from: fromAddress,
      symbol,
    }

    const signedTx = await this._bncClient._prepareTransaction(
      unfreezeMsg,
      unfreezeSignMsg,
      fromAddress
    )
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * burn some amount of token
   * @param {String} fromAddress
   * @param {String} symbol
   * @param {Number} amount
   * @returns {Promise}  resolves with response (success or fail)
   */
  async burn(fromAddress: string, symbol: string, amount: BigSource) {
    validateSymbol(symbol)

    validateNonZeroAmount(
      amount,
      symbol,
      fromAddress,
      this._bncClient._httpClient
    )
    amount = +Number(new Big(amount).mul(Math.pow(10, 8)).toString())
    const burnMsg = {
      from: crypto.decodeAddress(fromAddress),
      symbol,
      amount: amount,
      aminoPrefix: AminoPrefix.BurnMsg,
    }

    const burnSignMsg = {
      amount: amount,
      from: fromAddress,
      symbol,
    }

    const signedTx = await this._bncClient._prepareTransaction(
      burnMsg,
      burnSignMsg,
      fromAddress
    )
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * mint tokens for an existing token
   * @param {String} fromAddress
   * @param {String} symbol
   * @param {Number} amount
   * @returns {Promise}  resolves with response (success or fail)
   */
  async mint(fromAddress: string, symbol: string, amount: BigSource) {
    validateSymbol(symbol)

    if (amount <= 0 || amount > MAXTOTALSUPPLY) {
      throw new Error("invalid amount")
    }

    amount = Number(new Big(amount).mul(Math.pow(10, 8)).toString())

    const mintMsg = {
      from: crypto.decodeAddress(fromAddress),
      symbol,
      amount: amount,
      aminoPrefix: AminoPrefix.MintMsg,
    }

    const mintSignMsg = {
      amount: amount,
      from: fromAddress,
      symbol,
    }

    const signedTx = await this._bncClient._prepareTransaction(
      mintMsg,
      mintSignMsg,
      fromAddress
    )

    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * lock token for a while
   * @param {String} fromAddress
   * @param {String} description
   * @param {Array} amount
   * @param {Number} lockTime
   * @returns {Promise}  resolves with response (success or fail)
   */
  async timeLock(
    fromAddress: string,
    description: string,
    amount: Coin[],
    lockTime: number
  ) {
    checkCoins(amount)

    if (description.length > 128) {
      throw new Error("description is too long")
    }

    if (lockTime < 60 || lockTime > 253402300800) {
      throw new Error("timeTime must be in [60, 253402300800]")
    }
    const timeLockMsg = {
      from: crypto.decodeAddress(fromAddress),
      description,
      amount,
      lock_time: lockTime,
      aminoPrefix: AminoPrefix.TimeLockMsg,
    }

    const signTimeLockMsg = {
      from: fromAddress,
      description: description,
      amount,
      lock_time: lockTime,
    }

    const signedTx = await this._bncClient._prepareTransaction(
      timeLockMsg,
      signTimeLockMsg,
      fromAddress
    )
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * lock more token or increase locked period
   * @param {String} fromAddress
   * @param {Number} id
   * @param {String} description
   * @param {Array} amount
   * @param {Number} lockTime
   * @returns {Promise}  resolves with response (success or fail)
   */
  async timeRelock(
    fromAddress: string,
    id: number,
    description: string,
    amount: Coin[],
    lockTime: number
  ) {
    checkCoins(amount)

    if (description.length > 128) {
      throw new Error("description is too long")
    }

    if (lockTime < 60 || lockTime > 253402300800) {
      throw new Error("timeTime must be in [60, 253402300800]")
    }
    const timeRelockMsg = {
      from: crypto.decodeAddress(fromAddress),
      time_lock_id: id,
      description,
      amount,
      lock_time: lockTime,
      aminoPrefix: AminoPrefix.TimeRelockMsg,
    }

    const signTimeRelockMsg = {
      from: fromAddress,
      time_lock_id: id,
      description: description,
      amount,
      lock_time: lockTime,
    }

    const signedTx = await this._bncClient._prepareTransaction(
      timeRelockMsg,
      signTimeRelockMsg,
      fromAddress
    )
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * unlock locked tokens
   * @param {String} fromAddress
   * @param {Number} id
   * @returns {Promise}  resolves with response (success or fail)
   */
  async timeUnlock(fromAddress: string, id: number) {
    const timeUnlockMsg = {
      from: crypto.decodeAddress(fromAddress),
      time_lock_id: id,
      aminoPrefix: AminoPrefix.TimeUnlockMsg,
    }

    const signTimeUnlockMsg = {
      from: fromAddress,
      time_lock_id: id,
    }

    const signedTx = await this._bncClient._prepareTransaction(
      timeUnlockMsg,
      signTimeUnlockMsg,
      fromAddress
    )
    return this._bncClient._broadcastDelegate(signedTx)
  }
}

export default TokenManagement
