import { BaseMsg, Msg, SignMsg } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

export interface IssueParams {
  name: string
  symbol: string
  total_supply: number
  mintable: boolean
}

export interface SignedIssueTokenMsg extends SignMsg, IssueParams {
  from: string
}

export interface IssueTokenData extends Msg, IssueParams {
  from: Buffer
  aminoPrefix: AminoPrefix
}

export class IssueTokenMsg extends BaseMsg {
  private from: string
  private params: IssueParams
  public readonly aminoPrefix: AminoPrefix = AminoPrefix.IssueMsg

  constructor(params: IssueParams, address: string) {
    super()
    this.from = address
    this.params = params
  }

  getSignMsg() {
    const signMsg: SignedIssueTokenMsg = {
      from: this.from,
      ...this.params,
    }

    return signMsg
  }

  getMsg() {
    const data: IssueTokenData = {
      from: crypto.decodeAddress(this.from),
      name: this.params.name,
      symbol: this.params.symbol,
      total_supply: this.params.total_supply,
      mintable: this.params.mintable,
      aminoPrefix: this.aminoPrefix,
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
      aminoPrefix: AminoPrefix.IssueMsg,
    }
  }
}
