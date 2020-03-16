"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @module client
 */
var crypto = tslib_1.__importStar(require("../crypto"));
var tx_1 = tslib_1.__importDefault(require("../tx"));
var request_1 = tslib_1.__importDefault(require("../utils/request"));
var validateHelper_1 = require("../utils/validateHelper");
var token_1 = tslib_1.__importDefault(require("../token/"));
var swap_1 = tslib_1.__importDefault(require("../swap/"));
var gov_1 = tslib_1.__importDefault(require("../gov/"));
var big_js_1 = tslib_1.__importDefault(require("big.js"));
var stdTx_1 = require("../types/stdTx");
var BASENUMBER = Math.pow(10, 8);
exports.api = {
    broadcast: "/api/v1/broadcast",
    nodeInfo: "/api/v1/node-info",
    getAccount: "/api/v1/account",
    getMarkets: "/api/v1/markets",
    getSwaps: "/api/v1/atomic-swaps",
    getOpenOrders: "/api/v1/orders/open",
    getDepth: "/api/v1/depth",
    getTransactions: "/api/v1/transactions",
    getTx: "/api/v1/tx"
};
exports.NETWORK_PREFIX_MAPPING = {
    testnet: "tbnb",
    mainnet: "bnb"
};
/**
 * The default signing delegate which uses the local private key.
 * @param  {Transaction} tx      the transaction
 * @param  {Object}      signMsg the canonical sign bytes for the msg
 * @return {Transaction}
 */
exports.DefaultSigningDelegate = function (tx, signMsg) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, tx.sign(this.privateKey, signMsg)];
        });
    });
};
/**
 * The default broadcast delegate which immediately broadcasts a transaction.
 * @param {Transaction} signedTx the signed transaction
 */
exports.DefaultBroadcastDelegate = function (signedTx) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, this.sendTransaction(signedTx, false)];
        });
    });
};
/**
 * The Ledger signing delegate.
 * @param  {LedgerApp}  ledgerApp
 * @param  {preSignCb}  function
 * @param  {postSignCb} function
 * @param  {errCb} function
 * @return {function}
 */
exports.LedgerSigningDelegate = function (ledgerApp, preSignCb, postSignCb, errCb, hdPath) {
    return function (tx, signMsg) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var signBytes, pubKeyResp, sigResp, err_1, pubKey;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        signBytes = tx.getSignBytes(signMsg);
                        preSignCb && preSignCb(signBytes);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, ledgerApp.getPublicKey(hdPath)];
                    case 2:
                        pubKeyResp = _a.sent();
                        return [4 /*yield*/, ledgerApp.sign(signBytes, hdPath)];
                    case 3:
                        sigResp = _a.sent();
                        postSignCb && postSignCb(pubKeyResp, sigResp);
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.warn("LedgerSigningDelegate error", err_1);
                        errCb && errCb(err_1);
                        return [3 /*break*/, 5];
                    case 5:
                        if (sigResp && sigResp.signature) {
                            pubKey = crypto.getPublicKey(pubKeyResp.pk.toString("hex"));
                            return [2 /*return*/, tx.addSignature(pubKey, sigResp.signature)];
                        }
                        return [2 /*return*/, tx];
                }
            });
        });
    };
};
/**
 * validate the input number.
 * @param {Array} outputs
 */
var checkOutputs = function (outputs) {
    outputs.forEach(function (transfer) {
        var coins = transfer.coins || [];
        coins.forEach(function (coin) {
            validateHelper_1.checkNumber(coin.amount);
            if (!coin.denom) {
                throw new Error("invalid denmon");
            }
        });
    });
};
/**
 * sum corresponding input coin
 * @param {Array} inputs
 * @param {Array} coins
 */
var calInputCoins = function (inputs, coins) {
    coins.forEach(function (coin) {
        var existCoin = inputs[0].coins.find(function (c) { return c.denom === coin.denom; });
        if (existCoin) {
            var existAmount = new big_js_1.default(existCoin.amount);
            existCoin.amount = Number(existAmount.plus(coin.amount).toString());
        }
        else {
            inputs[0].coins.push(tslib_1.__assign({}, coin));
        }
    });
};
/**
 * The Binance Chain client.
 */
