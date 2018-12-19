import * as encoder from '../src/encoder';
import * as crypto from '../src/crypto';
import { UVarInt } from '../src/encoder/varint';
import bn from 'bn.js';

describe('encoder', () => {
  it('encode time', () => {
    let encodedTime = encoder.encodeTime('1973-11-29T21:33:09.123456789Z');
    encodedTime = encodedTime.toString('hex');
    expect(encodedTime).toBe('0915cd5b07000000001515cd5b07');
  });

  it('encode number', () => {
    let encodedNumber = encoder.encodeNumber(100000);
    encodedNumber = encodedNumber.toString('hex');
    console.log(encodedNumber);
    expect(encodedNumber).toBe('c09a0c');
  });

  it('UVarInt', () => {
    let encodedNumber = UVarInt.encode(17);
    encodedNumber = encodedNumber.toString('hex');
    console.log(encodedNumber);
    expect(encodedNumber).toBe('11');
  });

  it('encode bool', () => {
    let encodedTrue = encoder.encodeBool(true);
    encodedTrue = encodedTrue.toString('hex');
    expect(encodedTrue).toBe('02');

    let encodedFalse = encoder.encodeBool(false);
    encodedFalse = encodedFalse.toString('hex');
    expect(encodedFalse).toBe('00');
  });

  it('bn', ()=>{
    const num = new bn(100000000);
    const b1 = new bn(Math.pow(10, 8));
    console.log(num.mul(b1).shrn(7))
  })

  it('encode string', () => {
    let encodedString = encoder.encodeString('You are beautiful');
    encodedString = encodedString.toString('hex');
    expect(encodedString).toBe('11596f75206172652062656175746966756c');
  });

  it('convertObjectToBytes', () => {
    const jsonObj = {
      address: 1,
      sender: 2,
      symbol: 3,
    }
    const str = encoder.convertObjectToBytes(jsonObj);
    expect(str.toString('hex')).toBe('7b2261646472657373223a312c2273656e646572223a322c2273796d626f6c223a337d');
  });
 
});