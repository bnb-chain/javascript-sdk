"use strict";
/**
 * @module amino.decode
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var protocol_buffers_encodings_1 = require("protocol-buffers-encodings");
var is_js_1 = tslib_1.__importDefault(require("is_js"));
var encoderHelper_1 = tslib_1.__importDefault(require("../utils/encoderHelper"));
var decoder = function (bytes, varType) {
    var val = varType.decode(bytes, 0);
    var offset = varType.encodingLength(val);
    return { val: val, offset: offset };
};
/**
 * js amino UnmarshalBinaryLengthPrefixed
 * @param {Buffer} bytes
 * @param {Object} type
 * @returns {Object}
 *  */
exports.unMarshalBinaryLengthPrefixed = function (bytes, type) {
    if (bytes.length === 0)
        throw new TypeError("Cannot decode empty bytes");
    // read byte-length prefix
    var len = decoder(bytes, protocol_buffers_encodings_1.varint).offset;
    if (len < 0)
        throw new Error("Error reading msg byte-length prefix: got code " + len);
    bytes = bytes.slice(len);
    return exports.unMarshalBinaryBare(bytes, type);
};
/**
 * js amino UnmarshalBinaryBare
 * @param {Buffer} bytes
 * @param {Object} type
 * @returns {Object}
 *  */
exports.unMarshalBinaryBare = function (bytes, type) {
    if (!is_js_1.default.object(type))
        throw new TypeError("type should be object");
    if (!Buffer.isBuffer(bytes))
        throw new TypeError("bytes must be buffer");
    if (is_js_1.default.array(type)) {
        if (!is_js_1.default.object(type[0]))
            throw new TypeError("type should be object");
        return decodeArrayBinary(bytes, type[0]);
    }
    return decodeBinary(bytes, type);
};
var decodeBinary = function (bytes, type, isLengthPrefixed) {
    if (Buffer.isBuffer(type)) {
        return decoder(bytes, protocol_buffers_encodings_1.bytes);
    }
    if (is_js_1.default.array(type)) {
        return decodeArrayBinary(bytes, type);
    }
    if (is_js_1.default.number(type)) {
        return decoder(bytes, protocol_buffers_encodings_1.varint);
    }
    if (is_js_1.default.boolean(type)) {
        return decoder(bytes, protocol_buffers_encodings_1.bool);
    }
    if (is_js_1.default.string(type)) {
        return decoder(bytes, protocol_buffers_encodings_1.string);
    }
    if (is_js_1.default.object(type)) {
        return decodeObjectBinary(bytes, type, isLengthPrefixed);
    }
    return;
};
var setDefaultValue = function (type, key) {
    if (is_js_1.default.object(type[key]))
        type[key] = null;
    if (is_js_1.default.number(type[key]))
        type[key] = 0;
    if (is_js_1.default.boolean(type[key]))
        type[key] = false;
    if (is_js_1.default.string(type[key]))
        type[key] = "";
};
var decodeObjectBinary = function (bytes, type, isLengthPrefixed) {
    var objectOffset = 0;
    // read byte-length prefix
    if (isLengthPrefixed) {
        var len = decoder(bytes, protocol_buffers_encodings_1.varint).offset;
        bytes = bytes.slice(len);
        objectOffset += len;
    }
    // If registered concrete, consume and verify prefix bytes.
    if (type.aminoPrefix) {
        bytes = bytes.slice(4);
        objectOffset += 4;
    }
    var lastFieldNum = 0;
    var keys = Object.keys(type).filter(function (key) { return key !== "aminoPrefix"; });
    keys.forEach(function (key, index) {
        if (is_js_1.default.array(type[key])) {
            var _a = decodeArrayBinary(bytes, type[key][0]), offset = _a.offset, val = _a.val;
            objectOffset += offset;
            type[key] = val;
            bytes = bytes.slice(offset);
        }
        else {
            var _b = exports.decodeFieldNumberAndTyp3(bytes), fieldNum = _b.fieldNum, typ = _b.typ;
            //if this field is default value, continue
            if (index + 1 !== fieldNum || fieldNum < 0) {
                setDefaultValue(type, key);
                return;
            }
            if (fieldNum <= lastFieldNum) {
                throw new Error("encountered fieldNum: " + fieldNum + ", but we have already seen fnum: " + lastFieldNum);
            }
            lastFieldNum = fieldNum;
            if (index + 1 !== fieldNum) {
                throw new Error("field number is not expected");
            }
            var typeWanted = encoderHelper_1.default(type[key]);
            if (typ !== typeWanted) {
                throw new Error("field type is not expected");
            }
            //remove 1 byte of type
            bytes = bytes.slice(1);
            var _c = decodeBinary(bytes, type[key], true), val = _c.val, offset = _c.offset;
            type[key] = val;
            //remove decoded bytes
            bytes = bytes.slice(offset);
            objectOffset += offset + 1;
        }
    });
    return { val: type, offset: objectOffset };
};
var decodeArrayBinary = function (bytes, type) {
    var arr = [];
    var arrayOffset = 0;
    var fieldNumber = exports.decodeFieldNumberAndTyp3(bytes).fieldNum;
    while (true) {
        var fieldNum = exports.decodeFieldNumberAndTyp3(bytes).fieldNum;
        if (fieldNum !== fieldNumber || fieldNum < 0)
            break;
        //remove 1 byte of encoded field number and type
        bytes = bytes.slice(1);
        //is default value, skip and continue read bytes
        // if (bytes.length > 0 && bytes[0] === 0x00) continue
        if (bytes.length > 0 && bytes.readUInt8(0) === 0x00)
            continue;
        var _a = decodeBinary(bytes, type, true), offset = _a.offset, val = _a.val;
        arr.push(tslib_1.__assign({}, val));
        bytes = bytes.slice(offset);
        //add 1 byte of type
        arrayOffset += offset + 1;
        fieldNumber = fieldNum;
    }
    // console.log(arr)
    return { val: arr, offset: arrayOffset };
};
exports.decodeFieldNumberAndTyp3 = function (bytes) {
    if (bytes.length < 2) {
        //default value
        return { fieldNum: -1 };
    }
    var val = decoder(bytes, protocol_buffers_encodings_1.varint).val;
    var typ = val & 7;
    var fieldNum = val >> 3;
    if (fieldNum > 1 << (29 - 1)) {
        throw new Error("invalid field num " + fieldNum);
    }
    return { fieldNum: fieldNum, typ: typ };
};
//# sourceMappingURL=index.js.map