"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrivateKeyFromMnemonic = exports.generateMnemonic = exports.getMnemonicFromPrivateKey = exports.getPrivateKeyFromKeyStore = exports.generateKeyStore = exports.generateSignature = exports.getAddressFromPrivateKey = exports.generatePubKey = exports.getPublicKeyFromPrivateKey = exports.getPublicKey = exports.getPrivateKeyFromWIF = exports.getWIFFromPrivateKey = exports.generateRandomArray = exports.generatePrivateKey = exports.encodeAddress = exports.decodeAddress = void 0;

var _secureRandom = _interopRequireDefault(require("secure-random"));

var _wif = _interopRequireDefault(require("wif"));

var _bech = _interopRequireDefault(require("bech32"));

var _cryptoBrowserify = _interopRequireDefault(require("crypto-browserify"));

var _uuid = _interopRequireDefault(require("uuid"));

var _lodash = _interopRequireDefault(require("lodash"));

var _bip = _interopRequireDefault(require("bip39"));

var _bip2 = _interopRequireDefault(require("bip32"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import bip66 from 'bip66';
// import { toDER } from '../utils/';
// import { UVarInt } from '../encoder/varint';
var EC = require('elliptic').ec;

var ecc = require('tiny-secp256k1'); // secp256k1 privkey is 32 bytes


var PRIVKEY_LEN = 32;
var CURVE = 'secp256k1'; //hdpath

var HDPATH = "44'/714'/0'/0/0";
var ec = new EC(CURVE);
/**
 * Decodes an address in bech32 format.
 * @param {string} value the bech32 address to decode
 */

var decodeAddress = function decodeAddress(value) {
  var decodeAddress = _bech.default.decode(value);

  return Buffer.from(_bech.default.fromWords(decodeAddress.words));
};
/**
 * Encodes an address from input data bytes.
 * @param {string} value the public key to encode
 * @param {*} prefix the address prefix
 * @param {*} type the output type (default: hex)
 */


exports.decodeAddress = decodeAddress;

var encodeAddress = function encodeAddress(value) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "bnc";
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "hex";

  var words = _bech.default.toWords(Buffer.from(value, type));

  return _bech.default.encode(prefix, words);
};
/**
 * Generates a random private key
 * @returns {string}
 */


exports.encodeAddress = encodeAddress;

var generatePrivateKey = function generatePrivateKey() {
  return (0, _utils.ab2hexstring)((0, _secureRandom.default)(PRIVKEY_LEN));
};
/**
 * Generates a arrayBuffer filled with random bits.
 * @param {number} length - Length of buffer.
 * @returns {ArrayBuffer}
 */


exports.generatePrivateKey = generatePrivateKey;

var generateRandomArray = function generateRandomArray(length) {
  return (0, _secureRandom.default)(length);
};
/**
 * @param {string} privateKey
 * @return {string}
 */


exports.generateRandomArray = generateRandomArray;

var getWIFFromPrivateKey = function getWIFFromPrivateKey(privateKey) {
  return _wif.default.encode(128, Buffer.from(privateKey, 'hex'), true);
};
/**
 * @param {string} wif
 * @return {string}
 */


exports.getWIFFromPrivateKey = getWIFFromPrivateKey;

var getPrivateKeyFromWIF = function getPrivateKeyFromWIF(wif) {
  return (0, _utils.ab2hexstring)(_wif.default.decode(wif, 128).privateKey);
};
/**
 * @param {string} publicKey - Encoded public key
 * @return {string} decoded public key
 */


exports.getPrivateKeyFromWIF = getPrivateKeyFromWIF;

var getPublicKey = function getPublicKey(publicKey) {
  var keyPair = ec.keyFromPublic(publicKey, 'hex');
  return keyPair.getPublic().encode('hex');
};
/**
 * Calculates the public key from a given private key.
 * @param {string} privateKey
 * @return {string}
 */


exports.getPublicKey = getPublicKey;

var getPublicKeyFromPrivateKey = function getPublicKeyFromPrivateKey(privateKey) {
  var curve = new EC(CURVE);
  var keypair = curve.keyFromPrivate(privateKey, 'hex');
  var unencodedPubKey = keypair.getPublic().encode('hex');
  return unencodedPubKey;
};
/**
 * PubKey performs the point-scalar multiplication from the privKey on the
 * generator point to get the pubkey.
 * @param {string} privateKey
 * @return {array-bn} PubKey
 * */


exports.getPublicKeyFromPrivateKey = getPublicKeyFromPrivateKey;

var generatePubKey = function generatePubKey(privateKey) {
  var curve = new EC(CURVE);
  var keypair = curve.keyFromPrivate(privateKey, 'hex');
  return keypair.getPublic();
};
/**
 * Gets an address from a private key.
 * @param {string} privateKey the private key hexstring
 */


exports.generatePubKey = generatePubKey;

var getAddressFromPrivateKey = function getAddressFromPrivateKey(privateKey) {
  var pubKey = ec.keyFromPublic(getPublicKeyFromPrivateKey(privateKey), 'hex');
  var pubPoint = pubKey.getPublic();
  var compressed = pubPoint.encodeCompressed();
  var hexed = (0, _utils.ab2hexstring)(compressed);
  var hash = (0, _utils.sha256ripemd160)(hexed); // https://git.io/fAn8N

  var address = encodeAddress(hash);
  return address;
};
/**
 * Generates a signature of the transaction based on given private key.
 * @param {string} hex - Serialized unsigned transaction. or hexstring.
 * @param {string} privateKey - Private Key.
 * @return {Buffer} Signature. Does not include tx.
 */


exports.getAddressFromPrivateKey = getAddressFromPrivateKey;

var generateSignature = function generateSignature(hex, privateKey) {
  var msgHash = (0, _utils.sha256)(hex);
  var msgHashHex = Buffer.from(msgHash, 'hex');
  var signature = ecc.sign(msgHashHex, Buffer.from(privateKey, 'hex')); // const r = toDER(Buffer.from(sig.slice(0, 32), 'hex'));
  // const s = toDER(Buffer.from(sig.slice(32), 'hex'));
  // const signature = bip66.encode(r, s);
  //prefix length and signature amino signature type(0x7FC4A495)
  // const aminoPrefix = Buffer.from('7FC4A495', 'hex');
  // const lengthPrefix = UVarInt.encode(signature.length);

  return signature;
};
/**
 * Generates a keystore file based on given private key and password.
 * @param {string} privateKey - Private Key.
 * @param {string} password - Password.
 */


exports.generateSignature = generateSignature;

var generateKeyStore = function generateKeyStore(privateKey, password) {
  var address = getAddressFromPrivateKey(privateKey);

  var salt = _cryptoBrowserify.default.randomBytes(32);

  var iv = _cryptoBrowserify.default.randomBytes(16);

  var cipherAlg = 'aes-256-ctr';
  var kdfparams = {
    dklen: 32,
    salt: salt.toString('hex'),
    c: 262144,
    prf: 'hmac-sha256'
  };

  var derivedKey = _cryptoBrowserify.default.pbkdf2Sync(Buffer.from(password), salt, kdfparams.c, kdfparams.dklen, 'sha256');

  var cipher = _cryptoBrowserify.default.createCipher(cipherAlg, derivedKey.slice(0, 16), iv);

  if (!cipher) {
    throw new Error('Unsupported cipher');
  }

  var ciphertext = Buffer.concat([cipher.update(Buffer.from(privateKey, 'hex')), cipher.final()]);
  var bufferValue = Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext, 'hex')]);
  var mac = (0, _utils.sha256)(bufferValue.toString('hex'));
  return {
    version: 1,
    id: _uuid.default.v4({
      random: _cryptoBrowserify.default.randomBytes(16)
    }),
    address: address.toLowerCase(),
    crypto: {
      ciphertext: ciphertext.toString('hex'),
      cipherparams: {
        iv: iv.toString('hex')
      },
      cipher: cipherAlg,
      kdf: 'pbkdf2',
      kdfparams: kdfparams,
      mac: mac
    }
  };
};
/**
 * Generates privatekey based on keystore and password
 * @param {string} keystore - keystore file json format.
 * @param {string} password - Password.
 */


