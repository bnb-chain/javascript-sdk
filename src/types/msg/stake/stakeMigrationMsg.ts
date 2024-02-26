import { BaseMsg, Msg, SignMsg, Coin } from ".."
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

export interface SignedStakeMigrationMsg extends SignMsg {
  delegator_addr: string
  validator_src_addr: string
  validator_dst_addr: string
  refund_addr: string
  amount: Coin
}

export interface StakeMigrationData extends Msg {
  validator_src_addr: Buffer
  validator_dst_addr: Buffer
  delegator_addr: Buffer
  refund_addr: Buffer
  amount: Coin
  aminoPrefix: AminoPrefix
}

export class StakeMigrationMsg extends BaseMsg {
  private delegator_addr: string
  private validator_src_addr: string
  private validator_dst_addr: string
  private refund_addr: string
  private amount: Coin

  constructor({
    delegator_addr,
    validator_src_addr,
    validator_dst_addr,
    amount,
    refund_addr,
  }: {
    delegator_addr: string
    validator_src_addr: string
    validator_dst_addr: string
    amount: Coin
    refund_addr: string
  }) {
    super()
    this.delegator_addr = delegator_addr
    this.validator_src_addr = validator_src_addr
    this.validator_dst_addr = validator_dst_addr
    this.amount = amount
    this.refund_addr = refund_addr
  }

  getSignMsg() {
    const { denom, amount } = this.amount
    const signMsg: SignedStakeMigrationMsg = {
      delegator_addr: this.delegator_addr,
      validator_src_addr: this.validator_src_addr,
      validator_dst_addr: this.validator_dst_addr,
      amount: { denom, amount: String(amount) },
      refund_addr: this.refund_addr,
    }

    return {
      type: "cosmos-sdk/MsgSideChainStakeMigration",
      value: signMsg,
    }
  }

  getMsg() {
    const data: StakeMigrationData = {
      delegator_addr: crypto.decodeAddress(this.delegator_addr),
      validator_src_addr: crypto.decodeAddress(this.validator_src_addr),
      validator_dst_addr: crypto.decodeAddress(this.validator_dst_addr),
      amount: this.amount,
      refund_addr: crypto.decodeAddress(this.refund_addr),
      aminoPrefix: AminoPrefix.MsgSideChainStakeMigration,
    }

    return data
  }

  static defaultMsg() {
    return {
      delegator_addr: Buffer.from(""),
      validator_src_addr: Buffer.from(""),
      validator_dst_addr: Buffer.from(""),
      amount: [{ denom: "", amount: 0 }],
      refund_addr: Buffer.from(""),
      aminoPrefix: AminoPrefix.MsgSideChainStakeMigration,
    }
  }
}
