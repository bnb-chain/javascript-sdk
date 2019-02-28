/**
 * @module crypto
 */

import csprng from "secure-random"
import bech32 from "bech32"
import cryp from "crypto-browserify"
import uuid from "uuid"
import _ from "lodash"
import bip39 from "bip39"
import bip32 from "bip32"
import { ec as EC } from "elliptic"
import ecc from "tiny-secp256k1"

import {
  ab2hexstring,
  sha256,
  sha256ripemd160,
} from "../utils"

// secp256k1 privkey is 32 bytes
const PRIVKEY_LEN = 32
const MNEMONIC_LEN = 256
const CURVE = "secp256k1"

//hdpath
const HDPATH = "44'/714'/0'/0/0"

const ec = new EC(CURVE)

/**
 * Decodes an address in bech32 format.
 * @param {string} value the bech32 address to decode
 */
export const decodeAddress = (value) => {
  const decodeAddress = bech32.decode(value)
  return Buffer.from(bech32.fromWords(decodeAddress.words))
}

/**
 * checek address whether is valid
 * @param {string} address the bech32 address to decode
 */
export const checkAddress = (address) => {
  try {
    const decodeAddress = bech32.decode(address)
    if(decodeAddress.prefix === "tbnb") {
      return true
    }

    return false
  } catch(err) {
    return false
  }
}

/**
 * Encodes an address from input data bytes.
 * @param {string} value the public key to encode
 * @param {*} prefix the address prefix
 * @param {*} type the output type (default: hex)
 */
export const encodeAddress = (value, prefix = "tbnb", type = "hex") => {
  const words = bech32.toWords(Buffer.from(value, type))
  return bech32.encode(prefix, words)
}

/**
 * Generates 32 bytes of random entropy
 * @param {number} len output length (default: 32 bytes)
 * @returns {string} entropy bytes hexstring
 */
export const generatePrivateKey = (len = PRIVKEY_LEN) => ab2hexstring(csprng(len))

/**
 * Generates an arrayBuffer filled with random bits.
 * @param {number} length - Length of buffer.
 * @returns {ArrayBuffer}
 */
export const generateRandomArray = length => csprng(length)

/**
 * @param {string} publicKey - Encoded public key
 * @return {Elliptic.PublicKey} public key hexstring
 */
export const getPublicKey = publicKey => {
  let keyPair = ec.keyFromPublic(publicKey, "hex")
  return keyPair.getPublic()
}

/**
 * Calculates the public key from a given private key.
 * @param {string} privateKeyHex the private key hexstring
 * @return {string} public key hexstring
 */
export const getPublicKeyFromPrivateKey = privateKeyHex => {
  const curve = new EC(CURVE)
  const keypair = curve.keyFromPrivate(privateKeyHex, "hex")
  const unencodedPubKey = keypair.getPublic().encode("hex")
  return unencodedPubKey
}

/**
 * PubKey performs the point-scalar multiplication from the privKey on the
 * generator point to get the pubkey.
 * @param {Buffer} privateKey
 * @return {Elliptic.PublicKey} PubKey
 * */
export const generatePubKey = privateKey => {
  const curve = new EC(CURVE)
  const keypair = curve.keyFromPrivate(privateKey)
  return keypair.getPublic()
}

/**
 * Gets an address from a public key hex.
 * @param {string} publicKeyHex the public key hexstring
 */
export const getAddressFromPublicKey = publicKeyHex => {
  const pubKey = ec.keyFromPublic(publicKeyHex, "hex")
  const pubPoint = pubKey.getPublic()
  const compressed = pubPoint.encodeCompressed()
  const hexed = ab2hexstring(compressed)
  const hash = sha256ripemd160(hexed) // https://git.io/fAn8N
  const address = encodeAddress(hash)
  return address
}

/**
 * Gets an address from a private key.
 * @param {string} privateKeyHex the private key hexstring
 */
export const getAddressFromPrivateKey = privateKeyHex => {
  return getAddressFromPublicKey(getPublicKeyFromPrivateKey(privateKeyHex))
}

/**
 * Generates a signature (64 byte <r,s>) for a transaction based on given private key.
 * @param {string} signBytesHex - Unsigned transaction sign bytes hexstring.
 * @param {string | Buffer} privateKey - The private key.
 * @return {Buffer} Signature. Does not include tx.
 */
export const generateSignature = (signBytesHex, privateKey) => {
  const msgHash = sha256(signBytesHex)
  const msgHashHex = Buffer.from(msgHash, "hex")
  const signature = ecc.sign(msgHashHex, Buffer.from(privateKey, "hex")) // enc ignored if buffer
  return signature
}

