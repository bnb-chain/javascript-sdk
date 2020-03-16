"use strict";
/**
 * https://github.com/nomic-io/js-tendermint/blob/master/src/rpc.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var is_js_1 = tslib_1.__importDefault(require("is_js"));
var events_1 = require("events");
var axios_1 = tslib_1.__importDefault(require("axios"));
var url_1 = tslib_1.__importDefault(require("url"));
var websocket_stream_1 = tslib_1.__importDefault(require("websocket-stream"));
var ndjson_1 = tslib_1.__importDefault(require("ndjson"));
var pumpify_1 = tslib_1.__importDefault(require("pumpify"));
function convertHttpArgs(url, args) {
    if (args === void 0) { args = {}; }
    var search = [];
    for (var k in args) {
        if (is_js_1.default.string(args[k])) {
            search.push(k + "=\"" + args[k] + "\"");
        }
        else if (Buffer.isBuffer(args[k])) {
            search.push(k + "=0x" + args[k].toString("hex"));
        }
        else {
            search.push(k + "=" + args[k]);
        }
    }
    return url + "?" + search.join("&");
}
function convertWsArgs(args) {
    if (args === void 0) { args = {}; }
    for (var k in args) {
        var v = args[k];
        if (typeof v === "number") {
            args[k] = String(v);
        }
        else if (Buffer.isBuffer(v)) {
            args[k] = "0x" + v.toString("hex");
        }
        else if (v instanceof Uint8Array) {
            args[k] = "0x" + Buffer.from(v).toString("hex");
        }
    }
    return args;
}
var wsProtocols = ["ws:", "wss:"];
var httpProtocols = ["http:", "https:"];
var allProtocols = wsProtocols.concat(httpProtocols);
var BaseRpc = /** @class */ (function (_super) {
    tslib_1.__extends(BaseRpc, _super);
    function BaseRpc(uriString) {
        if (uriString === void 0) { uriString = "localhost:27146"; }
        var _this = _super.call(this) || this;
        _this.closed = false;
        _this.createCallBasedMethod = function (name) { return function (args, listener) {
            return _this.call(name, args, listener).then(function (res) {
                return res;
            });
        }; };
        _this.subscribe = _this.createCallBasedMethod("subscribe");
        _this.unsubscribe = _this.createCallBasedMethod("unsubscribe");
        _this.unsubscribeAll = _this.createCallBasedMethod("unsubscribe_all");
        _this.status = _this.createCallBasedMethod("status");
        _this.netInfo = _this.createCallBasedMethod("net_info");
        _this.blockchain = _this.createCallBasedMethod("blockchain");
        _this.genesis = _this.createCallBasedMethod("genesis");
        _this.health = _this.createCallBasedMethod("health");
        _this.block = _this.createCallBasedMethod("block");
        _this.blockResults = _this.createCallBasedMethod("block_results");
        _this.validators = _this.createCallBasedMethod("validators");
        _this.consensusState = _this.createCallBasedMethod("consensus_state");
        _this.dumpConsensusState = _this.createCallBasedMethod("dump_consensus_state");
        _this.broadcastTxCommit = _this.createCallBasedMethod("broadcast_tx_commit");
        _this.broadcastTxSync = _this.createCallBasedMethod("broadcast_tx_sync");
        _this.broadcastTxAsync = _this.createCallBasedMethod("broadcast_tx_async");
        _this.unconfirmedTxs = _this.createCallBasedMethod("unconfirmed_txs");
        _this.numUnconfirmedTxs = _this.createCallBasedMethod("num_unconfirmed_txs");
        _this.commit = _this.createCallBasedMethod("commit");
        _this.tx = _this.createCallBasedMethod("tx");
        _this.txSearch = _this.createCallBasedMethod("tx_search");
        _this.abciQuery = _this.createCallBasedMethod("abci_query");
        _this.abciInfo = _this.createCallBasedMethod("abci_info");
        // parse full-node URI
        var _a = url_1.default.parse(uriString), protocol = _a.protocol, hostname = _a.hostname, port = _a.port;
        // default to http
        if (!protocol || !allProtocols.includes(protocol)) {
            var uri = url_1.default.parse("http://" + uriString);
            protocol = uri.protocol;
            hostname = uri.hostname;
            port = uri.port;
        }
        _this.uri = !port
            ? protocol + "//" + hostname + "/"
            : protocol + "//" + hostname + ":" + port + "/";
        if (protocol && wsProtocols.includes(protocol)) {
            _this.uri = _this.uri + "websocket";
            _this.call = _this.callWs;
            _this.connectWs();
        }
        else if (protocol && httpProtocols.includes(protocol)) {
            _this.call = _this.callHttp;
        }
        return _this;
    }
    BaseRpc.prototype.connectWs = function () {
        var _this = this;
        this.ws = new pumpify_1.default.obj(ndjson_1.default.stringify(), websocket_stream_1.default(this.uri));
        this.ws.on("error", function (err) { return _this.emit("error", err); });
        this.ws.on("close", function () {
            if (_this.closed)
                return;
            _this.emit("error", Error("websocket disconnected"));
        });
        this.ws.on("data", function (data) {
            data = JSON.parse(data);
            if (!data.id)
                return;
            _this.emit(data.id, data.error, data.result);
        });
    };
    BaseRpc.prototype.callHttp = function (method, args) {
        var url = this.uri + method;
        url = convertHttpArgs(url, args);
        return axios_1.default({
            url: url
        }).then(function (_a) {
            var data = _a.data;
            if (data.error) {
                var err = Error(data.error.message);
                Object.assign(err, data.error);
                throw err;
            }
            return data.result;
        }, function (err) {
            throw Error(err);
        });
    };
    BaseRpc.prototype.callWs = function (method, args, listener) {
        var _this = this;
        var self = this;
        return new Promise(function (resolve, reject) {
            var _a;
            var id = Math.random().toString(36);
            var params = convertWsArgs(args);
            if (method === "subscribe") {
                if (typeof listener !== "function") {
                    throw Error("Must provide listener function");
                }
                // events get passed to listener
                _this.on(id + "#event", function (err, res) {
                    if (err)
                        return self.emit("error", err);
                    return listener(res.data.value);
                });
                // promise resolves on successful subscription or error
                _this.on(id, function (err) {
                    if (err)
                        return reject(err);
                    resolve();
                });
            }
            else {
                // response goes to promise
                _this.once(id, function (err, res) {
                    if (err)
                        return reject(err);
                    resolve(res);
                });
            }
            (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.write({ jsonrpc: "2.0", id: id, method: method, params: params });
        });
    };
    BaseRpc.prototype.close = function () {
        this.closed = true;
        if (!this.ws)
            return;
        this.ws.destroy();
    };
    return BaseRpc;
}(events_1.EventEmitter));
exports.default = BaseRpc;
//# sourceMappingURL=index.js.map