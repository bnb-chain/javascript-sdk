import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"
import { BaseMsg, Msg, SignMsg } from "../base"

export interface SignedListMini extends SignMsg {
  from: string
  base_asset_symbol: string
  quote_asset_symbol: string
  init_price: number
}

export interface ListMiniData extends Msg {
  from: Buffer
  base_asset_symbol: string
  quote_asset_symbol: string
  init_price: number
  aminoPrefix: AminoPrefix
}

export class ListMiniMsg extends BaseMsg {
  private from: string
  private base_asset_symbol: string
  private quote_asset_symbol: string
  private init_price: number

  constructor({
    from,
    base_asset_symbol,
    quote_asset_symbol,
    init_price,
  }: SignedListMini) {
    super()
    this.from = from
    this.base_asset_symbol = base_asset_symbol
    this.quote_asset_symbol = quote_asset_symbol
    this.init_price = init_price
  }

  getSignMsg() {
    const signMsg: SignedListMini = {
      from: this.from,
      base_asset_symbol: this.base_asset_symbol,
      quote_asset_symbol: this.quote_asset_symbol,
      init_price: this.init_price,
    }

    return signMsg
  }

  getMsg() {
    const data: ListMiniData = {
      from: crypto.decodeAddress(this.from),
      base_asset_symbol: this.base_asset_symbol,
      quote_asset_symbol: this.quote_asset_symbol,
      init_price: this.init_price,
      aminoPrefix: AminoPrefix.ListMiniMsg,
    }

    return data
  }

  static defaultMsg() {
    return {
      from: Buffer.from(""),
      base_asset_symbol: "",
      quote_asset_symbol: "",
      init_price: 0,
      aminoPrefix: AminoPrefix.ListMiniMsg,
    }
  }
}
