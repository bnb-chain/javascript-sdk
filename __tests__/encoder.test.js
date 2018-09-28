import * as encoder from '../src/amino/';
import placeOrderMsg from '../src/amino/placeOrderMsg';

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

  it('placeOrderMsg', () => {
    const data = {
      "Id": 1,
      "Sender": 2,
      "Symbol": 3,
    };
    let encodedString = placeOrderMsg.encode(data);
    encodedString = encodedString.toString('hex');
    // expect(encodedString).toBe('08041237636f736d6f7361636361646472313733687975366474666b726a3976756a6a68767a3261796568726e67363472787133683479702d3436180220022a34636f736d6f7361636361646472313733687975366474666b726a3976756a6a68767a3261796568726e673634727871336834797030023a0758595a5f424e424002');
  });
});