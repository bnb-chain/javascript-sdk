import { BncClient } from "client"
import {
  TransferInClaim,
  ClaimMsg,
  ClaimTypes,
  TransferOutRefundClaim,
  BindMsg,
  BaseMsg,
  Coin,
  TransferOutMsg,
  UpdateBindClaim,
  SkipSequenceClaim,
} from "types"

import { checkAddress, decodeAddress } from "../../crypto"

/**
 * Bridge
 */
export class Bridge {
  static instance: Bridge

  private _bncClient!: BncClient

  /**
   * @param {BncClient} bncClient
   */
  constructor(bncClient: BncClient) {
    if (!Bridge.instance) {
      this._bncClient = bncClient
      Bridge.instance = this
    }

    return Bridge.instance
  }

  /**
   * transfer smart chain token to binance chain receiver
   */
  public async transferIn({
    sequence,
    contract_address,
    refund_addresses,
    receiver_addresses,
    amounts,
    relay_fee,
    expire_time,
    symbol,
    fromAddress,
  }: TransferInClaim & { sequence: number; fromAddress: string }) {
    if (sequence < 0) {
      throw new Error("sequence should not be less than 0")
    }

    if (!contract_address) {
      throw new Error("contract address should not be empty")
    }

    if (!relay_fee) {
      throw new Error("relay fee should not be empty")
    }

    if (!symbol) {
      throw new Error("symbol should not be null")
    }

    if (!checkAddress(fromAddress, this._bncClient.addressPrefix)) {
      throw new Error("fromAddress is not a valid Binance Chain address")
    }

    if (
      refund_addresses.length != receiver_addresses.length ||
      refund_addresses.length != amounts.length
    ) {
      throw new Error(
        "the length of refund address array, recipient address array and transfer amount array must be the same"
      )
    }

    const receiverAddresses = receiver_addresses.map((address) => {
      const addressHrp = address.startsWith("tbnb") ? "tbnb" : "bnb"
      if (!checkAddress(address, addressHrp)) {
        throw new Error(
          `${address} in receiver_addresses is not a valid Binance Chain address`
        )
      }

      return decodeAddress(address)
    })

    const refundAddresses = refund_addresses.map((address) => {
      if (!address.startsWith("0x")) {
        throw new Error(`${address} is invalid`)
      }

      return Buffer.from(address.slice(2), "hex")
    })

    const claimHex = Buffer.from(
      JSON.stringify({
        contract_address,
        refund_addresses: refundAddresses,
        receiver_addresses: receiverAddresses,
        amounts,
        symbol,
        relay_fee,
        expire_time,
      })
    ).toString("hex")

    return this.buildClaimAndBroadcast({
      claimHex,
      claim_type: ClaimTypes.ClaimTypeTransferIn,
      fromAddress,
      sequence,
    })
  }

  /**
   * refund tokens to sender if transfer to smart chain failed
   */
  public async transferOutRefund({
    transfer_out_sequence,
    refund_address,
    refund_reason,
    amount,
    fromAddress,
  }: TransferOutRefundClaim & {
    fromAddress: string
  }) {
    if (transfer_out_sequence < 0) {
      throw new Error("sequence should not be less than 0")
    }

    if (!amount) {
      throw new Error("amount should not be empty")
    }

    if (!refund_reason) {
      throw new Error("empty refund reason")
    }

    if (!checkAddress(fromAddress, this._bncClient.addressPrefix)) {
      throw new Error("fromAddress is not a valid Binance Chain address")
    }

    const claimHex = Buffer.from(
      JSON.stringify({
        transfer_out_sequence,
        refund_address,
        amount,
        refund_reason,
      })
    ).toString("hex")

    return this.buildClaimAndBroadcast({
      claimHex,
      claim_type: ClaimTypes.ClaimTypeTransferOutRefund,
      sequence: transfer_out_sequence,
      fromAddress,
    })
  }

  /**
   * bind smart chain token to bep2 token
   */
  public async bind({
    contractAddress,
    contractDecimal,
    amount,
    symbol,
    expireTime,
    fromAddress,
  }: {
    contractAddress: string
    contractDecimal: number
    amount: number
    symbol: string
    expireTime: number
    fromAddress: string
  }) {
    if (!checkAddress(fromAddress, this._bncClient.addressPrefix)) {
      throw new Error("fromAddress is not a valid Binance Chain address")
    }

    if (!contractAddress.startsWith("0x")) {
      throw new Error(`contractAddress "${contractAddress}" is invalid`)
    }

    const bindMsg = new BindMsg({
      from: fromAddress,
      amount: amount,
      contract_address: contractAddress,
      contract_decimals: contractDecimal,
      expire_time: expireTime,
      symbol: symbol,
    })

    return await this.broadcast(bindMsg, fromAddress)
  }

  /**
   * transfer bep2 token to smart chain
   */
  public async transferOut({
    toAddress,
    amount,
    expireTime,
    fromAddress,
  }: {
    toAddress: string
    amount: Coin
    expireTime: number
    fromAddress: string
  }) {
    if (!checkAddress(fromAddress, this._bncClient.addressPrefix)) {
      throw new Error("fromAddress is not a valid Binance Chain address")
    }

    if (!toAddress.startsWith("0x")) {
      throw new Error(`toAddress "${toAddress}" is invalid`)
    }

    const transferOut = new TransferOutMsg({
      from: fromAddress,
      to: toAddress,
      amount,
      expire_time: expireTime,
    })

    return this.broadcast(transferOut, fromAddress)
  }

  /**
   * update bind request when events from smart chain received
   */
  public async upateBind({
    sequence,
    contract_address,
    symbol,
    status,
    fromAddress,
  }: UpdateBindClaim & {
    sequence: number
    fromAddress: string
  }) {
    if (!checkAddress(fromAddress, this._bncClient.addressPrefix)) {
      throw new Error("fromAddress is not a valid Binance Chain address")
    }

    if (!contract_address.startsWith("0x")) {
      throw new Error(`toAddress "${contract_address}" is invalid`)
    }

    const claimHex = Buffer.from(
      JSON.stringify({
        status,
        symbol,
        contract_address,
      })
    ).toString("hex")

    return this.buildClaimAndBroadcast({
      claimHex,
      sequence,
      fromAddress,
      claim_type: ClaimTypes.ClaimTypeUpdateBind,
    })
  }

  public async skipSequence({
    sequence,
    sequenceToSkip,
    fromAddress,
  }: {
    sequence: number
    sequenceToSkip: number
    fromAddress: string
  }) {
    if (sequence < 0) {
      throw new Error("sequence should not be less than 0")
    }

    if (!checkAddress(fromAddress, this._bncClient.addressPrefix)) {
      throw new Error("fromAddress is not a valid Binance Chain address")
    }

    const claimHex = Buffer.from(
      JSON.stringify({
        claim_type: ClaimTypes.ClaimTypeUpdateBind,
        sequence: sequenceToSkip,
      })
    ).toString("hex")

    return this.buildClaimAndBroadcast({
      claimHex,
      sequence,
      fromAddress,
      claim_type: ClaimTypes.ClaimTypeSkipSequence,
    })
  }

  private async buildClaimAndBroadcast({
    claimHex,
    claim_type,
    sequence,
    fromAddress,
  }: {
    claimHex: string
    claim_type: ClaimTypes
    sequence: number
    fromAddress: string
  }) {
    const claimMsg = new ClaimMsg({
      claim_type,
      sequence,
      claim: claimHex,
      validator_address: fromAddress,
    })

    return await this.broadcast(claimMsg, fromAddress, sequence)
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
