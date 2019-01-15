"use strict"
const BN = require("bn.js")

const VarBN = (signed) => {

  function decode (buffer, start = 0, end = buffer.length) {
    throw Error("not implemented")
  }

  function encode(bn, buffer, offset = 0) {

    if(!BN.isBN(bn)) {
      throw new Error('type should be big number');
    }

    buffer = buffer || Buffer.alloc(bn.byteLength())

    let n = bn.toNumber()
    
    // amino signed varint is multiplied by 2 ¯\_(ツ)_/¯
    if (signed) {
      n *= 2
      bn = new BN(n)
    }
    
    let i = 0
    while (n >= 0x80) {
      buffer[offset + i] = (n & 0xff) | 0x80
      n = bn.shrn(7).toNumber()
      bn = new BN(n)
      i++
    }

    buffer[offset + i] = n & 0xff
    encode.bytes = i + 1
    return buffer
  }

  return { encode, decode }
}

module.exports = VarBN(true)
module.exports.VarBN = module.exports