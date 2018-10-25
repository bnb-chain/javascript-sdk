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

});