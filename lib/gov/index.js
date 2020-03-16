"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @module gov
 */
var big_js_1 = tslib_1.__importDefault(require("big.js"));
var crypto = tslib_1.__importStar(require("../crypto/"));
var validateHelper_1 = require("../utils/validateHelper");
var proposalType_1 = tslib_1.__importDefault(require("./proposalType"));
var BASENUMBER = Math.pow(10, 8);
var proposalTypeMapping = {
    0x04: "ListTradingPair",
    0x00: "Nil",
    0x01: "Text",
    0x02: "ParameterChange",
    0x03: "SoftwareUpgrade",
    0x05: "FeeChange",
    0x06: "CreateValidator",
    0x07: "RemoveValidator"
};
/**
 * VoteOption
 * @example
 * OptionEmpty - 0x00
 * OptionYes - 0x01
 * OptionAbstain - 0x02
 * OptionNo - 0x03
 * OptionNoWithVeto - 0x04
 */
exports.voteOption = {
    OptionEmpty: 0x00,
    OptionYes: 0x01,
    OptionAbstain: 0x02,
    OptionNo: 0x03,
    OptionNoWithVeto: 0x04
};
var voteOptionMapping = {
    0x00: "Empty",
    0x01: "Yes",
    0x02: "Abstain",
    0x03: "No",
    0x04: "NoWithVeto"
};
var Gov = /** @class */ (function () {
    /**
     * @param {Object} bncClient
     */
    function Gov(bncClient) {
        if (!Gov.instance) {
            this._bncClient = bncClient;
            Gov.instance = this;
        }
        return Gov.instance;
    }
    /**
     * Submit a list proposal along with an initial deposit
     * @param {Object} listParams
     * @example
     * var listParams = {
     *  title: 'New trading pair',
     *  description: '',
     *  baseAsset: 'BTC',
     *  quoteAsset: 'BNB',
     *  initPrice: 1,
     *  address: '',
     *  initialDeposit: 2000,
     *  expireTime: 1570665600,
     *  votingPeriod: 604800
     * }
     */
    Gov.prototype.submitListProposal = function (listParams) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listTradingPairObj, description, address, title, initialDeposit, votingPeriod;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listTradingPairObj = {
                            base_asset_symbol: listParams.baseAsset,
                            quote_asset_symbol: listParams.quoteAsset,
                            init_price: +new big_js_1.default(listParams.initPrice).mul(BASENUMBER).toString(),
                            description: listParams.description,
                            expire_time: new Date(listParams.expireTime).toISOString()
                        };
                        description = JSON.stringify(listTradingPairObj);
                        address = listParams.address, title = listParams.title, initialDeposit = listParams.initialDeposit, votingPeriod = listParams.votingPeriod;
                        return [4 /*yield*/, this.submitProposal(address, title, description, proposalType_1.default.ProposalTypeListTradingPair, initialDeposit, votingPeriod)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Submit a proposal along with an initial deposit.
     * Proposal title, description, type and deposit can
     * be given directly or through a proposal JSON file.
     * @param {String} address
     * @param {String} title
     * @param {String} description
     * @param {Number} proposalType
     * @param {Number} initialDeposit
     * @param {String} votingPeriod
     * @return {Promise} resolves with response (success or fail)
     */
    Gov.prototype.submitProposal = function (address, title, description, proposalType, initialDeposit, votingPeriod) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var accAddress, coins, proposalMsg, signMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accAddress = crypto.decodeAddress(address);
                        coins = [
                            {
                                denom: "BNB",
                                amount: new big_js_1.default(initialDeposit).mul(BASENUMBER).toString()
                            }
                        ];
                        votingPeriod = +new big_js_1.default(votingPeriod).mul(Math.pow(10, 9)).toString();
                        proposalMsg = {
                            title: title,
                            description: description,
                            proposal_type: proposalType,
                            proposer: accAddress,
                            initial_deposit: [
                                {
                                    denom: "BNB",
                                    amount: +new big_js_1.default(initialDeposit).mul(BASENUMBER).toString()
                                }
                            ],
                            voting_period: votingPeriod,
                            msgType: "MsgSubmitProposal"
                        };
                        signMsg = {
                            description: description,
                            initial_deposit: coins,
                            proposal_type: proposalTypeMapping[proposalType],
                            proposer: address,
                            title: title,
                            voting_period: votingPeriod.toString()
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(proposalMsg, signMsg, address)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * Deposit tokens for activing proposal
     * @param {Number} proposalId
     * @param {String} address
     * @param {Array} coins
     * @example
     * var coins = [{
     *   "denom": "BNB",
     *   "amount": 10
     * }]
     */
    Gov.prototype.deposit = function (proposalId, address, coins) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var accAddress, amount, depositMsg, signMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accAddress = crypto.decodeAddress(address);
                        validateHelper_1.checkCoins(coins);
                        amount = [];
                        coins.forEach(function (coin) {
                            amount.push({
                                denom: coin.denom,
                                amount: +new big_js_1.default(coin.amount).mul(BASENUMBER).toString()
                            });
                        });
                        depositMsg = {
                            proposal_id: proposalId,
                            depositer: accAddress,
                            amount: amount,
                            msgType: "MsgDeposit"
                        };
                        signMsg = {
                            amount: amount.map(function (coin) { return ({
                                denom: coin.denom,
                                amount: String(coin.amount)
                            }); }),
                            depositer: address,
                            proposal_id: String(proposalId)
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(depositMsg, signMsg, address)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     *
     * @param {Number} proposalId
     * @param {String} voter
     * @param {VoteOption} option
     */
    Gov.prototype.vote = function (proposalId, voter, option) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var accAddress, voteMsg, signMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accAddress = crypto.decodeAddress(voter);
                        voteMsg = {
                            proposal_id: proposalId,
                            voter: accAddress,
                            option: option,
                            msgType: "MsgVote"
                        };
                        signMsg = {
                            option: voteOptionMapping[option],
                            proposal_id: String(proposalId),
                            voter: voter
                        };
                        return [4 /*yield*/, this._bncClient._prepareTransaction(voteMsg, signMsg, voter)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._bncClient._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    return Gov;
}());
exports.default = Gov;
//# sourceMappingURL=index.js.map