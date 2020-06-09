import { Coin } from ".."

export enum ClaimTypes {
  ClaimTypeSkipSequence = 0x1,
  ClaimTypeUpdateBind = 0x2,
  ClaimTypeTransferOutRefund = 0x3,
  ClaimTypeTransferIn = 0x4,
}

export enum RefundReason {
  UnboundToken = 1,
  Timeout = 2,
  InsufficientBalance = 3,
  Unkown = 4,
}

export enum BindStatus {
  BindStatusSuccess = 0,
  BindStatusRejected = 1,
  BindStatusTimeout = 2,
  BindStatusInvalidParameter = 3,
}

export interface TransferInClaim {
  contract_address: string
  refund_addresses: string[]
  receiver_addresses: string[]
  amounts: number[]
  symbol: string
  relay_fee: Coin
  expire_time: number
}

export interface TransferOutRefundClaim {
  transfer_out_sequence: number
  refund_address: string
  amount: Coin
  refund_reason: RefundReason
}

export interface UpdateBindClaim {
  status: BindStatus
  symbol: string
  contract_address: string
}

export interface SkipSequenceClaim {
  claim_type: ClaimTypes
  sequenceToSkip: number
}
