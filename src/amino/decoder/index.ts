/**
 * @module amino.decode
 */

import {
  string as varString,
  bool as varBool,
  bytes as varBytes,
  varint
} from "protocol-buffers-encodings"
import is from "is_js"

import typeToTyp3 from "../../utils/encoderHelper"

const decoder = (bytes: Buffer, varType: any) => {
  const val = varType.decode(bytes, 0)
  const offset = varType.encodingLength(val)
  return { val, offset }
}

/**
 * js amino UnmarshalBinaryLengthPrefixed
 * @param {Buffer} bytes
 * @param {Object} type
 * @returns {Object}
 *  */
export const unMarshalBinaryLengthPrefixed = (
  bytes: Buffer,
  type: any
): object => {
  if (bytes.length === 0) throw new TypeError("Cannot decode empty bytes")

  // read byte-length prefix
  const { offset: len } = decoder(bytes, varint)

  if (len < 0)
    throw new Error(`Error reading msg byte-length prefix: got code ${len}`)

  bytes = bytes.slice(len)

  return unMarshalBinaryBare(bytes, type)
}

/**
 * js amino UnmarshalBinaryBare
 * @param {Buffer} bytes
 * @param {Object} type
 * @returns {Object}
 *  */
export const unMarshalBinaryBare = (bytes: Buffer, type: any): object => {
  if (!is.object(type)) throw new TypeError("type should be object")

  if (!Buffer.isBuffer(bytes)) throw new TypeError("bytes must be buffer")

  if (is.array(type)) {
    if (!is.object(type[0])) throw new TypeError("type should be object")

    return decodeArrayBinary(bytes, type[0])
  }

  return decodeBinary(bytes, type)
}

const decodeBinary = (
  bytes: Buffer,
  type: any,
  isLengthPrefixed?: boolean
): any => {
  if (Buffer.isBuffer(type)) {
    return decoder(bytes, varBytes)
  }

  if (is.array(type)) {
    return decodeArrayBinary(bytes, type)
  }

  if (is.number(type)) {
    return decoder(bytes, varint)
  }

  if (is.boolean(type)) {
    return decoder(bytes, varBool)
  }

  if (is.string(type)) {
    return decoder(bytes, varString)
  }

  if (is.object(type)) {
    return decodeObjectBinary(bytes, type, isLengthPrefixed)
  }

  return
}

const setDefaultValue = (type: any, key: string) => {
  if (is.object(type[key])) type[key] = null

  if (is.number(type[key])) type[key] = 0

  if (is.boolean(type[key])) type[key] = false

  if (is.string(type[key])) type[key] = ""
}

const decodeObjectBinary = (
  bytes: Buffer,
  type: any,
  isLengthPrefixed?: boolean
) => {
  let objectOffset = 0

  // read byte-length prefix
  if (isLengthPrefixed) {
    const { offset: len } = decoder(bytes, varint)
    bytes = bytes.slice(len)
    objectOffset += len
  }

  // If registered concrete, consume and verify prefix bytes.
  if (type.aminoPrefix) {
    bytes = bytes.slice(4)
    objectOffset += 4
  }

  let lastFieldNum = 0

  let keys = Object.keys(type).filter(key => key !== "aminoPrefix")

  keys.forEach((key, index) => {
    if (is.array(type[key])) {
      const { offset, val } = decodeArrayBinary(bytes, type[key][0])
      objectOffset += offset
      type[key] = val
      bytes = bytes.slice(offset)
    } else {
      const { fieldNum, typ } = decodeFieldNumberAndTyp3(bytes)

      //if this field is default value, continue
      if (index + 1 !== fieldNum || fieldNum < 0) {
        setDefaultValue(type, key)
        return
      }

      if (fieldNum <= lastFieldNum) {
        throw new Error(
          `encountered fieldNum: ${fieldNum}, but we have already seen fnum: ${lastFieldNum}`
        )
      }

      lastFieldNum = fieldNum

      if (index + 1 !== fieldNum) {
        throw new Error("field number is not expected")
      }

      const typeWanted = typeToTyp3(type[key])

      if (typ !== typeWanted) {
        throw new Error("field type is not expected")
      }

      //remove 1 byte of type
      bytes = bytes.slice(1)

      const { val, offset } = decodeBinary(bytes, type[key], true)
      type[key] = val

      //remove decoded bytes
      bytes = bytes.slice(offset)
      objectOffset += offset + 1
    }
  })

  return { val: type, offset: objectOffset }
}

const decodeArrayBinary = (bytes: Buffer, type: any) => {
  const arr = []
  let arrayOffset = 0
  let { fieldNum: fieldNumber } = decodeFieldNumberAndTyp3(bytes)

  while (true) {
    const { fieldNum } = decodeFieldNumberAndTyp3(bytes)

    if (fieldNum !== fieldNumber || fieldNum < 0) break

    //remove 1 byte of encoded field number and type
    bytes = bytes.slice(1)

    //is default value, skip and continue read bytes
    // if (bytes.length > 0 && bytes[0] === 0x00) continue
    if (bytes.length > 0 && bytes.readUInt8(0) === 0x00) continue

    const { offset, val } = decodeBinary(bytes, type, true)

    arr.push({ ...val })
    bytes = bytes.slice(offset)

    //add 1 byte of type
    arrayOffset += offset + 1
    fieldNumber = fieldNum
  }

  // console.log(arr)
  return { val: arr, offset: arrayOffset }
}

export const decodeFieldNumberAndTyp3 = (bytes: Buffer): any => {
  if (bytes.length < 2) {
    //default value
    return { fieldNum: -1 }
  }

  const { val } = decoder(bytes, varint)

  const typ = val & 7
  let fieldNum = val >> 3
  if (fieldNum > 1 << (29 - 1)) {
    throw new Error(`invalid field num ${fieldNum}`)
  }

  return { fieldNum, typ }
}
