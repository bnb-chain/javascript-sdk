/**
 * @module amino.encode
 */

import { string as VarString } from "protocol-buffers-encodings"
import is from "is_js"
import { UVarInt } from "./varint"
import typeToTyp3 from "../../utils/encoderHelper"

const sortObject = (obj: any): object | null => {
  if (obj === null) return null
  if (typeof obj !== "object") return obj
  // arrays have typeof "object" in js!
  if (Array.isArray(obj)) return obj.map(sortObject)
  const sortedKeys = Object.keys(obj).sort()
  const result: any = {}
  sortedKeys.forEach((key) => {
    result[key] = sortObject(obj[key])
  })
  return result
}

/**
 * encode number
 * @param num
 */
export const encodeNumber = (num: number) => UVarInt.encode(num)

/**
 * encode bool
 * @param b
 */
export const encodeBool = (b: boolean) =>
  b ? UVarInt.encode(1) : UVarInt.encode(0)

/**
 * encode string
 * @param str
 */
export const encodeString = (str: string) => {
  var buf = Buffer.alloc(VarString.encodingLength(str))
  return VarString.encode(str, buf, 0)
}

/**
 * encode time
 * @param value
 */
export const encodeTime = (value: string | Date) => {
  const millis = new Date(value).getTime()
  const seconds = Math.floor(millis / 1000)
  const nanos = Number(seconds.toString().padEnd(9, "0"))

  const buffer = Buffer.alloc(14)

  // buffer[0] = (1 << 3) | 1 // field 1, typ3 1
  buffer.writeInt32LE((1 << 3) | 1, 0)
  buffer.writeUInt32LE(seconds, 1)

  // buffer[9] = (2 << 3) | 5 // field 2, typ3 5
  buffer.writeInt32LE((2 << 3) | 5, 9)
  buffer.writeUInt32LE(nanos, 10)

  return buffer
}

/**
 * @param obj -- {object}
 * @return bytes {Buffer}
 */
export const convertObjectToSignBytes = (obj: any) =>
  Buffer.from(JSON.stringify(sortObject(obj)))

/**
 * js amino MarshalBinary
 * @param {Object} obj
 *  */
export const marshalBinary = (obj: any) => {
  if (!is.object(obj)) throw new TypeError("data must be an object")

  return encodeBinary(obj, -1, true).toString("hex")
}

/**
 * js amino MarshalBinaryBare
 * @param {Object} obj
 *  */
export const marshalBinaryBare = (obj: any) => {
  if (!is.object(obj)) throw new TypeError("data must be an object")

  return encodeBinary(obj).toString("hex")
}

/**
 * This is the main entrypoint for encoding all types in binary form.
 * @param {*} js data type (not null, not undefined)
 * @param {Number} field index of object
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} binary of object.
 */
export const encodeBinary = (
  val: any,
  fieldNum?: number,
  isByteLenPrefix?: boolean
) => {
  if (val === null || val === undefined) throw new TypeError("unsupported type")

  if (Buffer.isBuffer(val)) {
    if (isByteLenPrefix) {
      return Buffer.concat([UVarInt.encode(val.length), val])
    }
    return val
  }

  if (is.array(val)) {
    return encodeArrayBinary(fieldNum, val, isByteLenPrefix)
  }

  if (is.number(val)) {
    return encodeNumber(val)
  }

  if (is.boolean(val)) {
    return encodeBool(val)
  }

  if (is.string(val)) {
    return encodeString(val)
  }

  if (is.object(val)) {
    return encodeObjectBinary(val, isByteLenPrefix)
  }

  return
}

/**
 * prefixed with bytes length
 * @param {Buffer} bytes
 * @return {Buffer} with bytes length prefixed
 */
export const encodeBinaryByteArray = (bytes: Buffer) => {
  const lenPrefix = bytes.length
  return Buffer.concat([UVarInt.encode(lenPrefix), bytes])
}

/**
 *
 * @param {Object} obj
 * @return {Buffer} with bytes length prefixed
 */
export const encodeObjectBinary = (obj: any, isByteLenPrefix?: boolean) => {
  const bufferArr: any[] = []

  Object.keys(obj).forEach((key, index) => {
    if (key === "aminoPrefix" || key === "version") return

    if (isDefaultValue(obj[key])) return

    if (is.array(obj[key]) && obj[key].length > 0) {
      bufferArr.push(encodeArrayBinary(index, obj[key]))
    } else {
      bufferArr.push(encodeTypeAndField(index, obj[key]))
      bufferArr.push(encodeBinary(obj[key], index, true))
    }
  })

  let bytes = Buffer.concat(bufferArr)

  // add prefix
  if (obj.aminoPrefix) {
    const prefix = Buffer.from(obj.aminoPrefix, "hex")
    bytes = Buffer.concat([prefix, bytes])
  }

  // Write byte-length prefixed.
  if (isByteLenPrefix) {
    const lenBytes = UVarInt.encode(bytes.length)
    bytes = Buffer.concat([lenBytes, bytes])
  }

  return bytes
}

/**
 * @param {Number} fieldNum object field index
 * @param {Array} arr
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} bytes of array
 */
export const encodeArrayBinary = (
  fieldNum: number | undefined,
  arr: any[],
  isByteLenPrefix?: boolean
) => {
  const result: any[] = []

  arr.forEach((item) => {
    result.push(encodeTypeAndField(fieldNum, item))

    if (isDefaultValue(item)) {
      result.push(Buffer.from("00", "hex"))
      return
    }

    result.push(encodeBinary(item, fieldNum, true))
  })

  //encode length
  if (isByteLenPrefix) {
    const length = result.reduce((prev, item) => prev + item.length, 0)
    result.unshift(UVarInt.encode(length))
  }

  return Buffer.concat(result)
}

// Write field key.
const encodeTypeAndField = (index: number | undefined, field: any) => {
  index = Number(index)
  const value = ((index + 1) << 3) | typeToTyp3(field)
  return UVarInt.encode(value)
}

const isDefaultValue = (obj: any) => {
  if (obj === null) return false

  return (
    (is.number(obj) && obj === 0) ||
    (is.string(obj) && obj === "") ||
    (is.array(obj) && obj.length === 0) ||
    (is.boolean(obj) && !obj)
  )
}

export * from "./varint"
