'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrivateKeyFromMnemonic = exports.generateMnemonic = exports.getMnemonicFromPrivateKey = exports.getPrivateKeyFromKeyStore = exports.generateKeyStore = exports.generateSignature = exports.getAddressFromPrivateKey = exports.generatePubKey = exports.getPublicKeyFromPrivateKey = exports.getPublicKey = exports.getPrivateKeyFromWIF = exports.getWIFFromPrivateKey = exports.generateRandomArray = exports.generatePrivateKey = exports.encodeAddress = exports.decodeAddress = undefined;

var _secureRandom = require('secure-random');

var _secureRandom2 = _interopRequireDefault(_secureRandom);

var _wif = require('wif');

var _wif2 = _interopRequireDefault(_wif);

var _bech = require('bech32');

var _bech2 = _interopRequireDefault(_bech);

var _cryptoBrowserify = require('crypto-browserify');

var _cryptoBrowserify2 = _interopRequireDefault(_cryptoBrowserify);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bip = require('bip39');

var _bip2 = _interopRequireDefault(_bip);

var _bip3 = require('bip32');

var _bip4 = _interopRequireDefault(_bip3);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EC = require('elliptic').ec;
// import bip66 from 'bip66';
// import { toDER } from '../utils/';
// import { UVarInt } from '../encoder/varint';

var ecc = require('tiny-secp256k1');

// secp256k1 privkey is 32 bytes
var PRIVKEY_LEN = 32;
var CURVE = 'secp256k1';

//hdpath
var HDPATH = "44'/118'/0'/0/0";

var ec = new EC(CURVE);

/**
 * Decodes an address in bech32 format.
 * @param {string} value the bech32 address to decode
 */
var decodeAddress = exports.decodeAddress = function decodeAddress(value) {
  var decodeAddress = _bech2.default.decode(value);
  return Buffer.from(_bech2.default.fromWords(decodeAddress.words));
};

/**
 * Encodes an address from input data bytes.
 * @param {string} value the public key to encode
 * @param {*} prefix the address prefix
 * @param {*} type the output type (default: hex)
 */
var encodeAddress = exports.encodeAddress = function encodeAddress(value) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "cosmosaccaddr";
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "hex";

  var words = _bech2.default.toWords(Buffer.from(value, type));
  return _bech2.default.encode(prefix, words);
};

/**
 * Generates a random private key
 * @returns {string}
 */
var generatePrivateKey = exports.generatePrivateKey = function generatePrivateKey() {
  return (0, _utils.ab2hexstring)((0, _secureRandom2.default)(PRIVKEY_LEN));
};

/**
 * Generates a arrayBuffer filled with random bits.
 * @param {number} length - Length of buffer.
 * @returns {ArrayBuffer}
 */
var generateRandomArray = exports.generateRandomArray = function generateRandomArray(length) {
  return (0, _secureRandom2.default)(length);
};

/**
 * @param {string} privateKey
 * @return {string}
 */
var getWIFFromPrivateKey = exports.getWIFFromPrivateKey = function getWIFFromPrivateKey(privateKey) {
  return _wif2.default.encode(128, Buffer.from(privateKey, 'hex'), true);
};

/**
 * @param {string} wif
 * @return {string}
 */
var getPrivateKeyFromWIF = exports.getPrivateKeyFromWIF = function getPrivateKeyFromWIF(wif) {
  return (0, _utils.ab2hexstring)(_wif2.default.decode(wif, 128).privateKey);
};

/**
 * @param {string} publicKey - Encoded public key
 * @return {string} decoded public key
 */
var getPublicKey = exports.getPublicKey = function getPublicKey(publicKey) {
  var keyPair = ec.keyFromPublic(publicKey, 'hex');
  return keyPair.getPublic().encode('hex');
};

/**
 * Calculates the public key from a given private key.
 * @param {string} privateKey
 * @return {string}
 */
