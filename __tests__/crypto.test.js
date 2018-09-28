import * as crypto from '../src/crypto';

const privateKey = crypto.generatePrivateKey();
console.log(privateKey);
const keyStore = crypto.generateKeyStore(privateKey, '1234567');
const mnemonic = crypto.generateMnemonic();
// const mnemonic = crypto.getMnemonicFromPrivateKey(privateKey);

describe('crypto', () => {
  it('getPrivateKeyFromKeyStore baseon on keyStore', () => {
    const seed = crypto.getPrivateKeyFromKeyStore(keyStore, '1234567');
    expect(seed).toBe(privateKey);
  });

  it('getMnemonicFromPrivateKey', ()=>{
    expect(mnemonic.split(' ').length).toBe(15);
  });

  it('getPrivateKeyFromMnemonic', ()=>{
    const seed = crypto.getPrivateKeyFromMnemonic(mnemonic);
    console.log(seed.toString('hex'));
  });

});