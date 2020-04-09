import { BaseMsg, Msg, SignMsg } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"
import Big from "big.js"

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

const BASENUMBER = Math.pow(10, 8)

export class NewOrderMsg extends BaseMsg {
  private newOrder: NewOrder
  private address: string
  public readonly aminoPrefix: AminoPrefix = AminoPrefix.NewOrderMsg

  constructor(data: NewOrder, address: string) {
    super()
    const bigPrice = new Big(data.price)
    const bigQuantity = new Big(data.quantity)

    this.newOrder = data
    this.newOrder.price = Number(bigPrice.mul(BASENUMBER).toString())
    this.newOrder.quantity = Number(bigQuantity.mul(BASENUMBER).toString())
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
      id: this.newOrder.id,
      symbol: this.newOrder.symbol,
      ordertype: this.newOrder.ordertype,
      side: this.newOrder.side,
      price: this.newOrder.price,
      quantity: this.newOrder.quantity,
      timeinforce: this.newOrder.timeinforce,
      aminoPrefix: this.aminoPrefix
    }

    return data
  }

  static defaultMsg() {
    return {
      sender: Buffer.from(""),
      id: "",
      symbol: "",
      orderType: 0,
      side: 0,
      price: 0,
      quantity: 0,
      timeinforce: 0,
      aminoPrefix: AminoPrefix.NewOrderMsg
    }
  }
}