var getPublicKeyFromPrivateKey = exports.getPublicKeyFromPrivateKey = function getPublicKeyFromPrivateKey(privateKey) {
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
var generatePubKey = exports.generatePubKey = function generatePubKey(privateKey) {
  var curve = new EC(CURVE);
  var keypair = curve.keyFromPrivate(privateKey, 'hex');
  return keypair.getPublic();
};

/**
 * Gets an address from a private key.
 * @param {string} privateKey the private key hexstring
 */
var getAddressFromPrivateKey = exports.getAddressFromPrivateKey = function getAddressFromPrivateKey(privateKey) {
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
var generateSignature = exports.generateSignature = function generateSignature(hex, privateKey) {
  var msgHash = (0, _utils.sha256)(hex);
  var msgHashHex = Buffer.from(msgHash, 'hex');
  var sig = ecc.sign(msgHashHex, Buffer.from(privateKey, 'hex'));
  // const r = toDER(Buffer.from(sig.slice(0, 32), 'hex'));
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
var generateKeyStore = exports.generateKeyStore = function generateKeyStore(privateKey, password) {
  var address = getAddressFromPrivateKey(privateKey);
  var salt = _cryptoBrowserify2.default.randomBytes(32);
  var iv = _cryptoBrowserify2.default.randomBytes(16);
  var cipherAlg = 'aes-256-ctr';

  var kdfparams = {
    dklen: 32,
    salt: salt.toString('hex'),
    c: 262144,
    prf: 'hmac-sha256'
  };

  var derivedKey = _cryptoBrowserify2.default.pbkdf2Sync(new Buffer(password), salt, kdfparams.c, kdfparams.dklen, 'sha256');
  var cipher = _cryptoBrowserify2.default.createCipher(cipherAlg, derivedKey.slice(0, 16), iv);
  if (!cipher) {
    throw new Error('Unsupported cipher');
  }

  var ciphertext = Buffer.concat([cipher.update(new Buffer(privateKey, 'hex')), cipher.final()]);
  var bufferValue = Buffer.concat([derivedKey.slice(16, 32), new Buffer(ciphertext, 'hex')]);
  var mac = (0, _utils.sha256)(bufferValue.toString('hex'));

  return {
    version: 1,
    id: _uuid2.default.v4({
      random: _cryptoBrowserify2.default.randomBytes(16)
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
var getPrivateKeyFromKeyStore = exports.getPrivateKeyFromKeyStore = function getPrivateKeyFromKeyStore(keystore, password) {

  if (!_lodash2.default.isString(password)) {
    throw new Error('No password given.');
  }

  var json = _lodash2.default.isObject(keystore) ? keystore : JSON.parse(keystore);
  var kdfparams = json.crypto.kdfparams;

  if (kdfparams.prf !== 'hmac-sha256') {
    throw new Error('Unsupported parameters to PBKDF2');
  }

  var derivedKey = _cryptoBrowserify2.default.pbkdf2Sync(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256');
  var ciphertext = new Buffer(json.crypto.ciphertext, 'hex');
  var bufferValue = Buffer.concat([derivedKey.slice(16, 32), ciphertext]);
  var mac = (0, _utils.sha256)(bufferValue.toString('hex'));

  if (mac !== json.crypto.mac) {
    throw new Error('Key derivation failed - possibly wrong password');
  }

  var decipher = _cryptoBrowserify2.default.createDecipher(json.crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.crypto.cipherparams.iv, 'hex'));
  var privateKey = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('hex');

  return privateKey;
};

/**
 * Gets Mnemonic from a private key.
 * @param {string} privateKey the private key hexstring
 */
var getMnemonicFromPrivateKey = exports.getMnemonicFromPrivateKey = function getMnemonicFromPrivateKey(privateKey) {
  return _bip2.default.entropyToMnemonic(privateKey);
};

/**
 * Generate Mnemonic (length=== 15)
 */
var generateMnemonic = exports.generateMnemonic = function generateMnemonic() {
  return _bip2.default.generateMnemonic(160);
};

/**
 * Get privatekey from mnemonic.
 * @param {mnemonic} 
 */
var getPrivateKeyFromMnemonic = exports.getPrivateKeyFromMnemonic = function getPrivateKeyFromMnemonic(mnemonic) {
  var seed = _bip2.default.mnemonicToSeed(mnemonic);
  var master = _bip4.default.fromSeed(seed);
  var child = master.derivePath(HDPATH);
  return child.privateKey;
};