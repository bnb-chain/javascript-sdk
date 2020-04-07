import { BaseMsg, Msg, SignMsg } from "./msg"
import * as crypto from "../crypto"
import { AminoPrefix } from "./stdTx"

export interface NewOrder {
  id: string
  symbol: string
  ordertype: number
  side: number
  price: number
  quantity: number
  timeinforce: number
}

export interface SignedNewOrder extends SignMsg, NewOrder {
  sender: string
}

export interface NewOrderData extends Msg, NewOrder {
  sender: Buffer
  aminoPrefix: AminoPrefix
}

export class NewOrderMsg extends BaseMsg {
  private newOrder: NewOrder
  private address: string
  public readonly aminoPrefix: AminoPrefix = AminoPrefix.NewOrderMsg

  constructor(data: NewOrder, address: string) {
    super()
    this.newOrder = data
    this.address = address
  }

  getSignMsg() {
    const signMsg: SignedNewOrder = {
      sender: this.address,
      ...this.newOrder
    }
    return signMsg
  }

  getMsg() {
    const data: NewOrderData = {
      sender: crypto.decodeAddress(this.address),
      ...this.newOrder,
      aminoPrefix: this.aminoPrefix
    }

    return data
  }
}
