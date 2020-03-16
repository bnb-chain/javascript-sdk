"use strict";
/**
 * @module Swap
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var buffer_1 = require("buffer");
var crypto = tslib_1.__importStar(require("../crypto/"));
var validateHelper_1 = require("../utils/validateHelper");
var stdTx_1 = require("../types/stdTx");
var Swap = /** @class */ (function () {
    /**
     * @param {Object} bncClient
     */
    function Swap(bncClient) {
        if (!Swap.instance) {
            this._bncClient = bncClient;
            Swap.instance = this;
        }
        return Swap.instance;
    }
    /**
     * HTLT(Hash timer locked transfer, create an atomic swap)
     * @param {String} from
     * @param {String} recipient
     * @param {String} recipientOtherChain
     * @param {String} senderOtherChain
     * @param {String} randomNumberHash
     * @param {Number} timestamp
     * @param {Array} amount
     * @param {String} expectedIncome
     * @param {Number} heightSpan
     * @param {boolean} crossChain
     * @returns {Promise}  resolves with response (success or fail)
     */
    Swap.prototype.HTLT = function (from, recipient, recipientOtherChain, senderOtherChain, randomNumberHash, timestamp, amount, expectedIncome, heightSpan, crossChain) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var htltMsg, signHTLTMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_1.checkCoins(amount);
                        htltMsg = {
                            from: crypto.decodeAddress(from),
                            to: crypto.decodeAddress(recipient),
                            recipient_other_chain: recipientOtherChain,
                            sender_other_chain: senderOtherChain,
                            random_number_hash: buffer_1.Buffer.from(randomNumberHash, "hex"),
                            timestamp: timestamp,
                            amount: amount,
                            expected_income: expectedIncome,
                            height_span: heightSpan,
                            cross_chain: crossChain,
                            aminoPrefix: stdTx_1.TxAminoPrefix.HTLTMsg
                        };
                        signHTLTMsg = {
                            from: from,
                            to: recipient,
                            recipient_other_chain: recipientOtherChain,
                            sender_other_chain: senderOtherChain,
                            random_number_hash: randomNumberHash,
                            timestamp: timestamp,
                            amount: amount,
                            expected_income: expectedIncome,
                            height_span: heightSpan,
                            cross_chain: crossChain
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(htltMsg, signHTLTMsg, from)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * depositHTLT(deposit assets to an existing swap)
     * @param {String} from
     * @param {String} swapID
     * @param {Array} amount
     * @returns {Promise}  resolves with response (success or fail)
     */
    Swap.prototype.depositHTLT = function (from, swapID, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var depositHTLTMsg, signDepositHTLTMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateHelper_1.checkCoins(amount);
                        depositHTLTMsg = {
                            from: crypto.decodeAddress(from),
                            amount: amount,
                            swap_id: buffer_1.Buffer.from(swapID, "hex"),
                            aminoPrefix: stdTx_1.TxAminoPrefix.DepositHTLTMsg
                        };
                        signDepositHTLTMsg = {
                            from: from,
                            amount: amount,
                            swap_id: swapID
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(depositHTLTMsg, signDepositHTLTMsg, from)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * claimHTLT(claim assets from an swap)
     * @param {String} from
     * @param {String} swapID
     * @param {String} randomNumber
     * @returns {Promise}  resolves with response (success or fail)
     */
    Swap.prototype.claimHTLT = function (from, swapID, randomNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var claimHTLTMsg, signClaimHTLTMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        claimHTLTMsg = {
                            from: crypto.decodeAddress(from),
                            swap_id: buffer_1.Buffer.from(swapID, "hex"),
                            random_number: buffer_1.Buffer.from(randomNumber, "hex"),
                            aminoPrefix: stdTx_1.TxAminoPrefix.ClaimHTLTMsg
                        };
                        signClaimHTLTMsg = {
                            from: from,
                            swap_id: swapID,
                            random_number: randomNumber
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(claimHTLTMsg, signClaimHTLTMsg, from)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * refundHTLT(refund assets from an swap)
     * @param {String} from
     * @param {String} swapID
     * @returns {Promise}  resolves with response (success or fail)
     */
    Swap.prototype.refundHTLT = function (from, swapID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var refundHTLTMsg, signRefundHTLTMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        refundHTLTMsg = {
                            from: crypto.decodeAddress(from),
                            swap_id: buffer_1.Buffer.from(swapID, "hex"),
                            aminoPrefix: stdTx_1.TxAminoPrefix.RefundHTLTMsg
                        };
                        signRefundHTLTMsg = {
                            from: from,
                            swap_id: swapID
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(refundHTLTMsg, signRefundHTLTMsg, from)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    return Swap;
}());
exports.default = Swap;
//# sourceMappingURL=index.js.map