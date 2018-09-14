import vstruct from 'varstruct';
import varint, { UVarInt } from '../utils/varint';

const VarString = vstruct.VarString(UVarInt);

/**
 * encode number
 * @param num
 */
export const encodeNumber = (num) => {
  return varint.encode(num);
}

/**
 * encode bool
 * @param b
 */
export const encodeBool = (b) => {
  if(b){
    return varint.encode(1);
  } else {
    return varint.encode(0);
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