var BncClient = /** @class */ (function () {
    /**
     * @param {String} server Binance Chain public url
     * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
     * @param {Number} source where does this transaction come from (default 0)
     */
    function BncClient(server, useAsyncBroadcast, source) {
        if (useAsyncBroadcast === void 0) { useAsyncBroadcast = false; }
        if (source === void 0) { source = 0; }
        this.addressPrefix = "tbnb";
        this.network = "testnet";
        if (!server) {
            throw new Error("Binance chain server should not be null");
        }
        this._httpClient = new request_1.default(server);
        this._signingDelegate = exports.DefaultSigningDelegate;
        this._broadcastDelegate = exports.DefaultBroadcastDelegate;
        this._useAsyncBroadcast = useAsyncBroadcast;
        this._source = source;
        this.tokens = new token_1.default(this);
        this.swap = new swap_1.default(this);
        this.gov = new gov_1.default(this);
        this.privateKey = "";
    }
    /**
     * Initialize the client with the chain's ID. Asynchronous.
     * @return {Promise}
     */
    BncClient.prototype.initChain = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.chainId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._httpClient.request("get", exports.api.nodeInfo)];
                    case 1:
                        data = _a.sent();
                        this.chainId = data.result.node_info && data.result.node_info.network;
                        _a.label = 2;
                    case 2: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Sets the client network (testnet or mainnet).
     * @param {String} network Indicate testnet or mainnet
     */
    BncClient.prototype.chooseNetwork = function (network) {
        this.addressPrefix = exports.NETWORK_PREFIX_MAPPING[network] || "tbnb";
        this.network = exports.NETWORK_PREFIX_MAPPING[network] ? network : "testnet";
    };
    /**
     * Sets the client's private key for calls made by this client. Asynchronous.
     * @param {string} privateKey the private key hexstring
     * @param {boolean} localOnly set this to true if you will supply an account_number yourself via `setAccountNumber`. Warning: You must do that if you set this to true!
     * @return {Promise}
     */
    BncClient.prototype.setPrivateKey = function (privateKey, localOnly) {
        if (localOnly === void 0) { localOnly = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var address, promise, data, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(privateKey !== this.privateKey)) return [3 /*break*/, 4];
                        address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
                        if (!address)
                            throw new Error("address is falsy: " + address + ". invalid private key?");
                        if (address === this.address)
                            return [2 /*return*/, this]; // safety
                        this.privateKey = privateKey;
                        this.address = address;
                        if (!!localOnly) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        promise = (this._setPkPromise = this._httpClient.request("get", exports.api.getAccount + "/" + address));
                        return [4 /*yield*/, promise];
                    case 2:
                        data = _a.sent();
                        this.account_number = data.result.account_number;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        throw new Error("unable to query the address on the blockchain. try sending it some funds first: " + address);
                    case 4: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Sets the client's account number.
     * @param {number} accountNumber
     */
    BncClient.prototype.setAccountNumber = function (accountNumber) {
        this.account_number = accountNumber;
    };
    /**
     * Use async broadcast mode. Broadcasts faster with less guarantees (default off)
     * @param {Boolean} useAsyncBroadcast
     * @return {BncClient} this instance (for chaining)
     */
    BncClient.prototype.useAsyncBroadcast = function (useAsyncBroadcast) {
        if (useAsyncBroadcast === void 0) { useAsyncBroadcast = true; }
        this._useAsyncBroadcast = useAsyncBroadcast;
        return this;
    };
    /**
     * Sets the signing delegate (for wallet integrations).
     * @param {function} delegate
     * @return {BncClient} this instance (for chaining)
     */
    BncClient.prototype.setSigningDelegate = function (delegate) {
        if (typeof delegate !== "function")
            throw new Error("signing delegate must be a function");
        this._signingDelegate = delegate;
        return this;
    };
    /**
     * Sets the broadcast delegate (for wallet integrations).
     * @param {function} delegate
     * @return {BncClient} this instance (for chaining)
     */
    BncClient.prototype.setBroadcastDelegate = function (delegate) {
        if (typeof delegate !== "function")
            throw new Error("broadcast delegate must be a function");
        this._broadcastDelegate = delegate;
        return this;
    };
    /**
     * Applies the default signing delegate.
     * @return {BncClient} this instance (for chaining)
     */
    BncClient.prototype.useDefaultSigningDelegate = function () {
        this._signingDelegate = exports.DefaultSigningDelegate;
        return this;
    };
    /**
     * Applies the default broadcast delegate.
     * @return {BncClient} this instance (for chaining)
     */
    BncClient.prototype.useDefaultBroadcastDelegate = function () {
        this._broadcastDelegate = exports.DefaultBroadcastDelegate;
        return this;
    };
    /**
     * Applies the Ledger signing delegate.
     * @param {function} ledgerApp
     * @param {function} preSignCb
     * @param {function} postSignCb
     * @param {function} errCb
     * @return {BncClient} this instance (for chaining)
     */
    BncClient.prototype.useLedgerSigningDelegate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._signingDelegate = exports.LedgerSigningDelegate.apply(void 0, args);
        return this;
    };
    /**
     * Transfer tokens from one address to another.
     * @param {String} fromAddress
     * @param {String} toAddress
     * @param {Number} amount
     * @param {String} asset
     * @param {String} memo optional memo
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */
    BncClient.prototype.transfer = function (fromAddress, toAddress, amount, asset, memo, sequence) {
        if (memo === void 0) { memo = ""; }
        if (sequence === void 0) { sequence = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var accCode, toAccCode, coin, msg, signMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accCode = crypto.decodeAddress(fromAddress);
                        toAccCode = crypto.decodeAddress(toAddress);
                        amount = new big_js_1.default(amount);
                        amount = Number(amount.mul(BASENUMBER).toString());
                        validateHelper_1.checkNumber(amount, "amount");
                        coin = {
                            denom: asset,
                            amount: amount
                        };
                        msg = {
                            inputs: [
                                {
                                    address: accCode,
                                    coins: [coin]
                                }
                            ],
                            outputs: [
                                {
                                    address: toAccCode,
                                    coins: [coin]
                                }
                            ],
                            aminoPrefix: stdTx_1.TxAminoPrefix.MsgSend
                        };
                        signMsg = {
                            inputs: [
                                {
                                    address: fromAddress,
                                    coins: [
                                        {
                                            amount: amount,
                                            denom: asset
                                        }
                                    ]
                                }
                            ],
                            outputs: [
                                {
                                    address: toAddress,
                                    coins: [
                                        {
                                            amount: amount,
                                            denom: asset
                                        }
                                    ]
                                }
                            ]
                        };
                        return [4 /*yield*/, this._prepareTransaction(msg, signMsg, fromAddress, sequence, memo)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * Create and sign a multi send tx
     * @param {String} fromAddress
     * @param {Array} outputs
     * @example
     * const outputs = [
     * {
     *   "to": "tbnb1p4kpnj5qz5spsaf0d2555h6ctngse0me5q57qe",
     *   "coins": [{
     *     "denom": "BNB",
     *     "amount": 10
     *   },{
     *     "denom": "BTC",
     *     "amount": 10
     *   }]
     * },
     * {
     *   "to": "tbnb1scjj8chhhp7lngdeflltzex22yaf9ep59ls4gk",
     *   "coins": [{
     *     "denom": "BTC",
     *     "amount": 10
     *   },{
     *     "denom": "BNB",
     *     "amount": 10
     *   }]
     * }]
     * @param {String} memo optional memo
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */
    BncClient.prototype.multiSend = function (fromAddress, outputs, memo, sequence) {
        if (memo === void 0) { memo = ""; }
        if (sequence === void 0) { sequence = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fromAddrCode, inputs, transfers, msg, signInputs, signOutputs, signMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fromAddress) {
                            throw new Error("fromAddress should not be falsy");
                        }
                        if (!Array.isArray(outputs)) {
                            throw new Error("outputs should be array");
                        }
                        checkOutputs(outputs);
                        //sort denom by alphbet and init amount
                        outputs.forEach(function (item) {
                            item.coins = item.coins.sort(function (a, b) { return a.denom.localeCompare(b.denom); });
                            item.coins.forEach(function (coin) {
                                var amount = new big_js_1.default(coin.amount);
                                coin.amount = Number(amount.mul(BASENUMBER).toString());
                            });
                        });
                        fromAddrCode = crypto.decodeAddress(fromAddress);
                        inputs = [{ address: fromAddrCode, coins: [] }];
                        transfers = [];
                        outputs.forEach(function (item) {
                            var toAddcCode = crypto.decodeAddress(item.to);
                            calInputCoins(inputs, item.coins);
                            transfers.push({ address: toAddcCode, coins: item.coins });
                        });
                        msg = {
                            inputs: inputs,
                            outputs: transfers,
                            aminoPrefix: stdTx_1.TxAminoPrefix.MsgSend
                        };
                        signInputs = [{ address: fromAddress, coins: [] }];
                        signOutputs = [];
                        outputs.forEach(function (item, index) {
                            signOutputs.push({ address: item.to, coins: [] });
                            item.coins.forEach(function (c) {
                                signOutputs[index].coins.push(c);
                            });
                            calInputCoins(signInputs, item.coins);
                        });
                        signMsg = {
                            inputs: signInputs,
                            outputs: signOutputs
                        };
                        return [4 /*yield*/, this._prepareTransaction(msg, signMsg, fromAddress, sequence, memo)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * Cancel an order.
     * @param {String} fromAddress
     * @param {String} symbol the market pair
     * @param {String} refid the order ID of the order to cancel
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */
    BncClient.prototype.cancelOrder = function (fromAddress, symbol, refid, sequence) {
        if (sequence === void 0) { sequence = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var accCode, msg, signMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accCode = crypto.decodeAddress(fromAddress);
                        msg = {
                            sender: accCode,
                            symbol: symbol,
                            refid: refid,
                            aminoPrefix: stdTx_1.TxAminoPrefix.CancelOrderMsg
                        };
                        signMsg = {
                            refid: refid,
                            sender: fromAddress,
                            symbol: symbol
                        };
                        return [4 /*yield*/, this._prepareTransaction(msg, signMsg, fromAddress, sequence, "")];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * Place an order.
     * @param {String} address
     * @param {String} symbol the market pair
     * @param {Number} side (1-Buy, 2-Sell)
     * @param {Number} price
     * @param {Number} quantity
     * @param {Number} sequence optional sequence
     * @param {Number} timeinforce (1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel))
     * @return {Promise} resolves with response (success or fail)
     */
    BncClient.prototype.placeOrder = function (address, symbol, side, price, quantity, sequence, timeinforce) {
        if (address === void 0) { address = this.address; }
        if (sequence === void 0) { sequence = null; }
        if (timeinforce === void 0) { timeinforce = 1; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var accCode, data, bigPrice, bigQuantity, placeOrderMsg, signMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!address) {
                            throw new Error("address should not be falsy");
                        }
                        if (!symbol) {
                            throw new Error("symbol should not be falsy");
                        }
                        if (side !== 1 && side !== 2) {
                            throw new Error("side can only be 1 or 2");
                        }
                        if (timeinforce !== 1 && timeinforce !== 3) {
                            throw new Error("timeinforce can only be 1 or 3");
                        }
                        accCode = crypto.decodeAddress(address);
                        if (!(sequence !== 0 && !sequence)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._httpClient.request("get", exports.api.getAccount + "/" + address)];
                    case 1:
                        data = _a.sent();
                        sequence = data.result && data.result.sequence;
                        _a.label = 2;
                    case 2:
                        bigPrice = new big_js_1.default(price);
                        bigQuantity = new big_js_1.default(quantity);
                        placeOrderMsg = {
                            sender: accCode,
                            id: (accCode.toString("hex") + "-" + (sequence + 1)).toUpperCase(),
                            symbol: symbol,
                            ordertype: 2,
                            side: side,
                            price: parseFloat(bigPrice.mul(BASENUMBER).toString()),
                            quantity: parseFloat(bigQuantity.mul(BASENUMBER).toString()),
                            timeinforce: timeinforce,
                            aminoPrefix: stdTx_1.TxAminoPrefix.NewOrderMsg
                        };
                        signMsg = {
                            id: placeOrderMsg.id,
                            ordertype: placeOrderMsg.ordertype,
                            price: placeOrderMsg.price,
                            quantity: placeOrderMsg.quantity,
                            sender: address,
                            side: placeOrderMsg.side,
                            symbol: placeOrderMsg.symbol,
                            timeinforce: timeinforce
                        };
                        validateHelper_1.checkNumber(placeOrderMsg.price, "price");
                        validateHelper_1.checkNumber(placeOrderMsg.quantity, "quantity");
                        return [4 /*yield*/, this._prepareTransaction(placeOrderMsg, signMsg, address, sequence, "")];
                    case 3:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * @param {String} address
     * @param {Number} proposalId
     * @param {String} baseAsset
     * @param {String} quoteAsset
     * @param {Number} initPrice
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */
    BncClient.prototype.list = function (address, proposalId, baseAsset, quoteAsset, initPrice, sequence) {
        if (sequence === void 0) { sequence = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var accCode, init_price, listMsg, signMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accCode = crypto.decodeAddress(address);
                        if (!address) {
                            throw new Error("address should not be falsy");
                        }
                        if (proposalId <= 0) {
                            throw new Error("proposal id should larger than 0");
                        }
                        if (initPrice <= 0) {
                            throw new Error("price should larger than 0");
                        }
                        if (!baseAsset) {
                            throw new Error("baseAsset should not be falsy");
                        }
                        if (!quoteAsset) {
                            throw new Error("quoteAsset should not be falsy");
                        }
                        init_price = Number(new big_js_1.default(initPrice).mul(BASENUMBER).toString());
                        listMsg = {
                            from: accCode,
                            proposal_id: proposalId,
                            base_asset_symbol: baseAsset,
                            quote_asset_symbol: quoteAsset,
                            init_price: init_price,
                            aminoPrefix: stdTx_1.TxAminoPrefix.ListMsg
                        };
                        signMsg = {
                            base_asset_symbol: baseAsset,
                            from: address,
                            init_price: init_price,
                            proposal_id: proposalId,
                            quote_asset_symbol: quoteAsset
                        };
                        return [4 /*yield*/, this._prepareTransaction(listMsg, signMsg, address, sequence, "")];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * Set account flags
     * @param {String} address
     * @param {Number} flags new value of account flags
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */
    BncClient.prototype.setAccountFlags = function (address, flags, sequence) {
        if (sequence === void 0) { sequence = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var accCode, msg, signMsg, signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accCode = crypto.decodeAddress(address);
                        msg = {
                            from: accCode,
                            flags: flags,
                            aminoPrefix: stdTx_1.TxAminoPrefix.SetAccountFlagsMsg
                        };
                        signMsg = {
                            flags: flags,
                            from: address
                        };
                        return [4 /*yield*/, this._prepareTransaction(msg, signMsg, address, sequence, "")];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this._broadcastDelegate(signedTx)];
                }
            });
        });
    };
    /**
     * Prepare a serialized raw transaction for sending to the blockchain.
     * @param {Object} msg the msg object
     * @param {Object} stdSignMsg the sign doc object used to generate a signature
     * @param {String} address
     * @param {Number} sequence optional sequence
     * @param {String} memo optional memo
     * @return {Transaction} signed transaction
     */
    BncClient.prototype._prepareTransaction = function (msg, stdSignMsg, address, sequence, memo) {
        if (sequence === void 0) { sequence = null; }
        if (memo === void 0) { memo = ""; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, tx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((!this.account_number || (sequence !== 0 && !sequence)) && address)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._httpClient.request("get", exports.api.getAccount + "/" + address)];
                    case 1:
                        data = _a.sent();
                        sequence = data.result.sequence;
                        this.account_number = data.result.account_number;
                        return [3 /*break*/, 4];
                    case 2:
                        if (!this._setPkPromise) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._setPkPromise];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        tx = new tx_1.default({
                            accountNumber: typeof this.account_number !== "number"
                                ? parseInt(this.account_number)
                                : this.account_number,
                            chainId: this.chainId,
                            memo: memo,
                            msg: msg,
                            sequence: typeof sequence !== "number" ? parseInt(sequence) : sequence,
                            source: this._source
                        });
                        return [2 /*return*/, this._signingDelegate.call(this, tx, stdSignMsg)];
                }
            });
        });
    };
    /**
     * Broadcast a transaction to the blockchain.
     * @param {signedTx} tx signed Transaction object
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Promise} resolves with response (success or fail)
     */
    BncClient.prototype.sendTransaction = function (signedTx, sync) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var signedBz;
            return tslib_1.__generator(this, function (_a) {
                signedBz = signedTx.serialize();
                return [2 /*return*/, this.sendRawTransaction(signedBz, sync)];
            });
        });
    };
    /**
     * Broadcast a raw transaction to the blockchain.
     * @param {String} signedBz signed and serialized raw transaction
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Promise} resolves with response (success or fail)
     */
    BncClient.prototype.sendRawTransaction = function (signedBz, sync) {
        if (sync === void 0) { sync = !this._useAsyncBroadcast; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opts;
            return tslib_1.__generator(this, function (_a) {
                opts = {
                    data: signedBz,
                    headers: {
                        "content-type": "text/plain"
                    }
                };
                return [2 /*return*/, this._httpClient.request("post", exports.api.broadcast + "?sync=" + sync, null, opts)];
            });
        });
    };
    /**
     * Broadcast a raw transaction to the blockchain.
     * @param {Object} msg the msg object
     * @param {Object} stdSignMsg the sign doc object used to generate a signature
     * @param {String} address
     * @param {Number} sequence optional sequence
     * @param {String} memo optional memo
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Promise} resolves with response (success or fail)
     */
    BncClient.prototype._sendTransaction = function (msg, stdSignMsg, address, sequence, memo, sync) {
        if (sequence === void 0) { sequence = null; }
        if (memo === void 0) { memo = ""; }
        if (sync === void 0) { sync = !this._useAsyncBroadcast; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var signedTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._prepareTransaction(msg, stdSignMsg, address, sequence, memo)];
                    case 1:
                        signedTx = _a.sent();
                        return [2 /*return*/, this.sendTransaction(signedTx, sync)];
                }
            });
        });
    };
    /**
     * get account
     * @param {String} address
     * @return {Promise} resolves with http response
     */
    BncClient.prototype.getAccount = function (address) {
        if (address === void 0) { address = this.address; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!address) {
                            throw new Error("address should not be falsy");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._httpClient.request("get", exports.api.getAccount + "/" + address)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        err_2 = _a.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get balances
     * @param {String} address optional address
     * @return {Promise} resolves with http response
     */
    BncClient.prototype.getBalance = function (address) {
        if (address === void 0) { address = this.address; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getAccount(address)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.result.balances];
                    case 2:
                        err_3 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get markets
     * @param {Number} limit max 1000 is default
     * @param {Number} offset from beggining, default 0
     * @return {Promise} resolves with http response
     */
    BncClient.prototype.getMarkets = function (limit, offset) {
        if (limit === void 0) { limit = 1000; }
        if (offset === void 0) { offset = 0; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._httpClient.request("get", exports.api.getMarkets + "?limit=" + limit + "&offset=" + offset)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        err_4 = _a.sent();
                        console.warn("getMarkets error", err_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get transactions for an account
     * @param {String} address optional address
     * @param {Number} offset from beggining, default 0
     * @return {Promise} resolves with http response
     */
    BncClient.prototype.getTransactions = function (address, offset) {
        if (address === void 0) { address = this.address; }
        if (offset === void 0) { offset = 0; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._httpClient.request("get", exports.api.getTransactions + "?address=" + address + "&offset=" + offset)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        err_5 = _a.sent();
                        console.warn("getTransactions error", err_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get transaction
     * @param {String} hash the transaction hash
     * @return {Promise} resolves with http response
     */
    BncClient.prototype.getTx = function (hash) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_6;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._httpClient.request("get", exports.api.getTx + "/" + hash)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        err_6 = _a.sent();
                        console.warn("getTx error", err_6);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get depth for a given market
     * @param {String} symbol the market pair
     * @return {Promise} resolves with http response
     */
    BncClient.prototype.getDepth = function (symbol) {
        if (symbol === void 0) { symbol = "BNB_BUSD-BD1"; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_7;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._httpClient.request("get", exports.api.getDepth + "?symbol=" + symbol)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        err_7 = _a.sent();
                        console.warn("getDepth error", err_7);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get open orders for an address
     * @param {String} address binance address
     * @param {String} symbol binance BEP2 symbol
     * @return {Promise} resolves with http response
     */
    BncClient.prototype.getOpenOrders = function (address) {
        if (address === void 0) { address = this.address; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_8;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._httpClient.request("get", exports.api.getOpenOrders + "?address=" + address)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        err_8 = _a.sent();
                        console.warn("getOpenOrders error", err_8);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get atomic swap
     * @param {String} swapID: ID of an existing swap
     * @return {Promise} AtomicSwap
     */
    BncClient.prototype.getSwapByID = function (swapID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_9;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._httpClient.request("get", exports.api.getSwaps + "/" + swapID)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        err_9 = _a.sent();
                        console.warn("query swap by swapID error", err_9);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * query atomic swap list by creator address
     * @param {String} creator: swap creator address
     * @param {Number} offset from beginning, default 0
     * @param {Number} limit, max 1000 is default
     * @return {Promise} Array of AtomicSwap
     */
    BncClient.prototype.getSwapByCreator = function (creator, limit, offset) {
        if (limit === void 0) { limit = 100; }
        if (offset === void 0) { offset = 0; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_10;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._httpClient.request("get", exports.api.getSwaps + "?fromAddress=" + creator + "&limit=" + limit + "&offset=" + offset)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        err_10 = _a.sent();
                        console.warn("query swap list by swap creator error", err_10);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * query atomic swap list by recipient address
     * @param {String} recipient: the recipient address of the swap
     * @param {Number} offset from beginning, default 0
     * @param {Number} limit, max 1000 is default
     * @return {Promise} Array of AtomicSwap
     */
    BncClient.prototype.getSwapByRecipient = function (recipient, limit, offset) {
        if (limit === void 0) { limit = 100; }
        if (offset === void 0) { offset = 0; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_11;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._httpClient.request("get", exports.api.getSwaps + "?toAddress=" + recipient + "&limit=" + limit + "&offset=" + offset)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        err_11 = _a.sent();
                        console.warn("query swap list by swap recipient error", err_11);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a private key and returns it and its address.
     * @return {object} the private key and address in an object.
     * {
     *  address,
     *  privateKey
     * }
     */
    BncClient.prototype.createAccount = function () {
        var privateKey = crypto.generatePrivateKey();
        return {
            privateKey: privateKey,
            address: crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix)
        };
    };
    /**
     * Creates an account keystore object, and returns the private key and address.
     * @param {String} password
     *  {
     *  privateKey,
     *  address,
     *  keystore
     * }
     */
    BncClient.prototype.createAccountWithKeystore = function (password) {
        if (!password) {
            throw new Error("password should not be falsy");
        }
        var privateKey = crypto.generatePrivateKey();
        var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
        var keystore = crypto.generateKeyStore(privateKey, password);
        return {
            privateKey: privateKey,
            address: address,
            keystore: keystore
        };
    };
    /**
     * Creates an account from mnemonic seed phrase.
     * @return {object}
     * {
     *  privateKey,
     *  address,
     *  mnemonic
     * }
     */
    BncClient.prototype.createAccountWithMneomnic = function () {
        var mnemonic = crypto.generateMnemonic();
        var privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
        var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
        return {
            privateKey: privateKey,
            address: address,
            mnemonic: mnemonic
        };
    };
    /**
     * Recovers an account from a keystore object.
     * @param {object} keystore object.
     * @param {string} password password.
     * {
     * privateKey,
     * address
     * }
     */
    BncClient.prototype.recoverAccountFromKeystore = function (keystore, password) {
        var privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
        var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
        return {
            privateKey: privateKey,
            address: address
        };
    };
    /**
     * Recovers an account from a mnemonic seed phrase.
     * @param {string} mneomnic
     * {
     * privateKey,
     * address
     * }
     */
    BncClient.prototype.recoverAccountFromMnemonic = function (mnemonic) {
        var privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
        var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
        return {
            privateKey: privateKey,
            address: address
        };
    };
    // support an old method name containing a typo
    BncClient.prototype.recoverAccountFromMneomnic = function (mnemonic) {
        return this.recoverAccountFromMnemonic(mnemonic);
    };
    /**
     * Recovers an account using private key.
     * @param {String} privateKey
     * {
     * privateKey,
     * address
     * }
     */
    BncClient.prototype.recoverAccountFromPrivateKey = function (privateKey) {
        var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
        return {
            privateKey: privateKey,
            address: address
        };
    };
    /**
     * Validates an address.
     * @param {String} address
     * @param {String} prefix
     * @return {Boolean}
     */
    BncClient.prototype.checkAddress = function (address, prefix) {
        if (prefix === void 0) { prefix = this.addressPrefix; }
        return crypto.checkAddress(address, prefix);
    };
    /**
     * Returns the address for the current account if setPrivateKey has been called on this client.
     * @return {String}
     */
    BncClient.prototype.getClientKeyAddress = function () {
        if (!this.privateKey)
            throw new Error("no private key is set on this client");
        var address = crypto.getAddressFromPrivateKey(this.privateKey, this.addressPrefix);
        this.address = address;
        return address;
    };
    return BncClient;
}());
exports.BncClient = BncClient;
//# sourceMappingURL=index.js.map