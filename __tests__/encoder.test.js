import * as encoder from '../src/encoder';
import * as crypto from '../src/crypto';

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


  it('marshalBinary', () => {
    const data = {
      "account_number": "2",
      "chain_id": "bnbchain-1000",
      "fee": {
        "amount": [{
          "denom": "",
          "amount": 0
        }],
        "gas": 0
      },
      "memo": "",
      "msgs": [{
        "id": "cosmosaccaddr173hyu6dtfkrj9vujjhvz2ayehrng64rxq3h4yp-46",
        "ordertype": 2,
        "price": 1,
        "quantity": 1,
        "sender": "cosmosaccaddr173hyu6dtfkrj9vujjhvz2ayehrng64rxq3h4yp",
        "side": 1,
        "symbol": "XYZ_BNB",
        "timeinforce": 1
      }],
      "sequence": "46"
    }
    let encodeString = encoder.marshalBinaryBare(data);
    console.log(encodeString);
    expect(encodeString).toBe('0a0132120d626e62636861696e2d313030301a020a002a82010a37636f736d6f7361636361646472313733687975366474666b726a3976756a6a68767a3261796568726e67363472787133683479702d34361004180220022a34636f736d6f7361636361646472313733687975366474666b726a3976756a6a68767a3261796568726e673634727871336834797030023a0758595a5f424e42400232023436');
  })

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