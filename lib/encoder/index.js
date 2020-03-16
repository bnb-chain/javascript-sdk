"use strict";
/**
 * @module amino.encode
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var protocol_buffers_encodings_1 = require("protocol-buffers-encodings");
var is_js_1 = tslib_1.__importDefault(require("is_js"));
var varint_1 = require("./varint");
var encoderHelper_1 = tslib_1.__importDefault(require("../utils/encoderHelper"));
var sortObject = function (obj) {
    if (obj === null)
        return null;
    if (typeof obj !== "object")
        return obj;
    // arrays have typeof "object" in js!
    if (Array.isArray(obj))
        return obj.map(sortObject);
    var sortedKeys = Object.keys(obj).sort();
    var result = {};
    sortedKeys.forEach(function (key) {
        result[key] = sortObject(obj[key]);
    });
    return result;
};
/**
 * encode number
 * @param num
 */
exports.encodeNumber = function (num) { return varint_1.UVarInt.encode(num); };
/**
 * encode bool
 * @param b
 */
exports.encodeBool = function (b) {
    return b ? varint_1.UVarInt.encode(1) : varint_1.UVarInt.encode(0);
};
/**
 * encode string
 * @param str
 */
exports.encodeString = function (str) {
    var buf = Buffer.alloc(protocol_buffers_encodings_1.string.encodingLength(str));
    return protocol_buffers_encodings_1.string.encode(str, buf, 0);
};
/**
 * encode time
 * @param value
 */
exports.encodeTime = function (value) {
    var millis = new Date(value).getTime();
    var seconds = Math.floor(millis / 1000);
    var nanos = Number(seconds.toString().padEnd(9, "0"));
    var buffer = Buffer.alloc(14);
    // buffer[0] = (1 << 3) | 1 // field 1, typ3 1
    buffer.writeInt32LE((1 << 3) | 1, 0);
    buffer.writeUInt32LE(seconds, 1);
    // buffer[9] = (2 << 3) | 5 // field 2, typ3 5
    buffer.writeInt32LE((2 << 3) | 5, 9);
    buffer.writeUInt32LE(nanos, 10);
    return buffer;
};
/**
 * @param obj -- {object}
 * @return bytes {Buffer}
 */
exports.convertObjectToSignBytes = function (obj) {
    return Buffer.from(JSON.stringify(sortObject(obj)));
};
/**
 * js amino MarshalBinary
 * @param {Object} obj
 *  */
exports.marshalBinary = function (obj) {
    if (!is_js_1.default.object(obj))
        throw new TypeError("data must be an object");
    return exports.encodeBinary(obj, -1, true).toString("hex");
};
/**
 * js amino MarshalBinaryBare
 * @param {Object} obj
 *  */
exports.marshalBinaryBare = function (obj) {
    if (!is_js_1.default.object(obj))
        throw new TypeError("data must be an object");
    return exports.encodeBinary(obj).toString("hex");
};
/**
 * This is the main entrypoint for encoding all types in binary form.
 * @param {*} js data type (not null, not undefined)
 * @param {Number} field index of object
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} binary of object.
 */
exports.encodeBinary = function (val, fieldNum, isByteLenPrefix) {
    if (val === null || val === undefined)
        throw new TypeError("unsupported type");
    if (Buffer.isBuffer(val)) {
        if (isByteLenPrefix) {
            return Buffer.concat([varint_1.UVarInt.encode(val.length), val]);
        }
        return val;
    }
    if (is_js_1.default.array(val)) {
        return exports.encodeArrayBinary(fieldNum, val, isByteLenPrefix);
    }
    if (is_js_1.default.number(val)) {
        return exports.encodeNumber(val);
    }
    if (is_js_1.default.boolean(val)) {
        return exports.encodeBool(val);
    }
    if (is_js_1.default.string(val)) {
        return exports.encodeString(val);
    }
    if (is_js_1.default.object(val)) {
        return exports.encodeObjectBinary(val, isByteLenPrefix);
    }
    return;
};
/**
 * prefixed with bytes length
 * @param {Buffer} bytes
 * @return {Buffer} with bytes length prefixed
 */
exports.encodeBinaryByteArray = function (bytes) {
    var lenPrefix = bytes.length;
    return Buffer.concat([varint_1.UVarInt.encode(lenPrefix), bytes]);
};
/**
 *
 * @param {Object} obj
 * @return {Buffer} with bytes length prefixed
 */
exports.encodeObjectBinary = function (obj, isByteLenPrefix) {
    var bufferArr = [];
    Object.keys(obj).forEach(function (key, index) {
        if (key === "aminoPrefix" || key === "version")
            return;
        if (isDefaultValue(obj[key]))
            return;
        if (is_js_1.default.array(obj[key]) && obj[key].length > 0) {
            bufferArr.push(exports.encodeArrayBinary(index, obj[key]));
        }
        else {
            bufferArr.push(encodeTypeAndField(index, obj[key]));
            bufferArr.push(exports.encodeBinary(obj[key], index, true));
        }
    });
    var bytes = Buffer.concat(bufferArr);
    // add prefix
    if (obj.aminoPrefix) {
        var prefix = Buffer.from(obj.aminoPrefix, "hex");
        bytes = Buffer.concat([prefix, bytes]);
    }
    // Write byte-length prefixed.
    if (isByteLenPrefix) {
        var lenBytes = varint_1.UVarInt.encode(bytes.length);
        bytes = Buffer.concat([lenBytes, bytes]);
    }
    return bytes;
};
/**
 * @param {Number} fieldNum object field index
 * @param {Array} arr
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} bytes of array
 */
exports.encodeArrayBinary = function (fieldNum, arr, isByteLenPrefix) {
    var result = [];
    arr.forEach(function (item) {
        result.push(encodeTypeAndField(fieldNum, item));
        if (isDefaultValue(item)) {
            result.push(Buffer.from("00", "hex"));
            return;
        }
        result.push(exports.encodeBinary(item, fieldNum, true));
    });
    //encode length
    if (isByteLenPrefix) {
        var length_1 = result.reduce(function (prev, item) { return prev + item.length; }, 0);
        result.unshift(varint_1.UVarInt.encode(length_1));
    }
    return Buffer.concat(result);
};
// Write field key.
var encodeTypeAndField = function (index, field) {
    index = Number(index);
    var value = ((index + 1) << 3) | encoderHelper_1.default(field);
    return varint_1.UVarInt.encode(value);
};
var isDefaultValue = function (obj) {
    if (obj === null)
        return false;
    return ((is_js_1.default.number(obj) && obj === 0) ||
        (is_js_1.default.string(obj) && obj === "") ||
        (is_js_1.default.array(obj) && obj.length === 0) ||
        (is_js_1.default.boolean(obj) && !obj));
};
//# sourceMappingURL=index.js.map