"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @module Token
 */
var big_js_1 = tslib_1.__importDefault(require("big.js"));
// import { TxTypes } from "../tx/"
var crypto = tslib_1.__importStar(require("../crypto/"));
var client_1 = require("../client/");
var validateHelper_1 = require("../utils/validateHelper");
var validateHelper_2 = require("../utils/validateHelper");
var stdTx_1 = require("../types/stdTx");
var MAXTOTALSUPPLY = 9000000000000000000;
var validateNonZeroAmount = function (amountParam, symbol, fromAddress, httpClient, type) {
    if (type === void 0) { type = "free"; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var amount, result, balance, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    amount = new big_js_1.default(amountParam);
                    if (amount.lte(0) || amount.gt(MAXTOTALSUPPLY)) {
                        throw new Error("invalid amount");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, httpClient.request("get", client_1.api.getAccount + "/" + fromAddress)];
                case 2:
                    result = (_a.sent()).result;
                    balance = result.balances.find(function (b) { return b.symbol.toUpperCase() === symbol.toUpperCase(); });
                    if (!balance) {
                        throw new Error("the account doesn't have " + symbol);
                    }
                    if (amount.gte(balance[type])) {
                        throw new Error("the account doesn't have enougth balance");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    //if get account failed. still broadcast
                    console.log(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var TokenManagement = /** @class */ (function () {
    /**
     * @param {Object} bncClient
     */
    function TokenManagement(bncClient) {
        if (!TokenManagement.instance) {
            this._bncClient = bncClient;
            TokenManagement.instance = this;
        }
        return TokenManagement.instance;
    }
    /**
     * create a new asset on Binance Chain
     * @param {String} - senderAddress
     * @param {String} - tokenName
     * @param {String} - symbol
     * @param {Number} - totalSupply
     * @param {Boolean} - mintable
     * @returns {Promise} resolves with response (success or fail)
     */
    TokenManagement.prototype.issue = function (senderAddress, tokenName, symbol, totalSupply, mintable) {
        if (totalSupply === void 0) { totalSupply = 0; }
        if (mintable === void 0) { mintable = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var issueMsg, signIssueMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!senderAddress) {
                            throw new Error("sender address cannot be empty");
                        }
                        if (tokenName.length > 32) {
                            throw new Error("token name is limited to 32 characters");
                        }
                        if (!/^[a-zA-z\d]{3,8}$/.test(symbol)) {
                            throw new Error("symbol should be alphanumeric and length is limited to 3~8");
                        }
                        if (totalSupply <= 0 || totalSupply > MAXTOTALSUPPLY) {
                            throw new Error("invalid supply amount");
                        }
                        totalSupply = Number(new big_js_1.default(totalSupply).mul(Math.pow(10, 8)).toString());
                        issueMsg = {
                            from: crypto.decodeAddress(senderAddress),
                            name: tokenName,
                            symbol: symbol,
                            total_supply: totalSupply,
                            mintable: mintable,
                            aminoPrefix: stdTx_1.TxAminoPrefix.IssueMsg
                        };
                        signIssueMsg = {
                            from: senderAddress,
                            name: tokenName,
                            symbol: symbol,
                            total_supply: totalSupply,
                            mintable: mintable
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(issueMsg, signIssueMsg, senderAddress)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * freeze some amount of token
     * @param {String} fromAddress
     * @param {String} symbol
     * @param {String} amount
     * @returns {Promise}  resolves with response (success or fail)
     */
    TokenManagement.prototype.freeze = function (fromAddress, symbol, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var freezeMsg, freezeSignMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_1.validateSymbol(symbol);
                        validateNonZeroAmount(amount, symbol, fromAddress, this._bncClient._httpClient, "free");
                        freezeMsg = {
                            from: crypto.decodeAddress(fromAddress),
                            symbol: symbol,
                            amount: Number(new big_js_1.default(amount).mul(Math.pow(10, 8)).toString()),
                            aminoPrefix: stdTx_1.TxAminoPrefix.FreezeMsg
                        };
                        freezeSignMsg = {
                            amount: amount,
                            from: fromAddress,
                            symbol: symbol
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(freezeMsg, freezeSignMsg, fromAddress)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * unfreeze some amount of token
     * @param {String} fromAddress
     * @param {String} symbol
     * @param {String} amount
     * @returns {Promise}  resolves with response (success or fail)
     */
    TokenManagement.prototype.unfreeze = function (fromAddress, symbol, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var unfreezeMsg, unfreezeSignMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_1.validateSymbol(symbol);
                        validateNonZeroAmount(amount, symbol, fromAddress, this._bncClient._httpClient, "frozen");
                        unfreezeMsg = {
                            from: crypto.decodeAddress(fromAddress),
                            symbol: symbol,
                            amount: Number(new big_js_1.default(amount).mul(Math.pow(10, 8)).toString()),
                            aminoPrefix: stdTx_1.TxAminoPrefix.UnfreezeMsg
                        };
                        unfreezeSignMsg = {
                            amount: amount,
                            from: fromAddress,
                            symbol: symbol
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(unfreezeMsg, unfreezeSignMsg, fromAddress)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * burn some amount of token
     * @param {String} fromAddress
     * @param {String} symbol
     * @param {Number} amount
     * @returns {Promise}  resolves with response (success or fail)
     */
    TokenManagement.prototype.burn = function (fromAddress, symbol, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var burnMsg, burnSignMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_1.validateSymbol(symbol);
                        validateNonZeroAmount(amount, symbol, fromAddress, this._bncClient._httpClient);
                        burnMsg = {
                            from: crypto.decodeAddress(fromAddress),
                            symbol: symbol,
                            amount: Number(new big_js_1.default(amount).mul(Math.pow(10, 8)).toString()),
                            aminoPrefix: stdTx_1.TxAminoPrefix.BurnMsg
                        };
                        burnSignMsg = {
                            amount: amount,
                            from: fromAddress,
                            symbol: symbol
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(burnMsg, burnSignMsg, fromAddress)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * mint tokens for an existing token
     * @param {String} fromAddress
     * @param {String} symbol
     * @param {Number} amount
     * @returns {Promise}  resolves with response (success or fail)
     */
    TokenManagement.prototype.mint = function (fromAddress, symbol, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var mintMsg, mintSignMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_1.validateSymbol(symbol);
                        if (amount <= 0 || amount > MAXTOTALSUPPLY) {
                            throw new Error("invalid amount");
                        }
                        mintMsg = {
                            from: crypto.decodeAddress(fromAddress),
                            symbol: symbol,
                            amount: Number(new big_js_1.default(amount).mul(Math.pow(10, 8)).toString()),
                            aminoPrefix: stdTx_1.TxAminoPrefix.MintMsg
                        };
                        mintSignMsg = {
                            amount: amount,
                            from: fromAddress,
                            symbol: symbol
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(mintMsg, mintSignMsg, fromAddress)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * lock token for a while
     * @param {String} fromAddress
     * @param {String} description
     * @param {Array} amount
     * @param {Number} lockTime
     * @returns {Promise}  resolves with response (success or fail)
     */
    TokenManagement.prototype.timeLock = function (fromAddress, description, amount, lockTime) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var timeLockMsg, signTimeLockMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_2.checkCoins(amount);
                        if (description.length > 128) {
                            throw new Error("description is too long");
                        }
                        if (lockTime < 60 || lockTime > 253402300800) {
                            throw new Error("timeTime must be in [60, 253402300800]");
                        }
                        timeLockMsg = {
                            from: crypto.decodeAddress(fromAddress),
                            description: description,
                            amount: amount,
                            lock_time: lockTime,
                            aminoPrefix: stdTx_1.TxAminoPrefix.MintMsg
                        };
                        signTimeLockMsg = {
                            from: fromAddress,
                            description: description,
                            amount: amount,
                            lock_time: lockTime
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(timeLockMsg, signTimeLockMsg, fromAddress)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * lock more token or increase locked period
     * @param {String} fromAddress
     * @param {Number} id
     * @param {String} description
     * @param {Array} amount
     * @param {Number} lockTime
     * @returns {Promise}  resolves with response (success or fail)
     */
    TokenManagement.prototype.timeRelock = function (fromAddress, id, description, amount, lockTime) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var timeRelockMsg, signTimeRelockMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_2.checkCoins(amount);
                        if (description.length > 128) {
                            throw new Error("description is too long");
                        }
                        if (lockTime < 60 || lockTime > 253402300800) {
                            throw new Error("timeTime must be in [60, 253402300800]");
                        }
                        timeRelockMsg = {
                            from: crypto.decodeAddress(fromAddress),
                            time_lock_id: id,
                            description: description,
                            amount: amount,
                            lock_time: lockTime,
                            aminoPrefix: stdTx_1.TxAminoPrefix.TimeRelockMsg
                        };
                        signTimeRelockMsg = {
                            from: fromAddress,
                            time_lock_id: id,
                            description: description,
                            amount: amount,
                            lock_time: lockTime
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(timeRelockMsg, signTimeRelockMsg, fromAddress)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * unlock locked tokens
     * @param {String} fromAddress
     * @param {Number} id
     * @returns {Promise}  resolves with response (success or fail)
     */
    TokenManagement.prototype.timeUnlock = function (fromAddress, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var timeUnlockMsg, signTimeUnlockMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeUnlockMsg = {
                            from: crypto.decodeAddress(fromAddress),
                            time_lock_id: id,
                            aminoPrefix: stdTx_1.TxAminoPrefix.TimeUnlockMsg
                        };
                        signTimeUnlockMsg = {
                            from: fromAddress,
                            time_lock_id: id
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(timeUnlockMsg, signTimeUnlockMsg, fromAddress)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    return TokenManagement;
}());
exports.default = TokenManagement;
//# sourceMappingURL=index.js.map