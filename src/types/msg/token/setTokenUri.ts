import { BaseMsg, Msg, SignMsg } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

export interface SignedSetUri extends SignMsg {
  from: string
  symbol: string
  token_uri: string
}

export interface SetUriData extends Msg {
  from: Buffer
  symbol: string
  token_uri: string
  aminoPrefix: AminoPrefix
}

export class SetTokenUriMsg extends BaseMsg {
  private from: string
  private symbol: string
  private token_uri: string

  constructor({ from, symbol, token_uri }: SignedSetUri) {
    super()
    this.from = from
    this.symbol = symbol
    this.token_uri = token_uri
  }

  getSignMsg() {
    const signMsg: SignedSetUri = {
      from: this.from,
      symbol: this.symbol,
      token_uri: this.token_uri,
    }

    return signMsg
  }

  getMsg() {
    const data: SetUriData = {
      from: crypto.decodeAddress(this.from),
      symbol: this.symbol,
      token_uri: this.token_uri,
      aminoPrefix: AminoPrefix.SetURIMsg,
    }

    return data
  }

  static defaultMsg() {
    return {
      from: Buffer.from(""),
      symbol: "",
      token_uri: "",
      aminoPrefix: AminoPrefix.SetURIMsg,
    }
  }
}
