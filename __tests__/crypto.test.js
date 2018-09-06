import * as crypto from '../src/crypto';

const privateKey = crypto.generatePrivateKey();
let keyStore;

describe('crypto', () => {
  it('generateKeyStore baseon on privateKey', () => {
    keyStore = crypto.generateKeyStore(privateKey, '1234567');
    console.log(keyStore);
  });

  it('getPrivateKeyFromKeyStore baseon on keyStore', () => {
    const seed = crypto.getPrivateKeyFromKeyStore(keyStore, '1234567');
    expect(seed).toBe(privateKey);
  });
});