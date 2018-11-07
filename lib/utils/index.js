'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDER = exports.sha256 = exports.sha256ripemd160 = exports.ensureHex = exports.isHex = exports.reverseHex = exports.reverseArray = exports.hexXor = exports.num2VarInt = exports.num2hexstring = exports.int2hex = exports.hexstring2str = exports.str2hexstring = exports.ab2hexstring = exports.hexstring2ab = exports.str2ab = exports.ab2str = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _encHex = require('crypto-js/enc-hex');

var _encHex2 = _interopRequireDefault(_encHex);

var _sha = require('crypto-js/sha256');

var _sha2 = _interopRequireDefault(_sha);

var _ripemd = require('crypto-js/ripemd160');

var _ripemd2 = _interopRequireDefault(_ripemd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {arrayBuffer} buf
 * @returns {string} ASCII string
 */
var ab2str = exports.ab2str = function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

/**
 * @param {string} str - ASCII string
 * @returns {arrayBuffer}
 */
var str2ab = exports.str2ab = function str2ab(str) {
  if (typeof str !== 'string') {
    throw new Error('str2ab expects a string');
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
var hexstring2ab = exports.hexstring2ab = function hexstring2ab(str) {
  ensureHex(str);
  if (!str.length) return new Uint8Array();
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
var ab2hexstring = exports.ab2hexstring = function ab2hexstring(arr) {
  if ((typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) !== 'object') {
    throw new Error('ab2hexstring expects an array');
  }
  var result = '';
  for (var i = 0; i < arr.length; i++) {
    var str = arr[i].toString(16);
    str = str.length === 0 ? '00' : str.length === 1 ? '0' + str : str;
    result += str;
  }
  return result;
};

/**
 * @param {string} str - ASCII string
 * @returns {string} HEX string
 */
var str2hexstring = exports.str2hexstring = function str2hexstring(str) {
  return ab2hexstring(str2ab(str));
};

/**
 * @param {string} hexstring - HEX string
 * @returns {string} ASCII string
 */
var hexstring2str = exports.hexstring2str = function hexstring2str(hexstring) {
  return ab2str(hexstring2ab(hexstring));
};

/**
 * convert an integer to big endian hex and add leading zeros
 * @param {number} num
 * @returns {string}
 */
var int2hex = exports.int2hex = function int2hex(num) {
  if (typeof num !== 'number') {
    throw new Error('int2hex expects a number');
  }
  var h = num.toString(16);
  return h.length % 2 ? '0' + h : h;
};

/**
 * Converts a number to a big endian hexstring of a suitable size, optionally little endian
 * @param {number} num
 * @param {number} size - The required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1.
 * @param {boolean} littleEndian - Encode the hex in little endian form
 * @return {string}
 */
var num2hexstring = exports.num2hexstring = function num2hexstring(num) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var littleEndian = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (typeof num !== 'number') throw new Error('num must be numeric');
  if (num < 0) throw new RangeError('num is unsigned (>= 0)');
  if (size % 1 !== 0) throw new Error('size must be a whole integer');
  if (!Number.isSafeInteger(num)) throw new RangeError('num (' + num + ') must be a safe integer');
  size = size * 2;
  var hexstring = num.toString(16);
  hexstring = hexstring.length % size === 0 ? hexstring : ('0'.repeat(size) + hexstring).substring(hexstring.length);
  if (littleEndian) hexstring = reverseHex(hexstring);
  return hexstring;
};

/**
 * Converts a number to a variable length Int. Used for array length header
 * @param {number} num - The number
 * @returns {string} hexstring of the variable Int.
 */
var num2VarInt = exports.num2VarInt = function num2VarInt(num) {
  if (num < 0xfd) {
    return num2hexstring(num);
  } else if (num <= 0xffff) {
    // uint16
    return 'fd' + num2hexstring(num, 2, true);
  } else if (num <= 0xffffffff) {
    // uint32
    return 'fe' + num2hexstring(num, 4, true);
  } else {
    // uint64
    return 'ff' + num2hexstring(num, 8, true);
  }
};

/**
 * XORs two hexstrings
 * @param {string} str1 - HEX string
 * @param {string} str2 - HEX string
 * @returns {string} XOR output as a HEX string
 */
var hexXor = exports.hexXor = function hexXor(str1, str2) {
  ensureHex(str1);
  ensureHex(str2);
  if (str1.length !== str2.length) throw new Error('strings are disparate lengths');
  var result = [];
  for (var i = 0; i < str1.length; i += 2) {
    result.push(parseInt(str1.substr(i, 2), 16) ^ parseInt(str2.substr(i, 2), 16));
  }
  return ab2hexstring(result);
};

/**
 * Reverses an array. Accepts arrayBuffer.
 * @param {Array} arr
 * @returns {Uint8Array}
 */
var reverseArray = exports.reverseArray = function reverseArray(arr) {
  if ((typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) !== 'object' || !arr.length) throw new Error('reverseArray expects an array');
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
var reverseHex = exports.reverseHex = function reverseHex(hex) {
  ensureHex(hex);
  var out = '';
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
var isHex = exports.isHex = function isHex(str) {
  try {
    return hexRegex.test(str);
  } catch (err) {
    return false;
  }
};

/**
 * Throws an error if input is not hexstring.
 * @param {string} str
 */
var ensureHex = exports.ensureHex = function ensureHex(str) {
  if (!isHex(str)) throw new Error('Expected a hexstring but got ' + str);
};

/**
 * Performs a SHA256 followed by a RIPEMD160.
 * @param {string} hex - String to hash
 * @returns {string} hash output
 */
var sha256ripemd160 = exports.sha256ripemd160 = function sha256ripemd160(hex) {
  if (typeof hex !== 'string') throw new Error('reverseHex expects a string');
  if (hex.length % 2 !== 0) throw new Error('Incorrect Length: ' + hex);
  var hexEncoded = _encHex2.default.parse(hex);
  var ProgramSha256 = (0, _sha2.default)(hexEncoded);
  return (0, _ripemd2.default)(ProgramSha256).toString();
};

/**
 * Performs a single SHA256.
 * @param {string} hex - String to hash
 * @returns {string} hash output
 */
var sha256 = exports.sha256 = function sha256(hex) {
  if (typeof hex !== 'string') throw new Error('reverseHex expects a string');
  if (hex.length % 2 !== 0) throw new Error('Incorrect Length: ' + hex);
  var hexEncoded = _encHex2.default.parse(hex);
  return (0, _sha2.default)(hexEncoded).toString();
};

//returns the bytes for the passed big integer adjusted as
// necessary to ensure that a big-endian encoded integer can't possibly be
// misinterpreted as a negative number.  This can happen when the most
// significant bit is set, so it is padded by a leading zero byte in this case.
// Also, the returned bytes will have at least a single byte when the passed
// value is 0.  This is required for DER encoding.
var toDER = exports.toDER = function toDER(x) {
  var ZERO = Buffer.alloc(1, 0);
  var i = 0;
  while (x[i] === 0) {
    ++i;
  }if (i === x.length) return ZERO;
  x = x.slice(i);
  if (x[0] & 0x80) return Buffer.concat([ZERO, x], 1 + x.length);
  return x;
};