import vstruct from 'varstruct';
import Varint, { UVarInt } from './varint';
import placeOrderMsg from './placeOrderMsg';

const VarString = vstruct.VarString(UVarInt);

/**
 * encode number
 * @param num
 */
export const encodeNumber = (num) => {
  return Varint.encode(num);
}

/**
 * encode bool
 * @param b
 */
export const encodeBool = (b) => {
  if(b) {
    return Varint.encode(1);
  } else {
    return Varint.encode(0);
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
 * encode plceOrderMsg
 * @param data.account_number
 * @param data.memo
 * @param data.msgs
 * @param data.sequence
 */
export const encodePlaceOrderMsg = (data) => {
  const tx = vstruct([
    { name: 'account_number', type: UVarInt },
    { name: 'memo', type: VarString },
    { name: 'msgs', type: vstruct.VarArray(vstruct.Byte, placeOrderMsg) },
    { name: 'sequence', type: UVarInt  }
  ]);
  return tx.encode(data);
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


