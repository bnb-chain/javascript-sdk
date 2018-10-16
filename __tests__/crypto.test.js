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

  it('getPrivateKeyFromMnemonic', ()=>{
    const mnemonic = 'bacon riot clap clarify cash forest magic give camp blast blade regret visa parent coach wasp banner axis escape deer evolve poem express fine';
    const pk = crypto.getPrivateKeyFromMnemonic(mnemonic);
    const address = crypto.getAddressFromPrivateKey(pk);
    expect(address).toBe('cosmosaccaddr1d27dffpdrp9qrwjvtc5rjvpug5ykplxmutnrev');
  });
});