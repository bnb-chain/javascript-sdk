import { BaseMsg, Msg, SignMsg } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

export interface SignedIssueTinyTokenMsg extends SignMsg {
  name: string
  symbol: string
  total_supply: number
  mintable: boolean
  from: string
  token_uri: string | undefined
}

export interface IssueTinyTokenData extends Msg {
  name: string
  symbol: string
  total_supply: number
  mintable: boolean
  from: Buffer
  token_uri: string | undefined
  aminoPrefix: AminoPrefix
}

export class IssueTinyTokenMsg extends BaseMsg {
  private params: SignedIssueTinyTokenMsg

  constructor(params: SignedIssueTinyTokenMsg) {
    super()
    this.params = params
  }

  getSignMsg() {
    const signMsg: SignedIssueTinyTokenMsg = {
      ...this.params,
    }

    return signMsg
  }

  getMsg() {
    const data: IssueTinyTokenData = {
      from: crypto.decodeAddress(this.params.from),
      name: this.params.name,
      symbol: this.params.symbol,
      total_supply: this.params.total_supply,
      mintable: this.params.mintable,
      token_uri: this.params.token_uri,
      aminoPrefix: AminoPrefix.IssueTinyMsg,
    }

    return data
  }

  static defaultMsg() {
    return {
      from: Buffer.from,
      name: "",
      symbol: "",
      total_supply: 0,
      mintable: false,
      token_uri: "",
      aminoPrefix: AminoPrefix.IssueTinyMsg,
    }
  }
}
