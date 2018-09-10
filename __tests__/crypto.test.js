import * as crypto from '../src/crypto';

const privateKey = crypto.generatePrivateKey();
const keyStore = crypto.generateKeyStore(privateKey, '1234567');

describe('crypto', () => {
  it('getPrivateKeyFromKeyStore baseon on keyStore', () => {
    const seed = crypto.getPrivateKeyFromKeyStore(keyStore, '1234567');
    expect(seed).toBe(privateKey);
  });
});