/**
 * @module Swap
 */

import { TxTypes } from '../tx/'
import * as crypto from '../crypto/'
import { checkCoins } from '../utils/validateHelper'
import {Buffer} from "buffer"

class Swap {
  static instance

  /**
   * @param {Object} bncClient
   */
  constructor(bncClient) {
    if (!Swap.instance) {
      this._bncClient = bncClient
      Swap.instance = this
    }

    return Swap.instance
  }

  /**
   * HTLT(Hash timer locked transfer, create an atomic swap)
   * @param {String} from
   * @param {String} recipient
   * @param {String} recipientOtherChain
   * @param {String} senderOtherChain
   * @param {String} randomNumberHash
   * @param {Number} timestamp
   * @param {Array} amount
   * @param {String} expectedIncome
   * @param {Number} heightSpan
   * @param {boolean} crossChain
   * @returns {Promise}  resolves with response (success or fail)
   */
  async HTLT(from, recipient, recipientOtherChain, senderOtherChain, randomNumberHash, timestamp, amount, expectedIncome, heightSpan, crossChain) {
    checkCoins(amount)
    const htltMsg = {
      from: crypto.decodeAddress(from),
      to: crypto.decodeAddress(recipient),
      recipient_other_chain: recipientOtherChain,
      sender_other_chain: senderOtherChain,
      random_number_hash: Buffer.from(randomNumberHash, 'hex'),
      timestamp: timestamp,
      amount: amount,
      expected_income: expectedIncome,
      height_span: heightSpan,
      cross_chain: crossChain,
      msgType: TxTypes.HTLTMsg
    }

    const signHTLTMsg = {
      from: from,
      to: recipient,
      recipient_other_chain: recipientOtherChain,
      sender_other_chain: senderOtherChain,
      random_number_hash: randomNumberHash,
      timestamp: timestamp,
      amount: amount,
      expected_income: expectedIncome,
      height_span: heightSpan,
      cross_chain: crossChain,
    }

    const signedTx = await this._bncClient._prepareTransaction(htltMsg, signHTLTMsg, from)
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * depositHTLT(deposit assets to an existing swap)
   * @param {String} from
   * @param {String} swapID
   * @param {Array} amount
   * @returns {Promise}  resolves with response (success or fail)
   */
  async depositHTLT(from, swapID, amount) {
    checkCoins(amount)
    const depositHTLTMsg = {
      from: crypto.decodeAddress(from),
      amount: amount,
      swap_id: Buffer.from(swapID, 'hex'),
      msgType: TxTypes.DepositHTLTMsg
    }

    const signDepositHTLTMsg = {
      from: from,
      amount: amount,
      swap_id: swapID,
    }

    const signedTx = await this._bncClient._prepareTransaction(depositHTLTMsg, signDepositHTLTMsg, from)
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * claimHTLT(claim assets from an swap)
   * @param {String} from
   * @param {String} swapID
   * @param {String} randomNumber
   * @returns {Promise}  resolves with response (success or fail)
   */
  async claimHTLT(from, swapID, randomNumber) {
    const claimHTLTMsg = {
      from: crypto.decodeAddress(from),
      swap_id: Buffer.from(swapID, 'hex'),
      random_number: Buffer.from(randomNumber, 'hex'),
      msgType: TxTypes.ClaimHTLTMsg
    }

    const signClaimHTLTMsg = {
      from: from,
      swap_id: swapID,
      random_number: randomNumber
    }

    const signedTx = await this._bncClient._prepareTransaction(claimHTLTMsg, signClaimHTLTMsg, from)
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   * refundHTLT(refund assets from an swap)
   * @param {String} from
   * @param {String} swapID
   * @returns {Promise}  resolves with response (success or fail)
   */
  async refundHTLT(from, swapID) {
    const refundHTLTMsg = {
      from: crypto.decodeAddress(from),
      swap_id: Buffer.from(swapID, 'hex'),
      msgType: TxTypes.RefundHTLTMsg
    }

    const signRefundHTLTMsg = {
      from: from,
      swap_id: swapID
    }

    const signedTx = await this._bncClient._prepareTransaction(refundHTLTMsg, signRefundHTLTMsg, from)
    return this._bncClient._broadcastDelegate(signedTx)
  }
}

export default Swap