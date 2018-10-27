import * as crypto from '../src/crypto';

const privateKey = crypto.generatePrivateKey();
console.log(privateKey);
const keyStore = crypto.generateKeyStore(privateKey, '1234567');
const mnemonic = crypto.generateMnemonic();
// const mnemonic = crypto.getMnemonicFromPrivateKey(privateKey);

describe('crypto', () => {
  it('getPrivateKeyFromKeyStore baseon on keyStore', () => {
    const pk = crypto.getPrivateKeyFromKeyStore(keyStore, '1234567');
    expect(pk).toBe(privateKey);
  });

  it('getMnemonicFromPrivateKey', ()=>{
    expect(mnemonic.split(' ').length).toBe(15);
  });

  it('decodeAddress', ()=>{
    let address = 'cosmosaccaddr1wqrn76z0v36pr3vx3sgue4y5rv4pzpu6ffnjj0';
    const decod = crypto.decodeAddress(address);
    console.log(decod);
    expect(decod.toString('hex')).toBe('70073f684f647411c5868c11ccd4941b2a11079a');
  });

  it('getPrivateKeyFromMnemonic', ()=>{
    const mnemonic = 'bacon riot clap clarify cash forest magic give camp blast blade regret visa parent coach wasp banner axis escape deer evolve poem express fine';
    const pk = crypto.getPrivateKeyFromMnemonic(mnemonic);
    const address = crypto.getAddressFromPrivateKey(pk);
    expect(address).toBe('cosmosaccaddr1d27dffpdrp9qrwjvtc5rjvpug5ykplxmutnrev');
  });

  it('generateSignature', ()=>{
    const hex = '7b226163636f756e745f6e756d626572223a2230222c22636861696e5f6964223a22746573742d636861696e2d6e3462373335222c22666565223a7b22616d6f756e74223a5b7b22616d6f756e74223a2230222c2264656e6f6d223a22227d5d2c22676173223a22323030303030227d2c226d656d6f223a22222c226d736773223a5b7b226964223a22373030373346363834463634373431314335383638433131434344343934314232413131303739412d3135222c226f7264657274797065223a322c227072696365223a3630303030303030302c227175616e74697479223a31303030303030302c2273656e646572223a22636f736d6f7361636361646472317771726e37367a3076333670723376783373677565347935727634707a70753666666e6a6a30222c2273696465223a312c2273796d626f6c223a224e4e425f424e42222c2274696d65696e666f726365223a312c2276657273696f6e223a317d5d2c2273657175656e6365223a223134227d';
    let bz = crypto.generateSignature(hex, '897f4cfd1bf7f3d58e1037843d289c7ad42067ce79517d594b3dc4596f2b65ff');
    expect(bz.toString('hex')).toBe('7fc4a495463044022002ba4913754302fe8ffbde4ab8f5460a1b68e60c6a76773b7d2a7ea084dd93fa02206e68abf58acc685724bcc534c89bb5fa2675a3d8209a4f644186defbdb841c33');
  });

});