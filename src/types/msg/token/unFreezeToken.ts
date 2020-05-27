import { BaseMsg, Msg, SignMsg } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

export interface SignedUnFreezeToken extends SignMsg {
  from: string
  symbol: string
  amount: number
}

export interface UnFreezeTokenData extends Msg {
  from: Buffer
  symbol: string
  amount: number
  aminoPrefix: AminoPrefix
}

export class UnFreezeTokenMsg extends BaseMsg {
  private from: string
  private symbol: string
  private amount: number

  constructor({
    address,
    sybmol,
    amount,
  }: {
    address: string
    sybmol: string
    amount: number
  }) {
    super()
    this.from = address
    this.symbol = sybmol
    this.amount = amount
  }

  getSignMsg() {
    const signMsg: SignedUnFreezeToken = {
      from: this.from,
      symbol: this.symbol,
      amount: this.amount,
    }

    return signMsg
  }

  getMsg() {
    const data: UnFreezeTokenData = {
      from: crypto.decodeAddress(this.from),
      symbol: this.symbol,
      amount: this.amount,
      aminoPrefix: AminoPrefix.UnfreezeMsg,
    }

    return data
  }

  static defaultMsg() {
    return {
      from: Buffer.from(""),
      symbol: "",
      amount: 0,
      aminoPrefix: AminoPrefix.UnfreezeMsg,
    }
  }
}
