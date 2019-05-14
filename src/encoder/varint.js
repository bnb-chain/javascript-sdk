"use strict"
const BN = require("bn.js")

const VarInt = (signed)=> {
  function decode (bytes) {
    let x = 0
    let s = 0
    for(let i=0,len=bytes.length;i<len;i++) {
      const b = bytes[i]
      if(b<0x80) {
        if(i > 9 || i===9 && b>1) {
          return 0
        }
        return x|b<<s
      }
      x |=(b&0x7f) << s
      s += 7
    }

    return 0
  }

  function encode (n, buffer = Buffer.alloc(encodingLength(n)), offset = 0) {
    if(n < 0) {
      throw Error("varint value is out of bounds")
    }

    // n = safeParseInt(n)
    n = n.toString()
    let bn = new BN(n, 10)

    // amino signed varint is multiplied by 2
    if (signed){
      bn = bn.muln(2)
    }

    let i = 0
    while (bn.gten(0x80)) {
      buffer[offset + i] = bn.andln(0xff) | 0x80
      bn = bn.shrn(7)
      i++
    }

    buffer[offset + i] = bn.andln(0xff)
    encode.bytes = i + 1
    return buffer
  }

  function encodingLength (n) {
    if (signed) n *= 2
    if(n < 0){
      throw Error("varint value is out of bounds")
    }
    let bits = Math.log2(n + 1)
    return Math.ceil(bits / 7) || 1
  }

  return { encode, decode, encodingLength }
}

module.exports = VarInt(true)
module.exports.UVarInt = VarInt(false)
module.exports.VarInt = module.exports
