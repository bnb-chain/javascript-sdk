import { StdTx } from "./stdTx"

export interface ResultTx {
  hash: Buffer | string
  height: number
  index: number
  tx_result: ResponseDeliverTx
  tx: Buffer | StdTx
  proof?: TxProof
}

export interface ResponseDeliverTx {
  code?: number
  data?: string
  log?: string
  info?: string
  gas_wanted?: number
  gas_used?: number
  events?: Event[]
  tags?: KVPair[]
  codespace?: string
}

export interface TxProof {
  rootHash: Buffer
  data: Buffer
  proof: {
    total: number
    index: number
    leaf_hash: Buffer
    aunts: Buffer[]
  }
}

export interface Event {
  type?: string
  attributes?: KVPair[]
}

export interface KVPair {
  key: string
  value: string
}