/**
 * Verifies a signature (64 byte <r,s>) given the sign bytes and public key.
 * @param {string} sigHex - The signature hexstring.
 * @param {string} signBytesHex - Unsigned transaction sign bytes hexstring.
 * @param {string} publicKeyHex - The public key.
 * @return {Buffer} Signature. Does not include tx.
 */
export const verifySignature = (sigHex, signBytesHex, publicKeyHex) => {
  const publicKey = Buffer.from(publicKeyHex, "hex")
  if (!ecc.isPoint(publicKey)) throw new Error("Invalid public key provided")
  const msgHash = sha256(signBytesHex)
  const msgHashHex = Buffer.from(msgHash, "hex")
  return ecc.verify(msgHashHex, publicKey, Buffer.from(sigHex, "hex"))
}

/**
 * Generates a keystore based on given private key and password.
 * @param {string} privateKey the private key
 * @param {string} password the password
 */
export const generateKeyStore = (privateKey, password) => {
  const address = getAddressFromPrivateKey(privateKey)
  const salt = cryp.randomBytes(32)
  const iv = cryp.randomBytes(16)
  const cipherAlg = "aes-256-ctr"

  const kdfparams = {
    dklen: 32,
    salt: salt.toString("hex"),
    c: 262144,
    prf: "hmac-sha256"
  }

  const derivedKey = cryp.pbkdf2Sync(Buffer.from(password), salt, kdfparams.c, kdfparams.dklen, "sha256")
  const cipher = cryp.createCipheriv(cipherAlg, derivedKey.slice(0, 32), iv)
  if (!cipher) {
    throw new Error("Unsupported cipher")
  }

  const ciphertext = Buffer.concat([cipher.update(Buffer.from(privateKey, "hex")), cipher.final()])
  const bufferValue = Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext, "hex")])
  const mac = sha256(bufferValue.toString("hex"))

  return {
    version: 1,
    id: uuid.v4({
      random: cryp.randomBytes(16)
    }),
    address: address.toLowerCase(),
    crypto: {
      ciphertext: ciphertext.toString("hex"),
      cipherparams: {
        iv: iv.toString("hex")
      },
      cipher: cipherAlg,
      kdf: "pbkdf2",
      kdfparams: kdfparams,
      mac: mac
    }
  }
}

/**
 * Gets a private key from a keystore given its password.
 * @param {string} keystore the keystore in json format
 * @param {string} password the password.
 */
export const getPrivateKeyFromKeyStore = (keystore, password) => {

  if (!_.isString(password)) {
    throw new Error("No password given.")
  }

  const json = _.isObject(keystore) ? keystore : JSON.parse(keystore)
  const kdfparams = json.crypto.kdfparams

  if (kdfparams.prf !== "hmac-sha256") {
    throw new Error("Unsupported parameters to PBKDF2")
  }

  const derivedKey = cryp.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, "hex"), kdfparams.c, kdfparams.dklen, "sha256")
  const ciphertext = Buffer.from(json.crypto.ciphertext, "hex")
  const bufferValue = Buffer.concat([derivedKey.slice(16, 32), ciphertext])
  const mac = sha256(bufferValue.toString("hex"))

  if (mac !== json.crypto.mac) {
    throw new Error("Key derivation failed - possibly wrong password")
  }

  const decipher = cryp.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 32), Buffer.from(json.crypto.cipherparams.iv, "hex"))
  const privateKey = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("hex")

  return privateKey
}

/**
 * Generates mnemonic phrase words using random entropy.
 */
export const generateMnemonic = () => bip39.generateMnemonic(MNEMONIC_LEN)

/**
 * Validates mnemonic phrase words.
 * @param {string} mnemonic the mnemonic phrase words
 * @return {bool} validation result
 */
export const validateMnemonic = bip39.validateMnemonic

/**
 * Get a private key from mnemonic words.
 * @param {string} mnemonic the mnemonic phrase words
 * @param {bool} derive derive a private key using the default HD path (default: true)
 * @return {string} hexstring
 */
export const getPrivateKeyFromMnemonic = (mnemonic, derive = true) => {
  if(!bip39.validateMnemonic(mnemonic)){
    throw new Error("wrong mnemonic format")
  }
  const seed = bip39.mnemonicToSeed(mnemonic)
  if (derive) {
    const master = bip32.fromSeed(seed)
    const child = master.derivePath(HDPATH)
    return child.privateKey.toString("hex")
  }
  return seed.toString("hex")
}
