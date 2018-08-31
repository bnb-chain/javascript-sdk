import EC from 'elliptic/lib/elliptic/ec';
import csprng from 'secure-random';
import WIF from 'wif';
import bech32 from 'bech32';

import {
  ab2hexstring,
  sha256,
  sha256ripemd160,
} from "../utils";

// secp256k1 privkey is 32 bytes
const PRIVKEY_LEN = 32;
const CURVE = 'secp256k1';

const ec = new EC(CURVE);

/**
 * Decodes an address in bech32 format.
 * @param {string} value the bech32 address to decode
 */
export const decodeAddress = (value) => {
  const words = bech32.decode(value);
  return bech32.fromWords(words);
};

/**
 * Encodes an address from input data bytes.
 * @param {string} value the public key to encode
 * @param {*} prefix the address prefix
 * @param {*} type the output type (default: hex)
 */
export const encodeAddress = (value, prefix = "cosmosaccaddr", type = "hex") => {
  const words = bech32.toWords(Buffer.from(value, type));
  return bech32.encode(prefix, words);
}

/**
 * Generates a random private key
 * @returns {string}
 */
export const generatePrivateKey = () => {
  return ab2hexstring(csprng(PRIVKEY_LEN));
};

/**
 * Generates a arrayBuffer filled with random bits.
 * @param {number} length - Length of buffer.
 * @returns {ArrayBuffer}
 */
export const generateRandomArray = length => {
  return csprng(length);
};

/**
 * @param {string} privateKey
 * @return {string}
 */
export const getWIFFromPrivateKey = privateKey => {
  return WIF.encode(128, Buffer.from(privateKey, 'hex'), true);
};

/**
 * @param {string} wif
 * @return {string}
 */
export const getPrivateKeyFromWIF = wif => {
  return ab2hexstring(WIF.decode(wif, 128).privateKey);
};

/**
 * @param {string} publicKey - Encoded public key
 * @return {string} decoded public key
 */
export const getPublicKey = publicKey => {
  let keyPair = ec.keyFromPublic(publicKey, 'hex');
  return keyPair.getPublic().encode('hex');
};

/**
 * Calculates the public key from a given private key.
 * @param {string} privateKey
 * @return {string}
 */
export const getPublicKeyFromPrivateKey = privateKey => {
  const curve = new EC(CURVE);
  const keypair = curve.keyFromPrivate(privateKey, 'hex');
  const unencodedPubKey = keypair.getPublic().encode('hex');
  return unencodedPubKey;
};

/**
 * Gets an address from a private key.
 * @param {string} privateKey the private key hexstring
 */
export const getAddressFromPrivateKey = privateKey => {
  const pubKey = ec.keyFromPublic(getPublicKeyFromPrivateKey(privateKey), 'hex');
  const pubPoint = pubKey.getPublic();
  const compressed = pubPoint.encodeCompressed();
  const hexed = ab2hexstring(compressed);
  const hash = sha256ripemd160(hexed); // https://git.io/fAn8N
  const address = encodeAddress(hash);
  return address;
}

/**
 * Generates a signature of the transaction based on given private key.
 * @param {string} hex - Serialized unsigned transaction. or hexstring.
 * @param {string} privateKey - Private Key.
 * @return {string} Signature. Does not include tx.
 */
export const generateSignature = (hex, privateKey) => {
  const msgHash = sha256(hex);
  const msgHashHex = Buffer.from(msgHash, 'hex');

  let elliptic = new EC(CURVE);
  const sig = elliptic.sign(msgHashHex, privateKey, null);
  const signature = Buffer.concat([
    sig.r.toArrayLike(Buffer, 'be', 32),
    sig.s.toArrayLike(Buffer, 'be', 32)
  ]);

  return signature.toString('hex');
};
