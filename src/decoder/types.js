const addMsgType = (type, msgTypeName) => {
  type.prototype.msgType = msgTypeName
}

export class Token {
  constructor(opts) {
    opts = opts || {}
    this.name = opts.name || ""
    this.symbol = opts.symbol || ""
    this.original_symbol = opts.original_symbol || ""
    this.total_supply = opts.total_supply || 0
    this.owner = opts.owner || Buffer.alloc(0)
    this.mintable = opts.mintable || false
  }
}

export class TokenOfList {
  constructor(opts) {
    opts = opts || {}
    this.name = opts.name || ""
    this.symbol = opts.symbol || ""
    this.original_symbol = opts.original_symbol || ""
    this.total_supply = opts.total_supply || 0
    this.owner = opts.owner || Buffer.alloc(0)
    this.mintable = opts.mintable || false
  }
}

export class Coin {
  constructor(opts) {
    opts = opts || {}
    this.denom = opts.denom || ""
    this.amount = opts.amount || 0
  }
}

export class BaseAccount {
  constructor(opts) {
    opts = opts || {}
    this.address = opts.address || Buffer.alloc(0)
    this.coins = opts.coins || [new Coin()]
    this.public_key = opts.public_key || Buffer.alloc(0)
    this.account_number = opts.account_number || 0
    this.sequence = opts.sequence || 0
  }
}

export class AppAccount {
  constructor(opts) {
    opts = opts || {}
    this.base = opts.base || new BaseAccount()
    this.name = opts.name || ""
    this.locked = opts.locked || [new Coin()]
    this.frozen = opts.frozen || [new Coin()]
  }
}

export class TokenBalance {
  constructor(opts) {
    opts = opts || {}
    this.symbol = opts.symbol || ""
    this.free = opts.free || 0
    this.locked = opts.locked || 0
    this.frozen = opts.frozen || 0
  }
}

export class OpenOrder {
  constructor(opts) {
    opts = opts || {}
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
  constructor(opts) {
    opts = opts || {}
    this.base_asset_symbol = opts.base_asset_symbol || ""
    this.quote_asset_symbol = opts.quote_asset_symbol || ""
    this.list_price = opts.list_price || 0
    this.tick_size = opts.tick_size || 0
    this.lot_size = opts.lot_size || 0
  }
}

export class OrderBookLevel {
  constructor(opts) {
    opts = opts || {}
    this.buyQty = opts.buyQty || 0
    this.buyPrice = opts.buyPrice || 0
    this.sellQty = opts.sellQty || 0
    this.sellPrice = opts.sellPrice || 0
  }
}

export class OrderBook {
  constructor(opts) {
    opts = opts || {}
    this.height = opts.height || 0
    this.levels = opts.levels || [new OrderBookLevel()]
  }
}

export class SubmitProposalMsg {
  constructor(opts) {
    opts = opts || {}
    this.title = opts.title || ""
    this.description = opts.description || ""
    this.proposal_type = opts.proposal_type || 0
    this.proposer = opts.proposer || Buffer.alloc(0)
    this.initial_deposit = opts.initial_deposit || []
    this.voting_period = opts.voting_period || 0
  }
}

addMsgType(Token, "Token")
addMsgType(AppAccount, "bnbchain/Account")
addMsgType(SubmitProposalMsg, "MsgSubmitProposal")
