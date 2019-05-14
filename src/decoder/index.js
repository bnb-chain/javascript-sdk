/**
 * @module amino-decode
 */

import {
  string as varString, 
  bool as varBool, 
  bytes as varBytes ,
  varint
} from "protocol-buffers-encodings"
import { Buffer } from "safe-buffer"
import is from "is_js"

import typeToTyp3 from "../utils/encoderHelper"

export const decoder = (bytes, varType) => {
  const val = varType.decode(bytes, 0)
  const offset = varType.encodingLength(val)
  return { val, offset }
}

/**
 * js amino UnmarshalBinaryLengthPrefixed
 * @param {Buffer} bytes
 * @param {Object} type
 *  */
export const unMarshalBinaryLengthPrefixed = (bytes, type) => {
  
  if(is.array(type)) {
    if(!is.object(type[0]))
      throw new TypeError("type should be object")

    const { offset } = decoder(bytes, varint)
    bytes = bytes.slice(offset)
    return decodeArrayBinary(bytes, type[0])
  }

  if(!is.object(type)) 
    throw new TypeError("type should be object")

  if (!Buffer.isBuffer(bytes))
    throw new TypeError("bytes must be buffer")
  
  if(bytes.length === 0)
    throw new TypeError("Cannot decode empty bytes")
  
  return decodeBinary(bytes, type)
}

const decodeBinary = (bytes, type) => {
  if(Buffer.isBuffer(type)) {
    // const { offset } = decoder(bytes, varint)
    // console.log(offset)
    // console.log(bytes)
    // bytes = bytes.slice(offset)
    return decoder(bytes, varBytes)
  }

  if(is.array(type)) {
    return decodeArrayBinary(bytes, type)
  }

  if(is.number(type)) {
    return decoder(bytes, varint)
  }

  if(is.boolean(type)) {
    return decoder(bytes, varBool)
  }

  if(is.string(type)) {
    return decoder(bytes, varString)
  }

  if(is.object(type)) {
    return decodeObjectBinary(bytes, type)
  }

  return
}

const decodeObjectBinary = (bytes, type) => {
  let objectOffset = 0

  const { offset } = decoder(bytes, varint)

  if(offset < 0)
    throw new Error(`Error reading msg byte-length prefix: got code ${offset}`)

  bytes = bytes.slice(offset)
  objectOffset += offset
  
  // If registered concrete, consume and verify prefix bytes.
  if(type.msgType) {
    bytes = bytes.slice(4)
    objectOffset += 4
  }

  let lastFieldNum = 0

  const keys = Object.keys(type)
  keys.forEach((key, index) => {
    if (is.array(type[key])) {
      const { offset, val } = decodeArrayBinary(bytes, type[key][0])
      objectOffset += offset
      type[key] = val
      bytes = bytes.slice(offset)
    } else {
      // console.log(bytes)
      const { fieldNum, typ } = decodeFieldNumberAndTyp3(bytes)

      // console.log('current field >>>' + key)
      // console.log('get field number >>>' + fieldNum)
      // console.log('get field val >>>' + typ)
      // console.log('current field number >>>'+ (index+1))
     
       //if this field is default value, continue
      if(index+1 < fieldNum || fieldNum < 0) return

      if(fieldNum <= lastFieldNum) {
        throw new Error(`encountered fieldNum: ${fieldNum}, but we have already seen fnum: ${lastFieldNum}`)
      }

      lastFieldNum = fieldNum

      if(index+1 !== fieldNum) {
        throw new Error("field number is not expected")
      }

      // console.log(type)
      // console.log(type[key])
      const typeWanted = typeToTyp3(type[key])
      if(typ !== typeWanted) {
        throw new Error("field type is not expected")
      }

      //remove 1 byte of type
      bytes = bytes.slice(1)

      const { val, offset } = decodeBinary(bytes, type[key])
      type[key] = val
      console.log(offset)
      console.log(val)

      //remove decoded bytes
      bytes = bytes.slice(offset)
      objectOffset += offset + 1

      // console.log('rest bytes >>>> ')
      // console.log(bytes)
    }
  })

  return { val: type, offset: objectOffset }
}

const decodeArrayBinary = (bytes, type) => {
  const arr = []
  let arrayOffset = 0
  let { fieldNum: fieldNumber } = decodeFieldNumberAndTyp3(bytes)

  console.log(bytes)
  console.log(bytes.toString('hex'))
  while(true) {
    const { fieldNum } = decodeFieldNumberAndTyp3(bytes)
    console.log('fieldNum ' + fieldNum)
    console.log('fieldNumber ' + fieldNumber)
    if(fieldNum !== fieldNumber) break
    
    //remove 1 byte of encoded field number and type
    bytes = bytes.slice(1)
    const { offset, val } = decodeBinary(bytes, type)

    arr.push({...val})
    bytes = bytes.slice(offset)

    //add 1 byte of type
    arrayOffset += offset + 1
    fieldNumber = fieldNum
  }

  return { val: arr, offset: arrayOffset }
}

const decodeFieldNumberAndTyp3 = (bytes) => {
  if(bytes.length < 2){
    //default value
    return { fieldNum: -1 }
  }
  const { val } = decoder(bytes, varint)
  const typ = val & 7
  let fieldNum = val >> 3
  if(fieldNum > (1<<29 -1)) {
    throw new Error(`invalid field num ${fieldNum}`)
  }

  return { fieldNum, typ }
}
