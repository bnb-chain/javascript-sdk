"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var is_js_1 = tslib_1.__importDefault(require("is_js"));
// typeToTyp3
//amino type convert
exports.default = (function (type) {
    if (is_js_1.default.boolean(type)) {
        return 0;
    }
    if (is_js_1.default.number(type)) {
        if (is_js_1.default.integer(type)) {
            return 0;
        }
        else {
            return 1;
        }
    }
    if (is_js_1.default.string(type) || is_js_1.default.array(type) || is_js_1.default.object(type)) {
        return 2;
    }
    throw new Error("Invalid type \"" + type + "\""); // Is this what's expected?
});
exports.size = function (items, iter, acc) {
    if (acc === undefined)
        acc = 0;
    for (var i = 0; i < items.length; ++i)
        acc += iter(items[i], i, acc);
    return acc;
};
//# sourceMappingURL=encoderHelper.js.map