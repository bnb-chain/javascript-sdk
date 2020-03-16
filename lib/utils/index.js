"use strict";
/**
 * @module utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enc_hex_1 = tslib_1.__importDefault(require("crypto-js/enc-hex"));
var sha3_1 = tslib_1.__importDefault(require("crypto-js/sha3"));
var sha256_1 = tslib_1.__importDefault(require("crypto-js/sha256"));
var ripemd160_1 = tslib_1.__importDefault(require("crypto-js/ripemd160"));
var crypto = tslib_1.__importStar(require("../crypto"));
/**
 * @param {arrayBuffer} buf
 * @returns {string} ASCII string
 */
exports.ab2str = function (buf) {
    var numArr = [];
    for (var i = 0, len = buf.length; i < len; i++) {
        numArr.push(buf[i]);
    }
    String.fromCharCode.apply(null, numArr);
};
/**
 * @param {string} str - ASCII string
 * @returns {arrayBuffer}
 */
exports.str2ab = function (str) {
    if (typeof str !== "string") {
        throw new Error("str2ab expects a string");
    }
    var result = new Uint8Array(str.length);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        result[i] = str.charCodeAt(i);
    }
    return result;
};
/**
 * @param {string} str - HEX string
 * @returns {number[]}
 */
exports.hexstring2ab = function (str) {
    exports.ensureHex(str);
    if (!str.length)
        return new Uint8Array();
    var iters = str.length / 2;
    var result = new Uint8Array(iters);
    for (var i = 0; i < iters; i++) {
        result[i] = parseInt(str.substring(0, 2), 16);
        str = str.substring(2);
    }
    return result;
};
/**
 * @param {arrayBuffer} arr
 * @returns {string} HEX string
 */
exports.ab2hexstring = function (arr) {
    if (typeof arr !== "object") {
        throw new Error("ab2hexstring expects an array");
    }
    var result = "";
    for (var i = 0; i < arr.length; i++) {
        var str = arr[i].toString(16);
        str = str.length === 0 ? "00" : str.length === 1 ? "0" + str : str;
        result += str;
    }
    return result;
};
/**
 * @param {string} str - ASCII string
 * @returns {string} HEX string
 */
exports.str2hexstring = function (str) { return exports.ab2hexstring(exports.str2ab(str)); };
/**
 * @param {string} hexstring - HEX string
 * @returns {string} ASCII string
 */
exports.hexstring2str = function (hexstring) {
    return exports.ab2str(exports.hexstring2ab(hexstring));
};
/**
 * convert an integer to big endian hex and add leading zeros
 * @param {Number} num
 * @returns {string}
 */
exports.int2hex = function (num) {
    if (typeof num !== "number") {
        throw new Error("int2hex expects a number");
    }
    var h = num.toString(16);
    return h.length % 2 ? "0" + h : h;
};
/**
 * Converts a number to a big endian hexstring of a suitable size, optionally little endian
 * @param {Number} num
 * @param {Number} size - The required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1.
 * @param {Boolean} littleEndian - Encode the hex in little endian form
 * @return {string}
 */
exports.num2hexstring = function (num, size, littleEndian) {
    if (size === void 0) { size = 1; }
    if (littleEndian === void 0) { littleEndian = false; }
    if (typeof num !== "number")
        throw new Error("num must be numeric");
    if (num < 0)
        throw new RangeError("num is unsigned (>= 0)");
    if (size % 1 !== 0)
        throw new Error("size must be a whole integer");
    if (!Number.isSafeInteger(num))
        throw new RangeError("num (" + num + ") must be a safe integer");
    size = size * 2;
    var hexstring = num.toString(16);
    hexstring =
        hexstring.length % size === 0
            ? hexstring
            : ("0".repeat(size) + hexstring).substring(hexstring.length);
    if (littleEndian)
        hexstring = exports.reverseHex(hexstring);
    return hexstring;
};
/**
 * Converts a number to a variable length Int. Used for array length header
 * @param {Number} num - The number
 * @returns {string} hexstring of the variable Int.
 */
exports.num2VarInt = function (num) {
    if (num < 0xfd) {
        return exports.num2hexstring(num);
    }
    else if (num <= 0xffff) {
        // uint16
        return "fd" + exports.num2hexstring(num, 2, true);
    }
    else if (num <= 0xffffffff) {
        // uint32
        return "fe" + exports.num2hexstring(num, 4, true);
    }
    else {
        // uint64
        return "ff" + exports.num2hexstring(num, 8, true);
    }
};
/**
 * XORs two hexstrings
 * @param {string} str1 - HEX string
 * @param {string} str2 - HEX string
 * @returns {string} XOR output as a HEX string
 */
