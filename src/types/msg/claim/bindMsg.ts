import { BaseMsg, Msg, SignMsg } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

export interface SignedBindMsg extends SignMsg {
  from: string
  symbol: string
  amount: number
  contract_address: string
  contract_decimals: number
  expire_time: number
}

export interface BindMsgData extends Msg {
  from: Buffer
  symbol: string
  amount: number
  contract_address: Buffer
  contract_decimals: number
  expire_time: number
  aminoPrefix: AminoPrefix
}

export class BindMsg extends BaseMsg {
  private from: string
  private symbol: string
  private amount: number
  private contract_address: string
  private contract_decimals: number
  private expire_time: number

  constructor({
    from,
    symbol,
    amount,
    contract_address,
    contract_decimals,
    expire_time,
  }: {
    from: string
    symbol: string
    amount: number
    contract_address: string
    contract_decimals: number
    expire_time: number
  }) {
    super()
    this.from = from
    this.symbol = symbol
    this.amount = amount
    this.contract_address = contract_address
    this.contract_decimals = contract_decimals
    this.expire_time = expire_time
  }

  getSignMsg(): SignedBindMsg {
    return {
      from: this.from,
      symbol: this.symbol,
      amount: this.amount,
      contract_address: this.contract_address,
      contract_decimals: this.contract_decimals,
      expire_time: this.expire_time,
    }
  }

  getMsg(): BindMsgData {
    return {
      from: crypto.decodeAddress(this.from),
      symbol: this.symbol,
      amount: this.amount,
      contract_address: Buffer.from(this.contract_address.slice(2)),
      contract_decimals: this.contract_decimals,
      expire_time: this.expire_time,
      aminoPrefix: AminoPrefix.BindMsg,
    }
  }

  static defaultMsg(): BindMsgData {
    return {
      from: Buffer.from(""),
      symbol: "",
      amount: 0,
      contract_address: Buffer.from(""),
      contract_decimals: 0,
      expire_time: 0,
      aminoPrefix: AminoPrefix.BindMsg,
    }
  }
}
