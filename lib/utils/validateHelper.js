"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var big_js_1 = tslib_1.__importDefault(require("big.js"));
var MAX_INT64 = Math.pow(2, 63);
/**
 * validate the input number.
 * @param {Number} value
 */
exports.checkNumber = function (value, name) {
    if (name === void 0) { name = "input number"; }
    if (new big_js_1.default(value).lte(0)) {
        throw new Error(name + " should be a positive number");
    }
    if (new big_js_1.default(value).gte(MAX_INT64)) {
        throw new Error(name + " should be less than 2^63");
    }
};
/**
 * basic validation of coins
 * @param {Array} coins
 */
exports.checkCoins = function (coins) {
    coins = coins || [];
    coins.forEach(function (coin) {
        exports.checkNumber(coin.amount);
        if (!coin.denom) {
            throw new Error("invalid denmon");
        }
    });
};
exports.validateSymbol = function (symbol) {
    if (!symbol) {
        throw new Error("suffixed token symbol cannot be empty");
    }
    var splitSymbols = symbol.split("-");
    //check length with .B suffix
    if (!/^[a-zA-z\d/.]{3,10}$/.test(splitSymbols[0])) {
        throw new Error("symbol length is limited to 3~10");
    }
};
exports.validateTradingPair = function (pair) {
    var symbols = pair.split("_");
    if (symbols.length !== 2) {
        throw new Error('the pair should in format "symbol1_symbol2"');
    }
    exports.validateSymbol(symbols[0]);
    exports.validateSymbol(symbols[1]);
};
exports.validateOffsetLimit = function (offset, limit) {
    if (offset < 0) {
        throw new Error("offset can't be less than 0");
    }
    if (limit < 0) {
        throw new Error("limit can't be less than 0");
    }
};
//# sourceMappingURL=validateHelper.js.map