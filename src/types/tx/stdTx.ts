import { BaseMsg, Msg } from "../msg"

export interface StdSignMsg {
  chainId: string
  accountNumber: number
  sequence: number
  baseMsg?: BaseMsg
  msg?: Msg
  memo: string
  source: number
  data?: Buffer | null | string
}

export interface StdSignature {
  pub_key?: Buffer
  signature: Buffer
  account_number: number
  sequence: number
}

export interface StdTx {
  msg: Array<Msg>
  signatures: Array<StdSignature>
  memo: string
  source: number
  data?: Buffer | null | string
  aminoPrefix: AminoPrefix
}

export enum AminoPrefix {
  MsgSend = "2A2C87FA",
  NewOrderMsg = "CE6DC043",
  CancelOrderMsg = "166E681B",
  IssueMsg = "17EFAB80",
  BurnMsg = "7ED2D2A0",
  FreezeMsg = "E774B32D",
  UnfreezeMsg = "6515FF0D",
  MintMsg = "467E0829",
  ListMsg = "B41DE13F",
  StdTx = "F0625DEE",
  PubKeySecp256k1 = "EB5AE987",
  SignatureSecp256k1 = "7FC4A495",
  MsgSubmitProposal = "B42D614E",
  MsgDeposit = "A18A56E5",
  MsgVote = "A1CADD36",
  TimeLockMsg = "07921531",
  TimeUnlockMsg = "C4050C6C",
  TimeRelockMsg = "504711DA",
  HTLTMsg = "B33F9A24",
  DepositHTLTMsg = "63986496",
  ClaimHTLTMsg = "C1665300",
  RefundHTLTMsg = "3454A27C",
  SetAccountFlagsMsg = "BEA6E301",
  BnbchainAccount = "4BDC4C27",
  BnbchainToken = "140364E6",
  MsgCreateValidator = "EB361D01",
  MsgRemoveValidator = "C1AFE85F",
  MsgCreateValidatorProposal = "DB6A19FD",
  MsgEditValidator = "C2E8BCCD",
  MsgDelegate = "921D2E4E",
  MsgBeginUnbonding = "A3823C9A",
  MsgBeginRedelegate = "267996D2",
  MsgCreateSideChainValidator = "D17201E5",
  MsgEditSideChainValidator = "264CC57B",
  MsgSideChainDelegate = "E3A07FD2",
  MsgSideChainRedelegate = "E3CED364",
  MsgSideChainUndelegate = "514F7E0E",
  Claim = "4E781C11",
  ClaimMsg = "175A0521",
  BindMsg = "B9AE640C",
  TransferOutMsg = "800819C0",
}
