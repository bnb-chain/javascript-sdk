import { BaseMsg, Msg, SignMsg } from "../"
import * as crypto from "../../../crypto"
import { AminoPrefix } from "../../tx"

import { ClaimTypes } from "./claimTypes"

export interface SignedClaimMsg extends SignMsg {
  claim_type: ClaimTypes
  sequence: number
  claim: string
  validator_address: string
}

export interface ClaimMsgData extends Msg {
  claim_type: ClaimTypes
  sequence: number
  claim: string
  validator_address: Buffer
  aminoPrefix: AminoPrefix
}

export class ClaimMsg extends BaseMsg {
  private claim_type: ClaimTypes
  private sequence: number
  private claim: string
  private validator_address: string

  constructor({
    claim_type,
    sequence,
    claim,
    validator_address,
  }: {
    claim_type: ClaimTypes
    sequence: number
    claim: string
    validator_address: string
  }) {
    super()
    this.claim_type = claim_type
    this.sequence = sequence
    this.claim = claim
    this.validator_address = validator_address
  }

  getSignMsg(): SignedClaimMsg {
    return {
      claim_type: this.claim_type,
      sequence: this.sequence,
      claim: this.claim,
      validator_address: this.validator_address,
    }
  }

  getMsg(): ClaimMsgData {
    return {
      claim_type: this.claim_type,
      sequence: this.sequence,
      claim: this.claim,
      validator_address: crypto.decodeAddress(this.validator_address),
      aminoPrefix: AminoPrefix.ClaimMsg,
    }
  }

  static defaultMsg(): ClaimMsgData {
    return {
      claim_type: ClaimTypes.ClaimTypeSkipSequence,
      sequence: 0,
      claim: "",
      validator_address: Buffer.from(""),
      aminoPrefix: AminoPrefix.ClaimMsg,
    }
  }
}
