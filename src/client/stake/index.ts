import Big from "big.js"

import { BncClient } from "../"
import * as crypto from "../../crypto"
import {
  BscDelegateMsg,
  BaseMsg,
  BscUndelegateMsg,
  BscReDelegateMsg,
} from "../../types"

/**
 * Stake
 */
export class Stake {
  private _bncClient!: BncClient

  /**
   * @param {BncClient} bncClient
   */
  constructor(bncClient: BncClient) {
    this._bncClient = bncClient
  }

  public async bscDelegate({
    delegateAddress,
    validatorAddress,
    amount,
    symbol = "BNB",
    sideChainId = "chapel", //default value is ganges(testnet)
  }: {
    delegateAddress: string
    validatorAddress: string
    amount: number
    symbol?: string
    sideChainId?: string
  }) {
    if (!amount) {
      throw new Error("amount should not be empty")
    }

    if (!delegateAddress) {
      throw new Error("delegate address should not be null")
    }

    if (!crypto.checkAddress(validatorAddress, "bva")) {
      throw new Error("validator address is not valid")
    }

    amount = Number(new Big(amount).mul(Math.pow(10, 8)).toString())

    const bscDelegateMsg = new BscDelegateMsg({
      delegator_addr: delegateAddress,
      validator_addr: validatorAddress,
      delegation: { denom: symbol, amount },
      side_chain_id: sideChainId,
    })

    return await this.broadcast(bscDelegateMsg, delegateAddress)
  }

  public async bscUndelegate({
    delegateAddress,
    validatorAddress,
    amount,
    symbol = "BNB",
    sideChainId = "chapel", //default value is ganges(testnet)
  }: {
    delegateAddress: string
    validatorAddress: string
    amount: number
    symbol?: string
    sideChainId?: string
  }) {
    if (!amount) {
      throw new Error("amount should not be empty")
    }

    if (!delegateAddress) {
      throw new Error("delegate address should not be null")
    }

    if (!crypto.checkAddress(validatorAddress, "bva")) {
      throw new Error("validator address is not valid")
    }

    amount = Number(new Big(amount).mul(Math.pow(10, 8)).toString())

    const unDelegateMsg = new BscUndelegateMsg({
      delegator_addr: delegateAddress,
      validator_addr: validatorAddress,
      amount: { denom: symbol, amount },
      side_chain_id: sideChainId,
    })

    return await this.broadcast(unDelegateMsg, delegateAddress)
  }

  public async bscReDelegate({
    delegateAddress,
    validatorSrcAddress,
    validatorDstAddress,
    amount,
    symbol = "BNB",
    sideChainId = "chapel", //default value is ganges(testnet)
  }: {
    delegateAddress: string
    validatorSrcAddress: string
    validatorDstAddress: string
    amount: number
    symbol?: string
    sideChainId?: string
  }) {
    if (!amount) {
      throw new Error("amount should not be empty")
    }

    if (!delegateAddress) {
      throw new Error("delegate address should not be null")
    }

    if (!crypto.checkAddress(validatorSrcAddress, "bva")) {
      throw new Error("validator source address is not valid")
    }

    if (!crypto.checkAddress(validatorDstAddress, "bva")) {
      throw new Error("validator dest address is not valid")
    }

    amount = Number(new Big(amount).mul(Math.pow(10, 8)).toString())

    const bscReDelegateMsg = new BscReDelegateMsg({
      delegator_addr: delegateAddress,
      validator_src_addr: validatorSrcAddress,
      validator_dst_addr: validatorDstAddress,
      amount: { denom: symbol, amount },
      side_chain_id: sideChainId,
    })

    return await this.broadcast(bscReDelegateMsg, delegateAddress)
  }

  private async broadcast(
    msg: BaseMsg,
    fromAddress: string,
    sequence?: number
  ) {
    const signedTx = await this._bncClient._prepareTransaction(
      msg.getMsg(),
      msg.getSignMsg(),
      fromAddress,
      sequence
    )
    return this._bncClient._broadcastDelegate(signedTx)
  }
}
