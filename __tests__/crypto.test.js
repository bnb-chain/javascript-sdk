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
    let privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
    privateKey = privateKey.toString('hex');
    const address = crypto.getAddressFromPrivateKey(privateKey);
    console.log(address);
  });

});