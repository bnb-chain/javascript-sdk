import { Coin as CoinType, AminoPrefix } from "../types/"

export class Token {
  public aminoPrefix = AminoPrefix.BnbchainToken

  public name: string
  public symbol: string
  public original_symbol: string
  public total_supply: number
  public owner: Buffer
  public mintable: boolean

  constructor(
    opts: Partial<{
      name: string
      symbol: string
      original_symbol: string
      total_supply: number
      owner: Buffer
      mintable: boolean
    }> = {}
  ) {
    this.name = opts.name || ""
    this.symbol = opts.symbol || ""
    this.original_symbol = opts.original_symbol || ""
    this.total_supply = opts.total_supply || 0
    this.owner = opts.owner || Buffer.alloc(0)
    this.mintable = opts.mintable || false
  }
}

export class TokenOfList {
  public name: string
  public symbol: string
  public original_symbol: string
  public total_supply: number
  public owner: Buffer
  public mintable: boolean

  constructor(
    opts: Partial<{
      name: string
      symbol: string
      original_symbol: string
      total_supply: number
      owner: Buffer
      mintable: boolean
    }> = {}
  ) {
    this.name = opts.name || ""
    this.symbol = opts.symbol || ""
    this.original_symbol = opts.original_symbol || ""
    this.total_supply = opts.total_supply || 0
    this.owner = opts.owner || Buffer.alloc(0)
    this.mintable = opts.mintable || false
  }
}

export class Coin {
  public denom: CoinType["denom"]
  public amount: CoinType["amount"]

  constructor(opts: Partial<CoinType> = {}) {
    this.denom = opts.denom || ""
    this.amount = opts.amount || 0
  }
}

export class BaseAccount {
  public address: Buffer
  public coins: Coin[]
  public public_key: Buffer
  public account_number: number
  public sequence: number

  constructor(
    opts: Partial<{
      address: Buffer
      coins: Coin[]
      public_key: Buffer
      account_number: number
      sequence: number
    }> = {}
  ) {
    this.address = opts.address || Buffer.alloc(0)
    this.coins = opts.coins || [new Coin()]
    this.public_key = opts.public_key || Buffer.alloc(0)
    this.account_number = opts.account_number || 0
    this.sequence = opts.sequence || 0
  }
}

export class AppAccount {
  public aminoPrefix = AminoPrefix.BnbchainAccount

  public base: BaseAccount
  public name: string
  public locked: Coin[]
  public frozen: Coin[]

  constructor(
    opts: Partial<{
      base: BaseAccount
      name: string
      locked: Coin[]
      frozen: Coin[]
    }> = {}
  ) {
    this.base = opts.base || new BaseAccount()
    this.name = opts.name || ""
    this.locked = opts.locked || [new Coin()]
    this.frozen = opts.frozen || [new Coin()]
  }
}

export class TokenBalance {
  public symbol: string
  public free: number
  public locked: number
  public frozen: number

  constructor(
    opts: Partial<{
      symbol: string
      free: number
      locked: number
      frozen: number
    }> = {}
  ) {
    this.symbol = opts.symbol || ""
    this.free = opts.free || 0
    this.locked = opts.locked || 0
    this.frozen = opts.frozen || 0
  }
}

export class OpenOrder {
  public id: string
  public symbol: string
  public price: number
  public quantity: number
  public cumQty: number
  public createdHeight: number
  public createdTimestamp: number
  public lastUpdatedHeight: number
  public lastUpdatedTimestamp: number

  constructor(
    opts: Partial<{
      id: string
      symbol: string
      price: number
      quantity: number
      cumQty: number
      createdHeight: number
      createdTimestamp: number
      lastUpdatedHeight: number
      lastUpdatedTimestamp: number
    }> = {}
  ) {
    this.id = opts.id || ""
    this.symbol = opts.symbol || ""
    this.price = opts.price || 0
    this.quantity = opts.quantity || 0
    this.cumQty = opts.cumQty || 0
    this.createdHeight = opts.createdHeight || 0
    this.createdTimestamp = opts.createdTimestamp || 0
    this.lastUpdatedHeight = opts.lastUpdatedHeight || 0
    this.lastUpdatedTimestamp = opts.lastUpdatedTimestamp || 0
  }
}

export class TradingPair {
  public base_asset_symbol: string
  public quote_asset_symbol: string
  public list_price: number
  public tick_size: number
  public lot_size: number

  constructor(
    opts: Partial<{
      base_asset_symbol: string
      quote_asset_symbol: string
      list_price: number
      tick_size: number
      lot_size: number
    }> = {}
  ) {
    this.base_asset_symbol = opts.base_asset_symbol || ""
    this.quote_asset_symbol = opts.quote_asset_symbol || ""
    this.list_price = opts.list_price || 0
    this.tick_size = opts.tick_size || 0
    this.lot_size = opts.lot_size || 0
  }
}

export class OrderBookLevel {
  public buyQty: number
  public buyPrice: number
  public sellQty: number
  public sellPrice: number

  constructor(
    opts: Partial<{
      buyQty: number
      buyPrice: number
      sellQty: number
      sellPrice: number
    }> = {}
  ) {
    this.buyQty = opts.buyQty || 0
    this.buyPrice = opts.buyPrice || 0
    this.sellQty = opts.sellQty || 0
    this.sellPrice = opts.sellPrice || 0
  }
}

export class OrderBook {
  public height: number
  public levels: OrderBookLevel[]

  constructor(
    opts: Partial<{ height: number; levels: OrderBookLevel[] }> = {}
  ) {
    this.height = opts.height || 0
    this.levels = opts.levels || [new OrderBookLevel()]
  }
}

export class SubmitProposalMsg {
  public aminoPrefix = AminoPrefix.MsgSubmitProposal

  public title: string
  public description: string
  public proposal_type: number
  public proposer: Buffer
  public initial_deposit: number[]
  public voting_period: number

  constructor(
    opts: Partial<{
      title: string
      description: string
      proposal_type: number
      proposer: Buffer
      initial_deposit: number[]
      voting_period: number
    }> = {}
  ) {
    opts = opts || {}
    this.title = opts.title || ""
    this.description = opts.description || ""
    this.proposal_type = opts.proposal_type || 0
    this.proposer = opts.proposer || Buffer.alloc(0)
    this.initial_deposit = opts.initial_deposit || []
    this.voting_period = opts.voting_period || 0
  }
}