exports.hexXor = function (str1, str2) {
    exports.ensureHex(str1);
    exports.ensureHex(str2);
    if (str1.length !== str2.length)
        throw new Error("strings are disparate lengths");
    var result = [];
    for (var i = 0; i < str1.length; i += 2) {
        result.push(parseInt(str1.substr(i, 2), 16) ^ parseInt(str2.substr(i, 2), 16));
    }
    return exports.ab2hexstring(result);
};
/**
 * Reverses an array. Accepts arrayBuffer.
 * @param {Array} arr
 * @returns {Uint8Array}
 */
exports.reverseArray = function (arr) {
    if (typeof arr !== "object" || !arr.length)
        throw new Error("reverseArray expects an array");
    var result = new Uint8Array(arr.length);
    for (var i = 0; i < arr.length; i++) {
        result[i] = arr[arr.length - 1 - i];
    }
    return result;
};
/**
 * Reverses a HEX string, treating 2 chars as a byte.
 * @example
 * reverseHex('abcdef') = 'efcdab'
 * @param {string} hex - HEX string
 * @return {string} HEX string reversed in 2s.
 */
exports.reverseHex = function (hex) {
    exports.ensureHex(hex);
    var out = "";
    for (var i = hex.length - 2; i >= 0; i -= 2) {
        out += hex.substr(i, 2);
    }
    return out;
};
var hexRegex = /^([0-9A-Fa-f]{2})*$/;
/**
 * Checks if input is a hexstring. Empty string is considered a hexstring.
 * @example
 * isHex('0101') = true
 * isHex('') = true
 * isHex('0x01') = false
 * @param {string} str
 * @return {boolean}
 */
exports.isHex = function (str) {
    try {
        return hexRegex.test(str);
    }
    catch (err) {
        return false;
    }
};
/**
 * Throws an error if input is not hexstring.
 * @param {string} str
 */
exports.ensureHex = function (str) {
    if (!exports.isHex(str))
        throw new Error("Expected a hexstring but got " + str);
};
/**
 * Computes a SHA256 followed by a RIPEMD160.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */
exports.sha256ripemd160 = function (hex) {
    if (typeof hex !== "string")
        throw new Error("sha256ripemd160 expects a string");
    if (hex.length % 2 !== 0)
        throw new Error("invalid hex string length: " + hex);
    var hexEncoded = enc_hex_1.default.parse(hex);
    var ProgramSha256 = sha256_1.default(hexEncoded);
    return ripemd160_1.default(ProgramSha256).toString();
};
/**
 * Computes a single SHA256 digest.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */
exports.sha256 = function (hex) {
    if (typeof hex !== "string")
        throw new Error("sha256 expects a hex string");
    if (hex.length % 2 !== 0)
        throw new Error("invalid hex string length: " + hex);
    var hexEncoded = enc_hex_1.default.parse(hex);
    return sha256_1.default(hexEncoded).toString();
};
/**
 * Computes a single SHA3 (Keccak) digest.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */
exports.sha3 = function (hex) {
    if (typeof hex !== "string")
        throw new Error("sha3 expects a hex string");
    if (hex.length % 2 !== 0)
        throw new Error("invalid hex string length: " + hex);
    var hexEncoded = enc_hex_1.default.parse(hex);
    return sha3_1.default(hexEncoded).toString();
};
/**
 * Computes sha256 of random number and timestamp
 * @param {String} randomNumber
 * @param {Number} timestamp
 * @returns {string} sha256 result
 */
exports.calculateRandomNumberHash = function (randomNumber, timestamp) {
    var timestampHexStr = timestamp.toString(16);
    var timestampHexStrFormat = timestampHexStr;
    for (var i = 0; i < 16 - timestampHexStr.length; i++) {
        timestampHexStrFormat = "0" + timestampHexStrFormat;
    }
    var timestampBytes = Buffer.from(timestampHexStrFormat, "hex");
    var newBuffer = Buffer.concat([
        Buffer.from(randomNumber, "hex"),
        timestampBytes
    ]);
    return exports.sha256(newBuffer.toString("hex"));
};
/**
 * Computes swapID
 * @param {String} randomNumberHash
 * @param {String} sender
 * @param {String} senderOtherChain
 * @returns {string} sha256 result
 */
exports.calculateSwapID = function (randomNumberHash, sender, senderOtherChain) {
    var randomNumberHashBytes = Buffer.from(randomNumberHash, "hex");
    var senderBytes = crypto.decodeAddress(sender);
    var sendOtherChainBytes = Buffer.from(senderOtherChain.toLowerCase(), "utf8");
    var newBuffer = Buffer.concat([
        randomNumberHashBytes,
        senderBytes,
        sendOtherChainBytes
    ]);
    return exports.sha256(newBuffer.toString("hex"));
};
//# sourceMappingURL=index.js.map