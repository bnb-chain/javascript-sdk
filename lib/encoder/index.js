'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeArrayBinary = exports.encodeObjectBinary = exports.encodeBinaryByteArray = exports.encodeBinary = exports.marshalBinaryBare = exports.marshalBinary = exports.convertObjectToBytes = exports.encodeTime = exports.encodeString = exports.encodeBool = exports.encodeNumber = undefined;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _varint = require('./varint');

var _varint2 = _interopRequireDefault(_varint);

var _encoderHelper = require('../utils/encoderHelper');

var _encoderHelper2 = _interopRequireDefault(_encoderHelper);

var _safeBuffer = require('safe-buffer');

var _tx = require('../tx/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VarString = _varstruct2.default.VarString(_varint.UVarInt);

/**
 * encode number
 * @param num
 */
var encodeNumber = exports.encodeNumber = function encodeNumber(num) {
  return _varint2.default.encode(num);
};

/**
 * encode bool
 * @param b
 */
var encodeBool = exports.encodeBool = function encodeBool(b) {
  if (b) {
    return _varint2.default.encode(1);
  } else {
    return _varint2.default.encode(0);
  }
};

/**
 * encode string
 * @param str
 */
var encodeString = exports.encodeString = function encodeString(str) {
  return VarString.encode(str);
};

/**
 * encode time
 * @param value
 */
var encodeTime = exports.encodeTime = function encodeTime(value) {

  var millis = new Date(value).getTime();
  var seconds = Math.floor(millis / 1000);
  var nanos = Number(seconds.toString().padEnd(9, '0'));

  var buffer = _safeBuffer.Buffer.alloc(14);

  buffer[0] = 1 << 3 | 1; // field 1, typ3 1
  buffer.writeUInt32LE(seconds, 1);

  buffer[9] = 2 << 3 | 5; // field 2, typ3 5
  buffer.writeUInt32LE(nanos, 10);

  return buffer;
};

/**
 * @param obj -- {object}
 * @return bytes {Buffer}
 */
var convertObjectToBytes = exports.convertObjectToBytes = function convertObjectToBytes(obj) {
  return _safeBuffer.Buffer.from(JSON.stringify(obj));
};

/**
 * js amino MarshalBinary 
 * @param {Object} obj 
 *  */
var marshalBinary = exports.marshalBinary = function marshalBinary(obj) {
  if (!_lodash2.default.isObject(obj)) throw new TypeError('data must be an object');

  var bytes = encodeBinary(obj, null, true);

  return bytes.toString('hex');
};

/**
 * js amino MarshalBinaryBare 
 * @param {Object} obj 
 *  */
var marshalBinaryBare = exports.marshalBinaryBare = function marshalBinaryBare(obj) {
  if (!_lodash2.default.isObject(obj)) throw new TypeError('data must be an object');
  var bytes = encodeBinary(obj);
  return bytes.toString('hex');
};

/**
 * This is the main entrypoint for encoding all types in binary form.
 * @param {*} js data type (not null, not undefined)
 * @param {number} field index of object
 * @param {bool} isByteLenPrefix
 * @return {Buffer} binary of object.
 */
var encodeBinary = exports.encodeBinary = function encodeBinary(val, fieldNum, isByteLenPrefix) {
  if (val === null || val === undefined) throw new TypeError('unsupported type');

  var bytes = void 0;

  if (_safeBuffer.Buffer.isBuffer(val)) {
    if (isByteLenPrefix) {
      bytes = _safeBuffer.Buffer.concat([_varint.UVarInt.encode(val.length), val]);
    } else {
      bytes = val;
    }
  } else if (_lodash2.default.isPlainObject(val)) {
    bytes = encodeObjectBinary(val, isByteLenPrefix);
  } else if (_lodash2.default.isArray(val)) {
    bytes = encodeArrayBinary(fieldNum, val, isByteLenPrefix);
  } else if (_lodash2.default.isNumber(val)) {
    bytes = encodeNumber(val);
  } else if (_lodash2.default.isBoolean(val)) {
    bytes = encodeBool(val);
  } else if (_lodash2.default.isString(val)) {
    bytes = encodeString(val);
  }

  return bytes;
};

/**
 * prefixed with bytes length
 * @param {Buffer} bytes 
 * @return {Buffer} with bytes length prefixed
 */
var encodeBinaryByteArray = exports.encodeBinaryByteArray = function encodeBinaryByteArray(bytes) {
  var lenPrefix = bytes.length;
  return _safeBuffer.Buffer.concat([_varint.UVarInt.encode(lenPrefix), bytes]);
};

/**
 * 
 * @param {Object} obj 
 * @return {Buffer} with bytes length prefixed
 */
var encodeObjectBinary = exports.encodeObjectBinary = function encodeObjectBinary(obj, isByteLenPrefix) {
  var bufferArr = [];

  //add version 0x1
  if (obj.version === 1) {
    bufferArr.push(encodeTypeAndField(0, 1));
    bufferArr.push(_varint.UVarInt.encode(1));
  }

  Object.keys(obj).forEach(function (key, index) {
    if (key === 'msgType' || key === 'version') return;

    if (isDefaultValue(obj[key])) return;

    if (_lodash2.default.isArray(obj[key]) && obj[key].length > 0) {
      bufferArr.push(encodeArrayBinary(index, obj[key]));
    } else {
      bufferArr.push(encodeTypeAndField(index, obj[key]));
      bufferArr.push(encodeBinary(obj[key], index, true));
    }
  });

  var bytes = _safeBuffer.Buffer.concat(bufferArr);

  // add prefix
  if (_tx.typePrefix[obj.msgType]) {
    var prefix = _safeBuffer.Buffer.from(_tx.typePrefix[obj.msgType], 'hex');
    bytes = _safeBuffer.Buffer.concat([prefix, bytes]);
  }

  //Write byte-length prefixed.
  if (isByteLenPrefix) {
    var lenBytes = _varint.UVarInt.encode(bytes.length);
    bytes = _safeBuffer.Buffer.concat([lenBytes, bytes]);
  }

  return bytes;
};

/**
 * @param {number} fieldNum object field index
 * @param {Array} arr
 * @param {bool} isByteLenPrefix
 * @return {Buffer} bytes of array
 */
var encodeArrayBinary = exports.encodeArrayBinary = function encodeArrayBinary(fieldNum, arr, isByteLenPrefix) {
  var result = [];

  arr.forEach(function (item) {
    result.push(encodeTypeAndField(fieldNum, item));

    if (isDefaultValue(item)) {
      result.push(_safeBuffer.Buffer.from('00', 'hex'));
      return;
    }

    result.push(encodeBinary(item, fieldNum, true));
  });

  console.log(result);

  //encode length
  if (isByteLenPrefix) {
    var length = result.reduce(function (prev, item) {
      return prev + item.length;
    }, 0);

    console.log('length: ' + length);
    result.unshift(_varint.UVarInt.encode(length));
  }

  return _safeBuffer.Buffer.concat(result);
};

// Write field key.
var encodeTypeAndField = function encodeTypeAndField(index, field) {
  var value = index + 1 << 3 | (0, _encoderHelper2.default)(field);
  return _varint.UVarInt.encode(value);
};

var isDefaultValue = function isDefaultValue(obj) {
  if (_lodash2.default.isNumber(obj)) {
    return obj === 0;
  }

  if (_lodash2.default.isString(obj)) {
    return obj === '';
  }

  if (_lodash2.default.isArray(obj)) {
    return obj.length === 0;
  }

  return false;
};