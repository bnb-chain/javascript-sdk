"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var msg_1 = require("./msg");
var crypto = tslib_1.__importStar(require("../crypto"));
var stdTx_1 = require("./stdTx");
var NewOrderMsg = /** @class */ (function (_super) {
    tslib_1.__extends(NewOrderMsg, _super);
    function NewOrderMsg(data, address) {
        var _this = _super.call(this) || this;
        _this.aminoPrefix = stdTx_1.TxAminoPrefix.NewOrderMsg;
        _this.newOrder = data;
        _this.address = address;
        return _this;
    }
    NewOrderMsg.prototype.getSignMsg = function () {
        var signMsg = tslib_1.__assign({ sender: this.address }, this.newOrder);
        return signMsg;
    };
    NewOrderMsg.prototype.getMsg = function () {
        var data = tslib_1.__assign(tslib_1.__assign({ sender: crypto.decodeAddress(this.address) }, this.newOrder), { aminoPrefix: this.aminoPrefix });
        return data;
    };
    return NewOrderMsg;
}(msg_1.BaseMsg));
exports.NewOrderMsg = NewOrderMsg;
//# sourceMappingURL=newOrder.js.map