"use strict"
const BN = require("bn.js")
import { Buffer } from "safe-buffer"

function VarIntFunc(signed: boolean) {
  const encodingLength = (n: number) => {
    if (signed) n *= 2
    if (n < 0) {
      throw Error("varint value is out of bounds")
    }
    let bits = Math.log2(n + 1)
    return Math.ceil(bits / 7) || 1
  }

  const encode = (n: number, buffer?: Buffer | any, offset?: number) => {
    if (n < 0) {
      throw Error("varint value is out of bounds")
    }

    buffer = buffer || Buffer.alloc(encodingLength(n))
    offset = offset || 0
    const nStr = n.toString()
    let bn = new BN(nStr, 10)

    // amino signed varint is multiplied by 2
    if (signed) {
      bn = bn.muln(2)
    }

    let i = 0
    while (bn.gten(0x80)) {
      buffer[offset + i] = bn.andln(0xff) | 0x80
      bn = bn.shrn(7)
      i++
    }

    buffer[offset + i] = bn.andln(0xff)

    // TODO
    // encode.bytes = i + 1

    return buffer
  }

  /**
   * https://github.com/golang/go/blob/master/src/encoding/binary/varint.go#L60
   */
  const decode = (bytes: Buffer | any) => {
    let x = 0
    let s = 0
    for (let i = 0, len = bytes.length; i < len; i++) {
      const b = bytes[i]
      if (b < 0x80) {
        if (i > 9 || (i === 9 && b > 1)) {
          return 0
        }
        return x | (b << s)
      }
      x |= (b & 0x7f) << s
      s += 7
    }

    return 0
  }

  return { encode, decode, encodingLength }
}

export const UVarInt = VarIntFunc(false)
export const VarInt = VarIntFunc(true)
