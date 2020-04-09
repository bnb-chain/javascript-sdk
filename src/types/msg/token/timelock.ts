import { BaseMsg, Msg, SignMsg } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"
import { Coin } from "../"

export interface SignedTimeLockMsg extends SignMsg {
  from: string
  description: string
  amount: Coin[]
  lock_time: number
}

export interface TimeLockData extends Msg {
  from: Buffer
  description: string
  amount: Coin[]
  lock_time: number
  aminoPrefix: AminoPrefix
}

export class TimeLockMsg extends BaseMsg {
  private from: string
  private description: string
  private lock_time: number
  private amount: Coin[]
  public readonly aminoPrefix: AminoPrefix = AminoPrefix.TimeLockMsg

  constructor({
    address,
    description,
    amount,
    lock_time
  }: {
    address: string
    description: string
    amount: Coin[]
    lock_time: number
  }) {
    super()
    this.from = address
    this.description = description
    this.amount = amount
    this.lock_time = lock_time
  }

  getSignMsg() {
    const signMsg: SignedTimeLockMsg = {
      from: this.from,
      amount: this.amount,
      description: this.description,
      lock_time: this.lock_time
    }

    return signMsg
  }

  getMsg() {
    const data: TimeLockData = {
      from: crypto.decodeAddress(this.from),
      description: this.description,
      amount: this.amount,
      lock_time: this.lock_time,
      aminoPrefix: this.aminoPrefix
    }

    return data
  }

  static defaultMsg() {
    return {
      from: Buffer.from(""),
      description: "",
      amount: [{ denom: "", amount: 0 }],
      lock_time: 0,
      aminoPrefix: AminoPrefix.TimeLockMsg
    }
  }
}
