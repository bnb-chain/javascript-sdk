"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @module rpc
 */
var big_js_1 = require("big.js");
var types_1 = require("../decoder/types");
var decoder = tslib_1.__importStar(require("../decoder"));
var crypto = tslib_1.__importStar(require("../crypto"));
var _1 = tslib_1.__importDefault(require("./"));
var validateHelper_1 = require("../utils/validateHelper");
var BASENUMBER = Math.pow(10, 8);
var divide = function (num) {
    return +new big_js_1.Big(num).div(BASENUMBER).toString();
};
var convertObjectArrayNum = function (objArr, keys) {
    objArr.forEach(function (item) {
        keys.forEach(function (key) {
            item[key] = divide(item[key]);
        });
    });
};
/**
 * The Binance Chain Node rpc client
 */
var Client = /** @class */ (function (_super) {
    tslib_1.__extends(Client, _super);
    /**
     * @param {String} uriString dataseed address
     * @param {String} netWork Binance Chain network
     */
    function Client(uriString, netWork) {
        if (uriString === void 0) { uriString = "localhost:27146"; }
        var _this = _super.call(this, uriString) || this;
        _this.netWork = netWork || "mainnet";
        return _this;
    }
    /**
     * The RPC broadcast delegate broadcasts a transaction via RPC. This is intended for optional use as BncClient's broadcast delegate.
     * @param {Transaction} signedTx the signed transaction
     * @return {Promise}
     */
    Client.prototype.broadcastDelegate = function (signedTx) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var encoded, res;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        encoded = signedTx.serialize();
                        return [4 /*yield*/, this.broadcastTxSync({
                                tx: Buffer.from(encoded, "hex")
                            })];
                    case 1:
                        res = _a.sent();
                        if ("" + res.code === "0") {
                            return [2 /*return*/, res];
                        }
                        else {
                            throw new Error("broadcastDelegate: non-zero status code " + res.code);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.getBech32Prefix = function () {
        if (this.netWork === "mainnet") {
            return "bnb";
        }
        if (this.netWork === "testnet") {
            return "tbnb";
        }
        return "";
    };
    /**
     * @param {String} symbol - required
     * @returns {Object} token detail info
     */
    Client.prototype.getTokenInfo = function (symbol) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var path, res, bytes, tokenInfo, bech32Prefix, ownerAddress;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_1.validateSymbol(symbol);
                        path = "/tokens/info/" + symbol;
                        return [4 /*yield*/, this.abciQuery({ path: path })];
                    case 1:
                        res = _a.sent();
                        bytes = Buffer.from(res.response.value, "base64");
                        tokenInfo = new types_1.Token();
                        decoder.unMarshalBinaryLengthPrefixed(bytes, tokenInfo);
                        bech32Prefix = this.getBech32Prefix();
                        ownerAddress = crypto.encodeAddress(tokenInfo.owner, bech32Prefix);
                        delete tokenInfo.aminoPrefix;
                        //TODO all the result contains aminoPrefix, need to improve
                        return [2 /*return*/, tslib_1.__assign(tslib_1.__assign({}, tokenInfo), { owner: ownerAddress })];
                }
            });
        });
    };
    /**
     * get tokens by offset and limit
     * @param {Number} offset
     * @param {Number} limit
     * @returns {Array} token list
     */
    Client.prototype.listAllTokens = function (offset, limit) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var path, res, bytes, tokenArr, tokenList;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_1.validateOffsetLimit(offset, limit);
                        path = "tokens/list/" + offset + "/" + limit;
                        return [4 /*yield*/, this.abciQuery({ path: path })];
                    case 1:
                        res = _a.sent();
                        bytes = Buffer.from(res.response.value, "base64");
                        tokenArr = [new types_1.TokenOfList()];
                        tokenList = decoder.unMarshalBinaryLengthPrefixed(bytes, tokenArr).val;
                        decoder.unMarshalBinaryLengthPrefixed(bytes, tokenList);
                        return [2 /*return*/, tokenList.map(function (item) { return (tslib_1.__assign(tslib_1.__assign({}, item), { owner: crypto.encodeAddress(item.owner, _this.getBech32Prefix()) })); })];
                }
            });
        });
    };
    /**
     * @param {String} address
     * @returns {Object} Account info
     */
    Client.prototype.getAccount = function (address) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, accountInfo, bytes, bech32Prefix;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.abciQuery({
                            path: "/account/" + address
                        })];
                    case 1:
                        res = _a.sent();
                        accountInfo = new types_1.AppAccount();
                        bytes = Buffer.from(res.response.value, "base64");
                        decoder.unMarshalBinaryBare(bytes, accountInfo);
                        bech32Prefix = this.getBech32Prefix();
                        return [2 /*return*/, {
                                name: accountInfo.name,
                                locked: accountInfo.locked,
                                frozen: accountInfo.frozen,
                                base: tslib_1.__assign(tslib_1.__assign({}, accountInfo.base), { address: crypto.encodeAddress(accountInfo.base.address, bech32Prefix) })
                            }];
                }
            });
        });
    };
    /**
     * @param {Array} balances
     */
    Client.prototype.getBalances = function (address) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var account, coins, balances;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAccount(address)];
                    case 1:
                        account = _a.sent();
                        coins = [];
                        balances = [];
                        if (account) {
                            coins = (account.base && account.base.coins) || [];
                            convertObjectArrayNum(coins, ["amount"]);
                            convertObjectArrayNum(account.locked, ["amount"]);
                            convertObjectArrayNum(account.frozen, ["amount"]);
                        }
                        coins.forEach(function (item) {
                            var locked = account.locked.find(function (lockedItem) { return item.denom === lockedItem.denom; }) || {};
                            var frozen = account.frozen.find(function (frozenItem) { return item.denom === frozenItem.denom; }) || {};
                            var bal = new types_1.TokenBalance();
                            bal.symbol = item.denom;
                            bal.free = +new big_js_1.Big(item.amount).toString();
                            bal.locked = locked.amount || 0;
                            bal.frozen = frozen.amount || 0;
                            balances.push(bal);
                        });
                        return [2 /*return*/, balances];
                }
            });
        });
    };
    /**
     * get balance by symbol and address
     * @param {String} address
     * @param {String} symbol
     * @returns {Object}
     */
    Client.prototype.getBalance = function (address, symbol) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var balances, bal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_1.validateSymbol(symbol);
                        return [4 /*yield*/, this.getBalances(address)];
                    case 1:
                        balances = _a.sent();
                        bal = balances.find(function (item) { return item.symbol.toUpperCase() === symbol.toUpperCase(); });
                        return [2 /*return*/, bal];
                }
            });
        });
    };
    /**
     * @param {String} address
     * @param {String} symbol
     * @returns {Object}
     */
    Client.prototype.getOpenOrders = function (address, symbol) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var path, res, bytes, result, openOrders;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = "/dex/openorders/" + symbol + "/" + address;
                        return [4 /*yield*/, this.abciQuery({ path: path })];
                    case 1:
                        res = _a.sent();
                        bytes = Buffer.from(res.response.value, "base64");
                        result = [new types_1.OpenOrder()];
                        openOrders = decoder.unMarshalBinaryLengthPrefixed(bytes, result).val;
                        convertObjectArrayNum(openOrders, ["price", "quantity", "cumQty"]);
                        return [2 /*return*/, openOrders];
                }
            });
        });
    };
    /**
     * @param {Number} offset
     * @param {Number} limit
     * @returns {Array}
     */
    Client.prototype.getTradingPairs = function (offset, limit) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var path, res, bytes, result, tradingPairs;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_1.validateOffsetLimit(offset, limit);
                        path = "/dex/pairs/" + offset + "/" + limit;
                        return [4 /*yield*/, this.abciQuery({ path: path })];
                    case 1:
                        res = _a.sent();
                        bytes = Buffer.from(res.response.value, "base64");
                        result = [new types_1.TradingPair()];
                        tradingPairs = decoder.unMarshalBinaryLengthPrefixed(bytes, result).val;
                        convertObjectArrayNum(tradingPairs, ["list_price", "tick_size", "lot_size"]);
                        return [2 /*return*/, tradingPairs];
                }
            });
        });
    };
    /**
     * @param {String} tradePair
     * @returns {Array}
     */
    Client.prototype.getDepth = function (tradePair) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var path, res, bytes, result, depth;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_1.validateTradingPair(tradePair);
                        path = "dex/orderbook/" + tradePair;
                        return [4 /*yield*/, this.abciQuery({ path: path })];
                    case 1:
                        res = _a.sent();
                        bytes = Buffer.from(res.response.value, "base64");
                        result = new types_1.OrderBook();
                        depth = decoder.unMarshalBinaryLengthPrefixed(bytes, result).val;
                        convertObjectArrayNum(depth.levels, [
                            "buyQty",
                            "buyPrice",
                            "sellQty",
                            "sellPrice"
                        ]);
                        return [2 /*return*/, depth];
                }
            });
        });
    };
    return Client;
}(_1.default));
exports.default = Client;
//# sourceMappingURL=client.js.map