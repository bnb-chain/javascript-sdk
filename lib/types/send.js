"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var msg_1 = require("./msg");
var crypto = tslib_1.__importStar(require("../crypto"));
var stdTx_1 = require("./stdTx");
var big_js_1 = tslib_1.__importDefault(require("big.js"));
/**
 * Only support transfers of one-to-one, one-to-many
 */
var SendMsg = /** @class */ (function (_super) {
    tslib_1.__extends(SendMsg, _super);
    function SendMsg(sender, outputs) {
        var _this = _super.call(this) || this;
        _this.aminoPrefix = stdTx_1.TxAminoPrefix.MsgSend;
        _this.sender = sender;
        _this.outputs = outputs;
        return _this;
    }
    SendMsg.prototype.calInputCoins = function (inputsCoins, coins) {
        coins.forEach(function (coin) {
            var existCoin = inputsCoins.find(function (c) { return c.denom === coin.denom; });
            if (existCoin) {
                var existAmount = new big_js_1.default(existCoin.amount);
                existCoin.amount = Number(existAmount.plus(coin.amount).toString());
            }
            else {
                inputsCoins.push(tslib_1.__assign({}, coin));
            }
        });
    };
    SendMsg.prototype.getSignMsg = function () {
        var _this = this;
        var signMsg = {
            inputs: [{ address: this.sender, coins: [] }],
            outputs: this.outputs
        };
        this.outputs.forEach(function (item) {
            _this.calInputCoins(signMsg.inputs[0].coins, item.coins);
        });
        return signMsg;
    };
    SendMsg.prototype.getMsg = function () {
        var _this = this;
        var msg = {
            inputs: [{ address: crypto.decodeAddress(this.sender), coins: [] }],
            outputs: [],
            aminoPrefix: this.aminoPrefix
        };
        this.outputs.forEach(function (item) {
            _this.calInputCoins(msg.inputs[0].coins, item.coins);
            var output = {
                address: crypto.decodeAddress(item.address),
                coins: item.coins
            };
            msg.outputs.push(output);
        });
        return msg;
    };
    return SendMsg;
}(msg_1.BaseMsg));
exports.SendMsg = SendMsg;
//# sourceMappingURL=send.js.map