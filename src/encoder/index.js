import vstruct, { Array } from 'varstruct';
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
 * encode transaction(not used)
 * @param tx -- Transaction object
 * @return bytes -- hex string
 */
export const encodeTx = (tx) => {
  const {struct, newData} = generateStruct(tx);
  const bytes = vstruct(struct).encode(newData);
  return bytes.toString('hex');
}

/**
 * encode object to binary
 * @param data --- object
 */
export const encodeStruct = (data) => {
  if (!_.isObject(data))
    throw new TypeError('data must be an object');

  const {struct, newData} = generateStruct(data);
  const bytes = vstruct(struct).encode(newData);
  return bytes.toString('hex');
}

/**
 * @param obj -- {object}
 * @return bytes {Buffer}
 */
export const convertObjectToBytes = (obj) => {
  return Buffer.from(JSON.stringify(obj));
}

export const generateStruct = (data) => {
  if (!_.isObject(data)) return {};
  const struct = [];
  const newData = {};

  Object.keys(data).map((key, index) => {
    if (_.isNumber(data[key])) {
      struct.push({
        name: `type${key}`,
        type: UVarInt
      });
      struct.push({
        name: key,
        type: VarInt
      });
    }

    if (_.isString(data[key])) {
      struct.push({
        name: `type${key}`,
        type: UVarInt
      });
      struct.push({
        name: key,
        type: VarString
      });
    }

    if (_.isPlainObject(data[key])) {
      const {struct, newData} = generateStruct(data[key]);
      data[key] = newData;
      struct.push({
        name: `type${key}`,
        type: UVarInt
      });
      struct.push({
        name: key,
        type: vstruct(struct)
      });
    }

    if (_.isArray(data[key])) {
      struct.push({
        name: `type${key}`,
        type: UVarInt
      });
      let itemType = getEncodeType(data[key]);
      data[key] = generateArrayValue(data[key]);
      struct.push({
        name: key,
        type: Array(data[key].length, itemType)
      });
    }

    newData[`type${key}`] = (index + 1) << 3 | typeToTyp3(data[key]);
    newData[key] = data[key];
  });

  return {
    struct,
    newData
  }
}

export const generateArrayValue = (arr) => {
  if (!_.isArray(arr))
    throw new TypeError('data should array instance');
  if (arr.length === 0)
    throw new Error('array should not be null');
  if (_.isArray(arr[0]))
    throw new Error('not support two dimensional arrays');

  const result = [];
  arr.forEach((item) => {
    if (_.isObject(item)) {
      const newItem = {};
      generateStruct(item, [], newItem);
      result.push(newItem);
    } else {
      result.push(item);
    }
  });

  return result;
}

/**
 * get encode type
 */
export const getEncodeType = (data) => {
  if (data === undefined || data === null)
    throw new TypeError('data should not be null or undefined');

  let encodeType;

  if (_.isNumber(data)) {
    encodeType = VarInt;
  }

  if (_.isString(data)) {
    encodeType = VarString;
  }

  if (_.isPlainObject(data)) {
    const {struct} = generateStruct(data);
    encodeType = vstruct(struct);
  }

  if (_.isArray(data)) {
    if (data.length === 0)
      throw new Error('array should not be null');
    if (_.isArray(data[0]))
      throw new Error('not support two dimensional arrays');
    encodeType = getEncodeType(data[0]);
  }

  return encodeType;
}

/**
 * js amino MarshalBinary 
 * @param {Object} obj 
 *  */
export const marshalBinary = (obj) => {
  if (!_.isObject(obj))
    throw new TypeError('data must be an object');

  let bytes = encodeBinary(obj, null, true);
  // const lenBytes = UVarInt.encode(bytes.length);
  // bytes = Buffer.concat([lenBytes, bytes]);

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
 * @param {*} js data type (not null, not undefined)
 * @param {bool} isByteLenPrefix
 */
export const encodeBinary = (info, fieldNum, isByteLenPrefix) => {
  if (info === null || info === undefined)
    throw new TypeError('unsupported type');

  let bytes;

  if(Buffer.isBuffer(info)){
    bytes = info;
  }

  if(_.isPlainObject(info)){
    bytes = encodeObjectBinary(info, isByteLenPrefix);
  }

  if(_.isArray(info)){
    bytes = encodeArrayBinary(fieldNum, info, isByteLenPrefix);
  }
  

  if(_.isNumber(info)){
    bytes = encodeNumber(info);
  }

  if(_.isBoolean(info)){
    bytes = encodeBool(info);
  }

  if(_.isString(info)){
    bytes = encodeString(info);
  }

  return bytes;
}

export const encodeObjectBinary = (obj, isByteLenPrefix) => {
  const bufferArr = [];

  Object.keys(obj).forEach((key, index) => {
    if (key === 'msgType') return;

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

export const encodeArrayBinary = (fieldNum, arr, isByteLenPrefix) => {
  const result = [];

  arr.forEach((item) => {
    result.push(encodeTypeAndField(fieldNum, item));

    if (isDefaultValue(item)) {
      result.push(Buffer.from('00', 'hex'));
      return;
    }

    result.push(encodeBinary(item, fieldNum, true));
    console.log(`result :`);
    console.log(result.length);
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

const encodeTypeAndField = (index, field) => {
  const value = (index + 1) << 3 | typeToTyp3(field);
  return UVarInt.encode(value);
}

const isDefaultValue = (obj) => {
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