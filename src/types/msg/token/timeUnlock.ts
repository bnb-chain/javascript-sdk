import { BaseMsg, Msg, SignMsg } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

export interface SignedTimeUnlockMsg extends SignMsg {
  from: string
  time_lock_id: number
}

export interface TimeUnlockData extends Msg {
  from: Buffer
  time_lock_id: number
  aminoPrefix: AminoPrefix
}

export class TimeUnlockMsg extends BaseMsg {
  private from: string
  private time_lock_id: number
  public readonly aminoPrefix: AminoPrefix = AminoPrefix.TimeUnlockMsg

  constructor({
    address,
    time_lock_id,
  }: {
    address: string
    time_lock_id: number
  }) {
    super()
    this.from = address
    this.time_lock_id = time_lock_id
  }

  getSignMsg() {
    const signMsg: SignedTimeUnlockMsg = {
      from: this.from,
      time_lock_id: this.time_lock_id,
    }

    return signMsg
  }

  getMsg() {
    const data: TimeUnlockData = {
      from: crypto.decodeAddress(this.from),
      time_lock_id: this.time_lock_id,
      aminoPrefix: this.aminoPrefix,
    }

    return data
  }

  static defaultMsg() {
    return {
      from: Buffer.from(""),
      time_lock_id: 0,
      aminoPrefix: AminoPrefix.TimeUnlockMsg,
    }
  }
}
