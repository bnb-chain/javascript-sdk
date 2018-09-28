import vstruct from 'varstruct';
import VarInt, { UVarInt } from './varint';
const VarString = vstruct.VarString(UVarInt);

const message = vstruct([
  { name: 'Id', type: VarInt },
  { name: 'Sender', type: VarInt },
  { name: 'Symbol', type: VarInt },
]);
// const message = vstruct([
//   { name: 'Ordertype', type: VarInt },
//   { name: 'Id', type: VarString },
//   { name: 'Price', type: VarInt },
//   { name: 'Quantity', type: VarInt },
//   { name: 'Sender', type: VarString },
//   { name: 'Side', type: VarInt },
//   { name: 'Symbol', type: VarString },
//   { name: 'Timeinforce', type: VarInt },
// ]);

// const placeOrderAminoPrefix = Buffer.from('CE6DC043', 'hex');

export default {
  encode: (data) => {
    data = data || {};
    const placeOrderMsg = message.encode(data);
    // return Buffer.concat([placeOrderAminoPrefix, placeOrderMsg]);
    return placeOrderMsg;
  },
  decode: () => {
    throw Error('not implemented')
  },
  encodingLength: () => {
  }
}