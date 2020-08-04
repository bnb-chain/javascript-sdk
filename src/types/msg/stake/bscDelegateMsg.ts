import { BaseMsg, Msg, SignMsg, Coin } from ".."
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

export interface SignedBscDelegate extends SignMsg {
  delegator_addr: string
  validator_addr: string
  delegation: Coin
  side_chain_id: string
}

export interface BscDelegateData extends Msg {
  delegator_addr: Buffer
  validator_addr: Buffer
  delegation: Coin
  side_chain_id: string
  aminoPrefix: AminoPrefix
}

export class BscDelegateMsg extends BaseMsg {
  private delegator_addr: string
  private validator_addr: string
  private delegation: Coin
  private side_chain_id: string

  constructor({
    delegator_addr,
    validator_addr,
    delegation,
    side_chain_id,
  }: {
    delegator_addr: string
    validator_addr: string
    delegation: Coin
    side_chain_id: string
  }) {
    super()
    this.delegator_addr = delegator_addr
    this.validator_addr = validator_addr
    this.delegation = delegation
    this.side_chain_id = side_chain_id
  }

  getSignMsg() {
    const { denom, amount } = this.delegation
    const signMsg: SignedBscDelegate = {
      delegator_addr: this.delegator_addr,
      validator_addr: this.validator_addr,
      delegation: { denom, amount: String(amount) },
      side_chain_id: this.side_chain_id,
    }

    return {
      type: "cosmos-sdk/MsgSideChainDelegate",
      value: signMsg,
    }
  }

  getMsg() {
    const data: BscDelegateData = {
      delegator_addr: crypto.decodeAddress(this.delegator_addr),
      validator_addr: crypto.decodeAddress(this.validator_addr),
      delegation: this.delegation,
      side_chain_id: this.side_chain_id,
      aminoPrefix: AminoPrefix.MsgSideChainDelegate,
    }

    return data
  }

  static defaultMsg() {
    return {
      delegator_addr: Buffer.from(""),
      validator_addr: Buffer.from(""),
      delegation: [{ denom: "", amount: 0 }],
      side_chain_id: "",
      aminoPrefix: AminoPrefix.MsgSideChainDelegate,
    }
  }
}
