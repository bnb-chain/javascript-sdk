import Big from "big.js"

import { BaseMsg, Msg, SignMsg, Coin } from ".."
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

export interface SignedTransferOutMsg extends SignMsg {
  from: string
  to: string
  amount: Coin
  expire_time: number
}

export interface TransferoutData extends Msg {
  from: Buffer
  to: Buffer
  amount: Coin
  expire_time: number
  aminoPrefix: AminoPrefix
}

export class TransferOutMsg extends BaseMsg {
  private from: string
  private to: string
  private amount: Coin
  private expire_time: number

  constructor({
    from,
    to,
    amount,
    expire_time,
  }: {
    from: string
    to: string
    amount: Coin
    expire_time: number
  }) {
    super()
    this.from = from
    this.to = to
    this.amount = {
      ...amount,
      amount: new Big(amount.amount).mul(Math.pow(10, 8)).toString(),
    }
    this.expire_time = expire_time
  }

  getSignMsg(): SignedTransferOutMsg {
    return {
      from: this.from,
      to: this.to,
      amount: this.amount,
      expire_time: this.expire_time,
    }
  }

  getMsg(): TransferoutData {
    return {
      from: crypto.decodeAddress(this.from),
      to: Buffer.from(this.to.slice(2), "hex"),
      amount: this.amount,
      expire_time: this.expire_time,
      aminoPrefix: AminoPrefix.TransferOutMsg,
    }
  }

  static defaultMsg(): TransferoutData {
    return {
      from: Buffer.from(""),
      to: Buffer.from(""),
      amount: { denom: "", amount: 0 },
      expire_time: 0,
      aminoPrefix: AminoPrefix.TransferOutMsg,
    }
  }
}
