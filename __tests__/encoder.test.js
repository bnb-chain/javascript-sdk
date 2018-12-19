import * as encoder from '../src/encoder';
import * as crypto from '../src/crypto';
import { UVarInt } from '../src/encoder/varint';

describe('encoder', () => {
  it('encode time', () => {
    let encodedTime = encoder.encodeTime('1973-11-29T21:33:09.123456789Z');
    encodedTime = encodedTime.toString('hex');
    expect(encodedTime).toBe('0915cd5b07000000001515cd5b07');
  });

  it('encode number', () => {
    let encodedNumber = encoder.encodeNumber(100000);
    encodedNumber = encodedNumber.toString('hex');
    expect(encodedNumber).toBe('c09a0c');
  });

  it('UVarInt', () => {
    let encodedNumber = UVarInt.encode(17);
    encodedNumber = encodedNumber.toString('hex');
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

  it('marshalBinary', () => {
    const stdTx = {
      "msg": [{
        "sender": Buffer.from([182, 86, 29, 204, 16, 65, 48, 5, 154, 124, 8, 244, 140, 100, 97, 12, 31, 111, 144, 100]),
        "id": "B6561DCC104130059A7C08F48C64610C1F6F9064-11",
        "symbol": "BTC-5C4_BNB",
        "ordertype": 2,
        "side": 1,
        "price": 100000000,
        "quantity": 1200000000,
        "timeinforce": 1,
        "msgType": "NewOrderMsg"
      }],
      "signatures": [{
        "pub_key": Buffer.from([235, 90, 233, 135, 33, 3, 186, 245, 61, 20, 36, 248, 234, 131, 208, 58, 130, 246, 209, 87, 181, 64, 28, 78, 165, 127, 251, 131, 23, 135, 46, 21, 161, 159, 201, 183, 173, 123]),
        "signature": Buffer.from([231, 154, 102, 6, 210, 140, 240, 123, 156, 198, 245, 102, 181, 36, 165, 40, 43, 19, 190, 204, 195, 22, 35, 118, 199, 159, 57, 38, 32, 201, 90, 68, 123, 25, 246, 78, 118, 30, 34, 167, 163, 188, 49, 26, 120, 14, 125, 159, 221, 82, 30, 47, 126, 222, 194, 83, 8, 197, 186, 198, 170, 28, 10, 49]),
        "account_number": 1,
        "sequence": 10
      }],
      "memo": "",
      "msgType": "StdTx"
    };

    const bytes = encoder.marshalBinary(stdTx);
    expect(bytes).toBe('db01f0625dee0a65ce6dc0430a14b6561dcc104130059a7c08f48c64610c1f6f9064122b423635363144434331303431333030353941374330384634384336343631304331463646393036342d31311a0b4254432d3543345f424e4220042802308084af5f3880b0b4f8084002126e0a26eb5ae9872103baf53d1424f8ea83d03a82f6d157b5401c4ea57ffb8317872e15a19fc9b7ad7b1240e79a6606d28cf07b9cc6f566b524a5282b13beccc3162376c79f392620c95a447b19f64e761e22a7a3bc311a780e7d9fdd521e2f7edec25308c5bac6aa1c0a3118022014');
  })

});