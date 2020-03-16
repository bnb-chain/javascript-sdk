"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var msg_1 = require("./msg");
var crypto = tslib_1.__importStar(require("../crypto"));
var stdTx_1 = require("./stdTx");
var CancelOrderMsg = /** @class */ (function (_super) {
    tslib_1.__extends(CancelOrderMsg, _super);
    function CancelOrderMsg(address, sybmol, orderId) {
        var _this = _super.call(this) || this;
        _this.aminoPrefix = stdTx_1.TxAminoPrefix.CancelOrderMsg;
        _this.address = address;
        _this.symbol = sybmol;
        _this.orderId = orderId;
        return _this;
    }
    CancelOrderMsg.prototype.getSignMsg = function () {
        var signMsg = {
            sender: this.address,
            symbol: this.symbol,
            refid: this.orderId
        };
        return signMsg;
    };
    CancelOrderMsg.prototype.getMsg = function () {
        var data = {
            sender: crypto.decodeAddress(this.address),
            symbol: this.symbol,
            refid: this.orderId,
            aminoPrefix: this.aminoPrefix
        };
        return data;
    };
    return CancelOrderMsg;
}(msg_1.BaseMsg));
exports.CancelOrderMsg = CancelOrderMsg;
//# sourceMappingURL=cancelOrder.js.map