import hexEncoding from "crypto-js/enc-hex"
import RIPEMD160 from "crypto-js/ripemd160"
import SHA256 from "crypto-js/sha256"
import SHA3 from "crypto-js/sha3"

import * as crypto from "../crypto"

/**
 * @param {arrayBuffer} buf
 * @returns {string} ASCII string
 */
export const ab2str = (buf: Uint8Array) => {
  const numArr: number[] = []
  for (let i = 0, len = buf.length; i < len; i++) {
    numArr.push(buf[i])
  }
  String.fromCharCode.apply(null, numArr)
}

/**
 * @param {string} str - ASCII string
 * @returns {arrayBuffer}
 */
export const str2ab = (str: string) => {
  if (typeof str !== "string") {
    throw new Error("str2ab expects a string")
  }
  const result = new Uint8Array(str.length)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    result[i] = str.charCodeAt(i)
  }
  return result
}

/**
 * @param {string} str - HEX string
 * @returns {number[]}
 */
export const hexstring2ab = (str: string) => {
  ensureHex(str)
  if (!str.length) return new Uint8Array()
  const iters = str.length / 2
  const result = new Uint8Array(iters)
  for (let i = 0; i < iters; i++) {
    result[i] = parseInt(str.substring(0, 2), 16)
    str = str.substring(2)
  }
  return result
}

/**
 * @param {arrayBuffer} arr
 * @returns {string} HEX string
 */
export const ab2hexstring = (arr: any) => {
  if (typeof arr !== "object") {
    throw new Error("ab2hexstring expects an array")
  }
  let result = ""
  for (let i = 0; i < arr.length; i++) {
    let str = arr[i].toString(16)
    str = str.length === 0 ? "00" : str.length === 1 ? "0" + str : str
    result += str
  }
  return result
}

/**
 * @param {string} str - ASCII string
 * @returns {string} HEX string
 */
export const str2hexstring = (str: string) => ab2hexstring(str2ab(str))

/**
 * @param {string} hexstring - HEX string
 * @returns {string} ASCII string
 */
export const hexstring2str = (hexstring: string) =>
  ab2str(hexstring2ab(hexstring))

/**
 * convert an integer to big endian hex and add leading zeros
 * @param {Number} num
 * @returns {string}
 */
export const int2hex = (num: number) => {
  if (typeof num !== "number") {
    throw new Error("int2hex expects a number")
  }
  const h = num.toString(16)
  return h.length % 2 ? "0" + h : h
}

/**
 * Converts a number to a big endian hexstring of a suitable size, optionally little endian
 * @param {Number} num
 * @param {Number} size - The required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1.
 * @param {Boolean} littleEndian - Encode the hex in little endian form
 * @return {string}
 */
export const num2hexstring = (num: number, size = 1, littleEndian = false) => {
  if (typeof num !== "number") throw new Error("num must be numeric")
  if (num < 0) throw new RangeError("num is unsigned (>= 0)")
  if (size % 1 !== 0) throw new Error("size must be a whole integer")
  if (!Number.isSafeInteger(num))
    throw new RangeError(`num (${num}) must be a safe integer`)
  size = size * 2
  let hexstring = num.toString(16)
  hexstring =
    hexstring.length % size === 0
      ? hexstring
      : ("0".repeat(size) + hexstring).substring(hexstring.length)
  if (littleEndian) hexstring = reverseHex(hexstring)
  return hexstring
}

/**
 * Converts a number to a variable length Int. Used for array length header
 * @param {Number} num - The number
 * @returns {string} hexstring of the variable Int.
 */
export const num2VarInt = (num: number) => {
  if (num < 0xfd) {
    return num2hexstring(num)
  } else if (num <= 0xffff) {
    // uint16
    return "fd" + num2hexstring(num, 2, true)
  } else if (num <= 0xffffffff) {
    // uint32
    return "fe" + num2hexstring(num, 4, true)
  } else {
    // uint64
    return "ff" + num2hexstring(num, 8, true)
  }
}

/**
 * XORs two hexstrings
 * @param {string} str1 - HEX string
 * @param {string} str2 - HEX string
 * @returns {string} XOR output as a HEX string
 */
export const hexXor = (str1: string, str2: string) => {
  ensureHex(str1)
  ensureHex(str2)
  if (str1.length !== str2.length)
    throw new Error("strings are disparate lengths")
  const result: any[] = []
  for (let i = 0; i < str1.length; i += 2) {
    result.push(
      parseInt(str1.substr(i, 2), 16) ^ parseInt(str2.substr(i, 2), 16)
    )
  }
  return ab2hexstring(result)
}

