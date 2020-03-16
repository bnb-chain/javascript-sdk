"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stdTx_1 = require("../types/stdTx");
var Token = /** @class */ (function () {
    function Token(opts) {
        if (opts === void 0) { opts = {}; }
        this.aminoPrefix = stdTx_1.TxAminoPrefix.BnbchainToken;
        this.name = opts.name || "";
        this.symbol = opts.symbol || "";
        this.original_symbol = opts.original_symbol || "";
        this.total_supply = opts.total_supply || 0;
        this.owner = opts.owner || Buffer.alloc(0);
        this.mintable = opts.mintable || false;
    }
    return Token;
}());
exports.Token = Token;
var TokenOfList = /** @class */ (function () {
    function TokenOfList(opts) {
        if (opts === void 0) { opts = {}; }
        this.name = opts.name || "";
        this.symbol = opts.symbol || "";
        this.original_symbol = opts.original_symbol || "";
        this.total_supply = opts.total_supply || 0;
        this.owner = opts.owner || Buffer.alloc(0);
        this.mintable = opts.mintable || false;
    }
    return TokenOfList;
}());
exports.TokenOfList = TokenOfList;
var Coin = /** @class */ (function () {
    function Coin(opts) {
        if (opts === void 0) { opts = {}; }
        this.denom = opts.denom || "";
        this.amount = opts.amount || 0;
    }
    return Coin;
}());
exports.Coin = Coin;
var BaseAccount = /** @class */ (function () {
    function BaseAccount(opts) {
        if (opts === void 0) { opts = {}; }
        this.address = opts.address || Buffer.alloc(0);
        this.coins = opts.coins || [new Coin()];
        this.public_key = opts.public_key || Buffer.alloc(0);
        this.account_number = opts.account_number || 0;
        this.sequence = opts.sequence || 0;
    }
    return BaseAccount;
}());
exports.BaseAccount = BaseAccount;
var AppAccount = /** @class */ (function () {
    function AppAccount(opts) {
        if (opts === void 0) { opts = {}; }
        this.aminoPrefix = stdTx_1.TxAminoPrefix.BnbchainAccount;
        this.base = opts.base || new BaseAccount();
        this.name = opts.name || "";
        this.locked = opts.locked || [new Coin()];
        this.frozen = opts.frozen || [new Coin()];
    }
    return AppAccount;
}());
exports.AppAccount = AppAccount;
var TokenBalance = /** @class */ (function () {
    function TokenBalance(opts) {
        if (opts === void 0) { opts = {}; }
        this.symbol = opts.symbol || "";
        this.free = opts.free || 0;
        this.locked = opts.locked || 0;
        this.frozen = opts.frozen || 0;
    }
    return TokenBalance;
}());
exports.TokenBalance = TokenBalance;
var OpenOrder = /** @class */ (function () {
    function OpenOrder(opts) {
        if (opts === void 0) { opts = {}; }
        this.id = opts.id || "";
        this.symbol = opts.symbol || "";
        this.price = opts.price || 0;
        this.quantity = opts.quantity || 0;
        this.cumQty = opts.cumQty || 0;
        this.createdHeight = opts.createdHeight || 0;
        this.createdTimestamp = opts.createdTimestamp || 0;
        this.lastUpdatedHeight = opts.lastUpdatedHeight || 0;
        this.lastUpdatedTimestamp = opts.lastUpdatedTimestamp || 0;
    }
    return OpenOrder;
}());
exports.OpenOrder = OpenOrder;
var TradingPair = /** @class */ (function () {
    function TradingPair(opts) {
        if (opts === void 0) { opts = {}; }
        this.base_asset_symbol = opts.base_asset_symbol || "";
        this.quote_asset_symbol = opts.quote_asset_symbol || "";
        this.list_price = opts.list_price || 0;
        this.tick_size = opts.tick_size || 0;
        this.lot_size = opts.lot_size || 0;
    }
    return TradingPair;
}());
exports.TradingPair = TradingPair;
var OrderBookLevel = /** @class */ (function () {
    function OrderBookLevel(opts) {
        if (opts === void 0) { opts = {}; }
        this.buyQty = opts.buyQty || 0;
        this.buyPrice = opts.buyPrice || 0;
        this.sellQty = opts.sellQty || 0;
        this.sellPrice = opts.sellPrice || 0;
    }
    return OrderBookLevel;
}());
exports.OrderBookLevel = OrderBookLevel;
var OrderBook = /** @class */ (function () {
    function OrderBook(opts) {
        if (opts === void 0) { opts = {}; }
        this.height = opts.height || 0;
        this.levels = opts.levels || [new OrderBookLevel()];
    }
    return OrderBook;
}());
exports.OrderBook = OrderBook;
var SubmitProposalMsg = /** @class */ (function () {
    function SubmitProposalMsg(opts) {
        if (opts === void 0) { opts = {}; }
        this.aminoPrefix = stdTx_1.TxAminoPrefix.MsgSubmitProposal;
        opts = opts || {};
        this.title = opts.title || "";
        this.description = opts.description || "";
        this.proposal_type = opts.proposal_type || 0;
        this.proposer = opts.proposer || Buffer.alloc(0);
        this.initial_deposit = opts.initial_deposit || [];
        this.voting_period = opts.voting_period || 0;
    }
    return SubmitProposalMsg;
}());
exports.SubmitProposalMsg = SubmitProposalMsg;
//# sourceMappingURL=types.js.map