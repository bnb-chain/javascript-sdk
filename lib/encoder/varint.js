'use strict';

var BN = require('bn.js');

var safeParseInt = function safeParseInt(nStr) {
  var n = parseInt(nStr);

  if (!Number.isInteger(n)) {
    throw Error("Value ".concat(JSON.stringify(nStr), " is not an integer"));
  }

  if (Math.abs(n) >= Number.MAX_SAFE_INTEGER) {
    throw Error("Absolute value must be < 2^53");
  }

  if (String(n) !== String(nStr)) {
    throw Error("Value ".concat(JSON.stringify(nStr), " is not a canonical integer string representation"));
  }

  return n;
};

var VarInt = function VarInt(signed) {
  function decode(buffer) {
    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : buffer.length;
    throw Error('not implemented');
  }

  function encode(n) {
    var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Buffer.alloc(encodingLength(n));
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    n = safeParseInt(n); // amino signed varint is multiplied by 2 ¯\_(ツ)_/¯

    if (signed) n *= 2;
    var i = 0;
    var bn = new BN(n);

    while (n >= 0x80) {
      buffer[offset + i] = n & 0xff | 0x80;
      n = bn.shrn(7).toNumber();
      bn = new BN(n);
      i++;
    }

    buffer[offset + i] = n & 0xff;
    encode.bytes = i + 1;
    return buffer;
  }

  function encodingLength(n) {
    if (signed) n *= 2;

    if (n < 0 || n > Number.MAX_SAFE_INTEGER) {
      throw Error('varint value is out of bounds');
    }

    var bits = Math.log2(n + 1);
    return Math.ceil(bits / 7) || 1;
  }

  return {
    encode: encode,
    decode: decode,
    encodingLength: encodingLength
  };
};

module.exports = VarInt(true);
module.exports.UVarInt = VarInt(false);
module.exports.VarInt = module.exports;