/**
 * Reverses an array. Accepts arrayBuffer.
 * @param {Array} arr
 * @returns {Uint8Array}
 */
export const reverseArray = (arr: any[]) => {
  if (typeof arr !== "object" || !arr.length)
    throw new Error("reverseArray expects an array")
  const result = new Uint8Array(arr.length)
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[arr.length - 1 - i]
  }

  return result
}

/**
 * Reverses a HEX string, treating 2 chars as a byte.
 * @example
 * reverseHex('abcdef') = 'efcdab'
 * @param {string} hex - HEX string
 * @return {string} HEX string reversed in 2s.
 */
export const reverseHex = (hex: string) => {
  ensureHex(hex)
  let out = ""
  for (let i = hex.length - 2; i >= 0; i -= 2) {
    out += hex.substr(i, 2)
  }
  return out
}

const hexRegex = /^([0-9A-Fa-f]{2})*$/

/**
 * Checks if input is a hexstring. Empty string is considered a hexstring.
 * @example
 * isHex('0101') = true
 * isHex('') = true
 * isHex('0x01') = false
 * @param {string} str
 * @return {boolean}
 */
export const isHex = (str: string) => {
  try {
    return hexRegex.test(str)
  } catch (err) {
    return false
  }
}

/**
 * Throws an error if input is not hexstring.
 * @param {string} str
 */
export const ensureHex = (str: string) => {
  if (!isHex(str)) throw new Error(`Expected a hexstring but got ${str}`)
}

/**
 * Computes a SHA256 followed by a RIPEMD160.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */
export const sha256ripemd160 = (hex: string) => {
  if (typeof hex !== "string")
    throw new Error("sha256ripemd160 expects a string")
  if (hex.length % 2 !== 0) throw new Error(`invalid hex string length: ${hex}`)
  const hexEncoded = hexEncoding.parse(hex)
  const ProgramSha256: any = SHA256(hexEncoded)
  return RIPEMD160(ProgramSha256).toString()
}

/**
 * Computes a single SHA256 digest.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */
export const sha256 = (hex: string) => {
  if (typeof hex !== "string") throw new Error("sha256 expects a hex string")
  if (hex.length % 2 !== 0) throw new Error(`invalid hex string length: ${hex}`)
  const hexEncoded = hexEncoding.parse(hex)
  return SHA256(hexEncoded).toString()
}

/**
 * Computes a single SHA3 (Keccak) digest.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */
export const sha3 = (hex: string) => {
  if (typeof hex !== "string") throw new Error("sha3 expects a hex string")
  if (hex.length % 2 !== 0) throw new Error(`invalid hex string length: ${hex}`)
  const hexEncoded = hexEncoding.parse(hex)
  return SHA3(hexEncoded).toString()
}

/**
 * Computes sha256 of random number and timestamp
 * @param {String} randomNumber
 * @param {Number} timestamp
 * @returns {string} sha256 result
 */
export const calculateRandomNumberHash = (
  randomNumber: string,
  timestamp: number
) => {
  const timestampHexStr = timestamp.toString(16)
  let timestampHexStrFormat = timestampHexStr
  for (let i = 0; i < 16 - timestampHexStr.length; i++) {
    timestampHexStrFormat = "0" + timestampHexStrFormat
  }
  const timestampBytes = Buffer.from(timestampHexStrFormat, "hex")
  const newBuffer = Buffer.concat([
    Buffer.from(randomNumber, "hex"),
    timestampBytes,
  ])
  return sha256(newBuffer.toString("hex"))
}

/**
 * Computes swapID
 * @param {String} randomNumberHash
 * @param {String} sender
 * @param {String} senderOtherChain
 * @returns {string} sha256 result
 */
export const calculateSwapID = (
  randomNumberHash: string,
  sender: string,
  senderOtherChain: string
) => {
  const randomNumberHashBytes = Buffer.from(randomNumberHash, "hex")
  const senderBytes = crypto.decodeAddress(sender)
  const sendOtherChainBytes = Buffer.from(
    senderOtherChain.toLowerCase(),
    "utf8"
  )
  const newBuffer = Buffer.concat([
    randomNumberHashBytes,
    senderBytes,
    sendOtherChainBytes,
  ])
  return sha256(newBuffer.toString("hex"))
}
