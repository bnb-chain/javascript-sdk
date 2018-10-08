import vstruct, { Array } from 'varstruct';
import _ from 'lodash';
import VarInt, { UVarInt } from './varint';
import typeToTyp3 from '../utils/aminoHelper';

const VarString = vstruct.VarString(UVarInt);
// const placeOrderPrefix = Buffer.from('CE6DC043', 'hex');

// const PlaceOrder = {
//   encode(orderMsg, buffer, offset = 0){
//     orderMsg = encodeStruct(orderMsg);
//     buffer = buffer || Buffer.alloc(orderMsg.length);
//     placeOrderPrefix.copy(buffer, offset);
//     Buffer.from(orderMsg).copy(buffer, offset + placeOrderPrefix.length);
//     return buffer;
//   },
//   decode(){
//     throw Error('Decode not implemented');
//   }
// }

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
  if(b) {
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
 * encode object to binary
 * @param data --- object
 */
export const encodeStruct = (data) => {
  if(!_.isObject(data)) throw new TypeError('data must be an object');

  const { struct, newData } = generateStruct(data);
  const bytes = vstruct(struct).encode(newData);
  return bytes.toString('hex');
}

const generateStruct = (data) => {
  if(!_.isObject(data)) return {};
  const struct = [];
  const newData = {};

  Object.keys(data).map((key, index)=>{
    if(_.isNumber(data[key])){
      struct.push({name: `type${key}`, type: UVarInt});
      struct.push({name: key, type: VarInt});
    }

    if(_.isString(data[key])){
      struct.push({name: `type${key}`, type: UVarInt});
      struct.push({name: key, type: VarString });
    }

    if(_.isPlainObject(data[key])){
      const { struct, newData } = generateStruct(data[key]);
      data[key] = newData;
      struct.push({ name: `type${key}`, type: UVarInt });
      struct.push({ name: key, type: vstruct(struct)});
    }

    if(_.isArray(data[key])){
      struct.push({name: `type${key}`, type: UVarInt});
      let itemType = getEncodeType(data[key]);
      data[key] = generateArrayValue(data[key]);
      struct.push({name: key, type: Array(data[key].length, itemType)});
    }

    newData[`type${key}`] = (index + 1) << 3 | typeToTyp3(data[key]);
    newData[key] = data[key];
  });

  return { struct, newData }
}

const generateArrayValue = (arr)=>{
  if(!_.isArray(arr)) throw new TypeError('data should array instance');
  if(arr.length === 0) throw new Error('array should not be null');
  if(_.isArray(arr[0])) throw new Error('not support two dimensional arrays');

  const result = [];
  arr.forEach((item)=>{
    if(_.isObject(item)){
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
export const getEncodeType = (data)=>{
  if(data === undefined || data === null) 
    throw new TypeError('data should not be null or undefined');

  let encodeType;

  if(_.isNumber(data)){
    encodeType = VarInt;
  }

  if(_.isString(data)){
    encodeType = VarString;
  }

  if(_.isPlainObject(data)){
    const { struct } = generateStruct(data);
    encodeType = vstruct(struct);
  }

  if(_.isArray(data)){
    if(data.length === 0) throw new Error('array should not be null');
    if(_.isArray(data[0])) throw new Error('not support two dimensional arrays');
    encodeType = getEncodeType(data[0]);
  }

  return encodeType;
}