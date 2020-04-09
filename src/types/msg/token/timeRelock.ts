import { BaseMsg, Msg, SignMsg } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"
import { Coin } from "../"

export interface SignedTimeReLockMsg extends SignMsg {
  from: string
  time_lock_id: number
  description: string
  amount: Coin[]
  lock_time: number
}

export interface TimeReLockData extends Msg {
  from: Buffer
  time_lock_id: number
  description: string
  amount: Coin[]
  lock_time: number
  aminoPrefix: AminoPrefix
}

export class TimeReLockMsg extends BaseMsg {
  private from: string
  private time_lock_id: number
  private description: string
  private lock_time: number
  private amount: Coin[]
  public readonly aminoPrefix: AminoPrefix = AminoPrefix.TimeRelockMsg

  constructor({
    address,
    time_lock_id,
    description,
    amount,
    lock_time
  }: {
    address: string
    time_lock_id: number
    description: string
    amount: Coin[]
    lock_time: number
  }) {
    super()
    this.from = address
    this.description = description
    this.amount = amount
    this.lock_time = lock_time
    this.time_lock_id = time_lock_id
  }

  getSignMsg() {
    const signMsg: SignedTimeReLockMsg = {
      from: this.from,
      time_lock_id: this.time_lock_id,
      amount: this.amount,
      description: this.description,
      lock_time: this.lock_time
    }

    return signMsg
  }

  getMsg() {
    const data: TimeReLockData = {
      from: crypto.decodeAddress(this.from),
      time_lock_id: this.time_lock_id,
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
      amount: 0,
      lock_time: 0,
      aminoPrefix: AminoPrefix.TimeRelockMsg
    }
  }
}
