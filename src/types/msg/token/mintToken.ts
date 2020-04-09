import { BaseMsg, Msg, SignMsg } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"
import Big from "big.js"

export interface SignedMintTokenMsg extends SignMsg {
  from: string
  symbol: string
  amount: number
}

export interface MintTokenData extends Msg {
  from: Buffer
  symbol: string
  amount: number
  aminoPrefix: AminoPrefix
}

export class MintTokenMsg extends BaseMsg {
  private from: string
  private symbol: string
  private amount: number
  public readonly aminoPrefix: AminoPrefix = AminoPrefix.MintMsg

  constructor({
    address,
    sybmol,
    amount
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
    const signMsg: SignedMintTokenMsg = {
      from: this.from,
      amount: Number(new Big(this.amount).mul(Math.pow(10, 8)).toString()),
      symbol: this.symbol
    }

    return signMsg
  }

  getMsg() {
    const data: MintTokenData = {
      from: crypto.decodeAddress(this.from),
      symbol: this.symbol,
      amount: Number(new Big(this.amount).mul(Math.pow(10, 8)).toString()),
      aminoPrefix: this.aminoPrefix
    }

    return data
  }

  static defaultMsg() {
    return {
      from: Buffer.from(""),
      symbol: "",
      amount: 0,
      aminoPrefix: AminoPrefix.MintMsg
    }
  }
}
