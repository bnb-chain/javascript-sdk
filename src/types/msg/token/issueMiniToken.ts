import { BaseMsg, Msg, SignMsg } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

export interface SignedIssueMiniTokenMsg extends SignMsg {
  name: string
  symbol: string
  total_supply: number
  mintable: boolean
  from: string
  token_uri: string | undefined
}

export interface IssueMiniTokenData extends Msg {
  name: string
  symbol: string
  total_supply: number
  mintable: boolean
  from: Buffer
  token_uri: string | undefined
  aminoPrefix: AminoPrefix
}

export class IssueMiniTokenMsg extends BaseMsg {
  private params: SignedIssueMiniTokenMsg

  constructor(params: SignedIssueMiniTokenMsg) {
    super()
    this.params = params
  }

  getSignMsg() {
    const signMsg: SignedIssueMiniTokenMsg = {
      ...this.params,
    }

    return signMsg
  }

  getMsg() {
    const data: IssueMiniTokenData = {
      from: crypto.decodeAddress(this.params.from),
      name: this.params.name,
      symbol: this.params.symbol,
      total_supply: this.params.total_supply,
      mintable: this.params.mintable,
      token_uri: this.params.token_uri,
      aminoPrefix: AminoPrefix.IssueMiniMsg,
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
      aminoPrefix: AminoPrefix.IssueMiniMsg,
    }
  }
}
