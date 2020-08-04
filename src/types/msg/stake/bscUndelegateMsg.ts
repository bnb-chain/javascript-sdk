import { BaseMsg, Msg, SignMsg, Coin } from ".."
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

export interface SignedBscUndelegate extends SignMsg {
  delegator_addr: string
  validator_addr: string
  amount: Coin
  side_chain_id: string
}

export interface BscUndelegateData extends Msg {
  delegator_addr: Buffer
  validator_addr: Buffer
  amount: Coin
  side_chain_id: string
  aminoPrefix: AminoPrefix
}

export class BscUndelegateMsg extends BaseMsg {
  private delegator_addr: string
  private validator_addr: string
  private amount: Coin
  private side_chain_id: string

  constructor({
    delegator_addr,
    validator_addr,
    amount,
    side_chain_id,
  }: {
    delegator_addr: string
    validator_addr: string
    amount: Coin
    side_chain_id: string
  }) {
    super()
    this.delegator_addr = delegator_addr
    this.validator_addr = validator_addr
    this.amount = amount
    this.side_chain_id = side_chain_id
  }

  getSignMsg() {
    const { denom, amount } = this.amount
    const signMsg: SignedBscUndelegate = {
      delegator_addr: this.delegator_addr,
      validator_addr: this.validator_addr,
      amount: { denom, amount: String(amount) },
      side_chain_id: this.side_chain_id,
    }

    return {
      type: "cosmos-sdk/MsgSideChainUndelegate",
      value: signMsg,
    }
  }

  getMsg() {
    const data: BscUndelegateData = {
      delegator_addr: crypto.decodeAddress(this.delegator_addr),
      validator_addr: crypto.decodeAddress(this.validator_addr),
      amount: this.amount,
      side_chain_id: this.side_chain_id,
      aminoPrefix: AminoPrefix.MsgSideChainUndelegate,
    }

    return data
  }

  static defaultMsg() {
    return {
      delegator_addr: Buffer.from(""),
      validator_addr: Buffer.from(""),
      amount: [{ denom: "", amount: 0 }],
      side_chain_id: "",
      aminoPrefix: AminoPrefix.MsgSideChainUndelegate,
    }
  }
}
