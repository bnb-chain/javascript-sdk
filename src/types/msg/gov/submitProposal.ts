import { BaseMsg, Msg, SignMsg, Coin } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

const proposalTypeMapping = {
  0x04: "ListTradingPair",
  0x00: "Nil",
  0x01: "Text",
  0x02: "ParameterChange",
  0x03: "SoftwareUpgrade",
  0x05: "FeeChange",
  0x06: "CreateValidator",
  0x07: "RemoveValidator"
} as const

export interface SignedSubmitProposal extends SignMsg {
  title: string
  description: string
  proposal_type: string
  proposer: string
  initial_deposit: { denom: string; amount: string }[]
  voting_period: string
}

export interface SubmitProposalData extends Msg {
  title: string
  description: string
  proposal_type: keyof typeof proposalTypeMapping
  proposer: Buffer
  initial_deposit: Coin[]
  voting_period: number
  aminoPrefix: AminoPrefix
}

export class SubmitProposalMsg extends BaseMsg {
  private title: string
  private description: string
  private proposal_type: keyof typeof proposalTypeMapping
  private address: string
  private initialDeposit: number
  private voting_period: number

  constructor({
    address,
    title,
    proposal_type,
    initialDeposit,
    voting_period,
    description
  }: {
    title: string
    description: string
    proposal_type: keyof typeof proposalTypeMapping
    address: string
    initialDeposit: number
    voting_period: number
  }) {
    super()
    this.address = address
    this.title = title
    this.proposal_type = proposal_type
    this.initialDeposit = initialDeposit
    this.voting_period = voting_period
    this.description = description
  }

  getSignMsg() {
    const signMsg: SignedSubmitProposal = {
      title: this.title,
      description: this.description,
      proposal_type: proposalTypeMapping[this.proposal_type],
      proposer: this.address,
      voting_period: this.voting_period.toString(),
      initial_deposit: [
        {
          denom: "BNB",
          amount: new Big(this.initialDeposit).mul(Math.pow(10, 8)).toString()
        }
      ]
    }

    return signMsg
  }

  getMsg() {
    const data: SubmitProposalData = {
      title: this.title,
      description: this.description,
      proposal_type: this.proposal_type,
      proposer: crypto.decodeAddress(this.address),
      initial_deposit: [
        {
          denom: "BNB",
          amount: +new Big(this.initialDeposit).mul(Math.pow(10, 8)).toString()
        }
      ],
      voting_period: this.voting_period,
      aminoPrefix: AminoPrefix.MsgSubmitProposal
    }

    return data
  }

  static defaultMsg() {
    return {
      title: "",
      description: "",
      propsal_type: 0,
      proposer: Buffer.from(""),
      inital_deposit: [{ denom: "", amount: 0 }],
      voting_period: 0,
      aminoPrefix: AminoPrefix.MsgSubmitProposal
    }
  }
}
