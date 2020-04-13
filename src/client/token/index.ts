/**
 * @module Token
 */
import Big, { BigSource } from "big.js"

// import { TxTypes } from "../tx/"
import * as crypto from "../../crypto"
import { api, BncClient } from ".."
import { validateSymbol } from "../../utils/validateHelper"
import { checkCoins } from "../../utils/validateHelper"
import HttpRequest from "../../utils/request"
import { Coin } from "../../types"
import { AminoPrefix } from "../../types"

const MAXTOTALSUPPLY = 9000000000000000000

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
    console.log(err)
  }
}

class TokenManagement {
  static instance: TokenManagement

  private _bncClient!: BncClient

  /**
   * @param {Object} bncClient
   */
  constructor(bncClient: BncClient) {
    if (!TokenManagement.instance) {
      this._bncClient = bncClient
      TokenManagement.instance = this
    }

    return TokenManagement.instance
  }

  /**
   * create a new asset on Binance Chain
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
    totalSupply: number = 0,
    mintable: boolean = false
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

    const freezeMsg = {
      from: crypto.decodeAddress(fromAddress),
      symbol,
      amount: Number(new Big(amount).mul(Math.pow(10, 8)).toString()),
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

    const unfreezeMsg = {
      from: crypto.decodeAddress(fromAddress),
      symbol,
      amount: Number(new Big(amount).mul(Math.pow(10, 8)).toString()),
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

    const burnMsg = {
      from: crypto.decodeAddress(fromAddress),
      symbol,
      amount: Number(new Big(amount).mul(Math.pow(10, 8)).toString()),
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

    const mintMsg = {
      from: crypto.decodeAddress(fromAddress),
      symbol,
      amount: Number(new Big(amount).mul(Math.pow(10, 8)).toString()),
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
      aminoPrefix: AminoPrefix.MintMsg,
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