exports.generateKeyStore = generateKeyStore;

var getPrivateKeyFromKeyStore = function getPrivateKeyFromKeyStore(keystore, password) {
  if (!_lodash.default.isString(password)) {
    throw new Error('No password given.');
  }

  var json = _lodash.default.isObject(keystore) ? keystore : JSON.parse(keystore);
  var kdfparams = json.crypto.kdfparams;

  if (kdfparams.prf !== 'hmac-sha256') {
    throw new Error('Unsupported parameters to PBKDF2');
  }

  var derivedKey = _cryptoBrowserify.default.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256');

  var ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');
  var bufferValue = Buffer.concat([derivedKey.slice(16, 32), ciphertext]);
  var mac = (0, _utils.sha256)(bufferValue.toString('hex'));

  if (mac !== json.crypto.mac) {
    throw new Error('Key derivation failed - possibly wrong password');
  }

  var decipher = _cryptoBrowserify.default.createDecipher(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'));

  var privateKey = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('hex');
  return privateKey;
};
/**
 * Gets Mnemonic from a private key.
 * @param {string} privateKey the private key hexstring
 */


exports.getPrivateKeyFromKeyStore = getPrivateKeyFromKeyStore;

var getMnemonicFromPrivateKey = function getMnemonicFromPrivateKey(privateKey) {
  return _bip.default.entropyToMnemonic(privateKey);
};
/**
 * Generate Mnemonic (length=== 15)
 */


exports.getMnemonicFromPrivateKey = getMnemonicFromPrivateKey;

var generateMnemonic = function generateMnemonic() {
  return _bip.default.generateMnemonic(160);
};
/**
 * Get privatekey from mnemonic.
 * @param {mnemonic} 
 */


exports.generateMnemonic = generateMnemonic;

var getPrivateKeyFromMnemonic = function getPrivateKeyFromMnemonic(mnemonic) {
  if (!_bip.default.validateMnemonic(mnemonic)) {
    throw new Error('wrong mnemonic format');
  }

  var seed = _bip.default.mnemonicToSeed(mnemonic);

  var master = _bip2.default.fromSeed(seed);

  var child = master.derivePath(HDPATH);
  return child.privateKey;
};

exports.getPrivateKeyFromMnemonic = getPrivateKeyFromMnemonic;