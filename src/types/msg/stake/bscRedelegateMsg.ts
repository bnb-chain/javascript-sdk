import { BaseMsg, Msg, SignMsg, Coin } from ".."
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

export interface SignedBscReDelegate extends SignMsg {
  delegator_addr: string
  validator_src_addr: string
  validator_dst_addr: string
  amount: Coin
  side_chain_id: string
}

export interface BscReDelegateData extends Msg {
  delegator_addr: Buffer
  validator_src_addr: Buffer
  validator_dst_addr: Buffer
  amount: Coin
  side_chain_id: string
  aminoPrefix: AminoPrefix
}

export class BscReDelegateMsg extends BaseMsg {
  private delegator_addr: string
  private validator_src_addr: string
  private validator_dst_addr: string
  private amount: Coin
  private side_chain_id: string

  constructor({
    delegator_addr,
    validator_src_addr,
    validator_dst_addr,
    amount,
    side_chain_id,
  }: {
    delegator_addr: string
    validator_src_addr: string
    validator_dst_addr: string
    amount: Coin
    side_chain_id: string
  }) {
    super()
    this.delegator_addr = delegator_addr
    this.validator_src_addr = validator_src_addr
    this.validator_dst_addr = validator_dst_addr
    this.amount = amount
    this.side_chain_id = side_chain_id
  }

  getSignMsg() {
    const { denom, amount } = this.amount
    const signMsg: SignedBscReDelegate = {
      delegator_addr: this.delegator_addr,
      validator_src_addr: this.validator_src_addr,
      validator_dst_addr: this.validator_dst_addr,
      amount: { denom, amount: String(amount) },
      side_chain_id: this.side_chain_id,
    }

    return {
      type: "cosmos-sdk/MsgSideChainRedelegate",
      value: signMsg,
    }
  }

  getMsg() {
    const data: BscReDelegateData = {
      delegator_addr: crypto.decodeAddress(this.delegator_addr),
      validator_src_addr: crypto.decodeAddress(this.validator_src_addr),
      validator_dst_addr: crypto.decodeAddress(this.validator_dst_addr),
      amount: this.amount,
      side_chain_id: this.side_chain_id,
      aminoPrefix: AminoPrefix.MsgSideChainRedelegate,
    }

    return data
  }

  static defaultMsg() {
    return {
      delegator_addr: Buffer.from(""),
      validator_src_addr: Buffer.from(""),
      validator_dst_addr: Buffer.from(""),
      amount: [{ denom: "", amount: 0 }],
      side_chain_id: "",
      aminoPrefix: AminoPrefix.MsgSideChainRedelegate,
    }
  }
}
