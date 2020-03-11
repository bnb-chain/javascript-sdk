import { BaseMsg, Msg, SignMsg } from "./msg"
import * as crypto from "../crypto"
import { TxAminoPrefix } from "./stdTx"

export interface SignedCancelOrder extends SignMsg {
  sender: string
  symbol: string
  refid: string
}

export interface CancelOrderData extends Msg {
  sender: Buffer
  symbol: string
  refid: string
  aminoPrefix: TxAminoPrefix
}

export class CancelOrderMsg extends BaseMsg {
  private address: string
  private symbol: string
  private orderId: string
  public readonly aminoPrefix: TxAminoPrefix = TxAminoPrefix.CancelOrderMsg
  constructor(address: string, sybmol: string, orderId: string) {
    super()
    this.address = address
    this.symbol = sybmol
    this.orderId = orderId
  }

  getSignMsg() {
    const signMsg: SignedCancelOrder = {
      sender: this.address,
      symbol: this.symbol,
      refid: this.orderId
    }

    return signMsg
  }

  getMsg() {
    const data: CancelOrderData = {
      sender: crypto.decodeAddress(this.address),
      symbol: this.symbol,
      refid: this.orderId,
      aminoPrefix: this.aminoPrefix
    }

    return data
  }
}
