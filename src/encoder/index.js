import vstruct from 'varstruct';
import _ from 'lodash';
import VarInt, { UVarInt } from './varint';
import typeToTyp3 from '../utils/encoderHelper';
import { Buffer } from 'safe-buffer';
import { typePrefix } from '../tx/';

const VarString = vstruct.VarString(UVarInt);

/**
 * encode number
 * @param num
 */
export const encodeNumber = (num) => {
  return VarInt.encode(num);
}

/**
 * encode bool
 * @param b
 */
export const encodeBool = (b) => {
  if (b) {
    return VarInt.encode(1);
  } else {
    return VarInt.encode(0);
  }
}

/**
 * encode string
 * @param str
 */
export const encodeString = (str) => {
  return VarString.encode(str);
}

/**
 * encode time
 * @param value
 */
export const encodeTime = (value) => {

  const millis = new Date(value).getTime()
  const seconds = Math.floor(millis / 1000)
  const nanos = Number(seconds.toString().padEnd(9, '0'))

  const buffer = Buffer.alloc(14)

  buffer[0] = (1 << 3) | 1 // field 1, typ3 1
  buffer.writeUInt32LE(seconds, 1)

  buffer[9] = (2 << 3) | 5 // field 2, typ3 5
  buffer.writeUInt32LE(nanos, 10)

  return buffer
}

/**
 * @param obj -- {object}
 * @return bytes {Buffer}
 */
export const convertObjectToBytes = (obj) => {
  return Buffer.from(JSON.stringify(obj));
}

/**
 * js amino MarshalBinary 
 * @param {Object} obj 
 *  */
export const marshalBinary = (obj) => {
  if (!_.isObject(obj))
    throw new TypeError('data must be an object');

  let bytes = encodeBinary(obj, null, true);

  return bytes.toString('hex');
}

/**
 * js amino MarshalBinaryBare 
 * @param {Object} obj 
 *  */
export const marshalBinaryBare = (obj) => {
  if (!_.isObject(obj))
    throw new TypeError('data must be an object');
  const bytes = encodeBinary(obj);
  return bytes.toString('hex');
}

/**
 * This is the main entrypoint for encoding all types in binary form.
 * @param {*} js data type (not null, not undefined)
 * @param {number} field index of object
 * @param {bool} isByteLenPrefix
 * @return {Buffer} binary of object.
 */
export const encodeBinary = (val, fieldNum, isByteLenPrefix) => {
  if (val === null || val === undefined)
    throw new TypeError('unsupported type');

  let bytes;

  if(Buffer.isBuffer(val)){
    if(isByteLenPrefix){
      bytes = Buffer.concat([UVarInt.encode(val.length), val]);
    } else {
      bytes = val;
    }   
  }

  else if(_.isPlainObject(val)){
    bytes = encodeObjectBinary(val, isByteLenPrefix);
  }

  else if(_.isArray(val)){
    bytes = encodeArrayBinary(fieldNum, val, isByteLenPrefix);
  }
  

  else if(_.isNumber(val)){
    bytes = encodeNumber(val);
  }

  else if(_.isBoolean(val)){
    bytes = encodeBool(val);
  }

  else if(_.isString(val)){
    bytes = encodeString(val);
  }

  return bytes;
}

/**
 * prefixed with bytes length
 * @param {Buffer} bytes 
 * @return {Buffer} with bytes length prefixed
 */
export const encodeBinaryByteArray = (bytes)=>{
  const lenPrefix = bytes.length;
  return Buffer.concat([UVarInt.encode(lenPrefix), bytes]);
}

/**
 * 
 * @param {Object} obj 
 * @return {Buffer} with bytes length prefixed
 */
export const encodeObjectBinary = (obj, isByteLenPrefix) => {
  const bufferArr = [];

   //add version 0x1
   //remove version field
  //  if(obj.version === 1){
  //   bufferArr.push(encodeTypeAndField(0, 1));
  //   bufferArr.push(UVarInt.encode(1));
  //  }

  Object.keys(obj).forEach((key, index) => {
    if (key === 'msgType' || key === 'version') return;

    if (isDefaultValue(obj[key])) return;

    if (_.isArray(obj[key]) && obj[key].length > 0) {
      bufferArr.push(encodeArrayBinary(index, obj[key]));
    } else {
      bufferArr.push(encodeTypeAndField(index, obj[key]));
      bufferArr.push(encodeBinary(obj[key], index, true));
    }
  });

  let bytes = Buffer.concat(bufferArr);

  // add prefix
  if (typePrefix[obj.msgType]) {
    const prefix = Buffer.from(typePrefix[obj.msgType], 'hex');
    bytes = Buffer.concat([prefix, bytes]);
  }

  //Write byte-length prefixed.
  if(isByteLenPrefix){
    const lenBytes = UVarInt.encode(bytes.length);
    bytes = Buffer.concat([lenBytes, bytes]);
  }

  return bytes;
}

/**
 * @param {number} fieldNum object field index
 * @param {Array} arr
 * @param {bool} isByteLenPrefix
 * @return {Buffer} bytes of array
 */
export const encodeArrayBinary = (fieldNum, arr, isByteLenPrefix) => {
  const result = [];

  arr.forEach((item) => {
    result.push(encodeTypeAndField(fieldNum, item));

    if (isDefaultValue(item)) {
      result.push(Buffer.from('00', 'hex'));
      return;
    }

    result.push(encodeBinary(item, fieldNum, true));
  });

  console.log(result);

  //encode length
  if(isByteLenPrefix){
    const length = result.reduce((prev, item) => {
      return prev + item.length;
    }, 0);
  
    console.log('length: ' + length);
    result.unshift(UVarInt.encode(length));
  }

  return Buffer.concat(result);
}

// Write field key.
const encodeTypeAndField = (index, field) => {
  const value = (index + 1) << 3 | typeToTyp3(field);
  return UVarInt.encode(value);
}

const isDefaultValue = (obj) => {
  if(obj === null) return false;
  
  if (_.isNumber(obj)) {
    return obj === 0;
  }

  if (_.isString(obj)) {
    return obj === '';
  }

  if (_.isArray(obj)) {
    return obj.length === 0;
  }

  return false;
}