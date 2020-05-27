import { Coin } from ".."

export enum ClaimTypes {
  ClaimTypeSkipSequence = 0x1,
  ClaimTypeUpdateBind = 0x2,
  ClaimTypeTransferOutRefund = 0x3,
  ClaimTypeTransferIn = 0x4,
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
