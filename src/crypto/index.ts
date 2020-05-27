import bech32 from "bech32"
import * as bip32 from "bip32"
import * as bip39 from "bip39"
import cryp from "crypto-browserify"
import { ec as EC, curve } from "elliptic"
import is from "is_js"
import csprng from "secure-random"
import ecc from "tiny-secp256k1"
import uuid from "uuid"

import { ab2hexstring, sha3, sha256, sha256ripemd160 } from "../utils"

export interface KeyStore {
  version: number
  id: string
  crypto: {
    ciphertext: string
    cipherparams: {
      iv: string
    }
    cipher: string
    kdf: string
    kdfparams: {
      dklen: number
      salt: string
      c: number
      prf: string
    }
    /** Must use sha3 according to web3 secret storage spec. */
    mac: string
  }
}

// secp256k1 privkey is 32 bytes
const PRIVKEY_LEN = 32
const MNEMONIC_LEN = 256
const DECODED_ADDRESS_LEN = 20
const CURVE = "secp256k1"

//hdpath
const HDPATH = "44'/714'/0'/0/"

const ec = new EC(CURVE)

/**
 * Decodes an address in bech32 format.
 * @category crypto
 * @param {string} value the bech32 address to decode
 */
export const decodeAddress = (value: string): Buffer => {
  const decodeAddress = bech32.decode(value)
  return Buffer.from(bech32.fromWords(decodeAddress.words))
}

/**
 * Checks whether an address is valid.
 * @category crypto
 * @param {string} address the bech32 address to decode
 * @param {string} hrp the prefix to check for the bech32 address
 * @return {boolean}
 */
export const checkAddress = (address: string, hrp: string): boolean => {
  try {
    if (!address.startsWith(hrp)) {
      return false
    }

    const decodedAddress = bech32.decode(address)
    const decodedAddressLength = decodeAddress(address).length
    if (
      decodedAddressLength === DECODED_ADDRESS_LEN &&
      decodedAddress.prefix === hrp
    ) {
      return true
    }

    return false
  } catch (err) {
    return false
  }
}

/**
 * Encodes an address from input data bytes.
 * @category crypto
 * @param {string} value the public key to encode
 * @param {*} prefix the address prefix
 * @param {*} type the output type (default: hex)
 */
export const encodeAddress = (
  value: string | Buffer,
  prefix = "tbnb",
  type: BufferEncoding = "hex"
): string => {
  let words
  if (Buffer.isBuffer(value)) {
    words = bech32.toWords(Buffer.from(value))
  } else {
    words = bech32.toWords(Buffer.from(value, type))
  }
  return bech32.encode(prefix, words)
}

/**
 * Generates 32 bytes of random entropy
 * @category crypto
 * @param {number} len output length (default: 32 bytes)
 * @returns {string} entropy bytes hexstring
 */
export const generatePrivateKey = (len: number = PRIVKEY_LEN): string =>
  ab2hexstring(csprng(len))

/**
 * Generates an arrayBuffer filled with random bits.
 * @category crypto
 * @param {number} length - Length of buffer.
 * @returns {ArrayBuffer}
 */
export const generateRandomArray = (length: number): ArrayBuffer =>
  csprng(length)

/**
 * @category crypto
 * @param {string} publicKey - Encoded public key
 * @return {Elliptic.PublicKey} public key hexstring
 */
export const getPublicKey = (publicKey: string) => {
  const keyPair = ec.keyFromPublic(publicKey, "hex")
  return keyPair.getPublic()
}

/**
 * Calculates the public key from a given private key.
 * @category crypto
 * @param {string} privateKeyHex the private key hexstring
 * @return {string} public key hexstring
 */
export const getPublicKeyFromPrivateKey = (privateKeyHex: string): string => {
  if (!privateKeyHex || privateKeyHex.length !== PRIVKEY_LEN * 2) {
    throw new Error("invalid privateKey")
  }
  const curve = new EC(CURVE)
  const keypair = curve.keyFromPrivate(privateKeyHex, "hex")
  const unencodedPubKey = keypair.getPublic().encode("hex", false)
  return unencodedPubKey
}

/**
 * PubKey performs the point-scalar multiplication from the privKey on the
 * generator point to get the pubkey.
 * @category crypto
 * @param {Buffer} privateKey
 * @return {Elliptic.PublicKey} PubKey
 * */
export const generatePubKey = (privateKey: Buffer): curve.base.BasePoint => {
  const curve = new EC(CURVE)
  const keypair = curve.keyFromPrivate(privateKey)
  return keypair.getPublic()
}

/**
 * Gets an address from a public key hex.
 * @category crypto
 * @param {string} publicKeyHex the public key hexstring
 * @param {string} prefix the address prefix
 */
export const getAddressFromPublicKey = (
  publicKeyHex: string,
  prefix?: string
) => {
  const pubKey = ec.keyFromPublic(publicKeyHex, "hex")
  const pubPoint = pubKey.getPublic()
  const compressed = pubPoint.encodeCompressed()
  const hexed = ab2hexstring(compressed)
  const hash = sha256ripemd160(hexed) // https://git.io/fAn8N
  const address = encodeAddress(hash, prefix)
  return address
}

/**
 * Gets an address from a private key.
 * @category crypto
 * @param {string} privateKeyHex the private key hexstring
 * @param {string} prefix the address prefix
 */
export const getAddressFromPrivateKey = (
  privateKeyHex: string,
  prefix?: string
): string => {
  return getAddressFromPublicKey(
    getPublicKeyFromPrivateKey(privateKeyHex),
    prefix
  )
}

/**
 * Generates a signature (64 byte <r,s>) for a transaction based on given private key.
 * @category crypto
 * @param {string} signBytesHex - Unsigned transaction sign bytes hexstring.
 * @param {string | Buffer} privateKey - The private key.
 * @return {Buffer} Signature. Does not include tx.
 */
export const generateSignature = (
  signBytesHex: string,
  privateKey: string | Buffer
): Buffer => {
  const msgHash = sha256(signBytesHex)
  const msgHashHex = Buffer.from(msgHash, "hex")
  const signature = ecc.sign(
    msgHashHex,
    typeof privateKey === "string" ? Buffer.from(privateKey, "hex") : privateKey
  )
  return signature
}

/**
 * Verifies a signature (64 byte <r,s>) given the sign bytes and public key.
 * @category crypto
 * @param {string} sigHex - The signature hexstring.
 * @param {string} signBytesHex - Unsigned transaction sign bytes hexstring.
 * @param {string} publicKeyHex - The public key.
 * @return {boolean}
 */
export const verifySignature = (
  sigHex: string,
  signBytesHex: string,
  publicKeyHex: string
): boolean => {
  const publicKey = Buffer.from(publicKeyHex, "hex")
  if (!ecc.isPoint(publicKey)) throw new Error("Invalid public key provided")
  const msgHash = sha256(signBytesHex)
  const msgHashHex = Buffer.from(msgHash, "hex")
  return ecc.verify(msgHashHex, publicKey, Buffer.from(sigHex, "hex"))
}

/**
 * Generates a keystore object (web3 secret storage format) given a private key to store and a password.
 * @category crypto
 * @param {string} privateKeyHex the private key hexstring.
 * @param {string} password the password.
 * @return {object} the keystore object.
 */
export const generateKeyStore = (
  privateKeyHex: string,
  password: string
): KeyStore => {
  const salt = cryp.randomBytes(32)
  const iv = cryp.randomBytes(16)
  const cipherAlg = "aes-256-ctr"

  const kdf = "pbkdf2"
  const kdfparams = {
    dklen: 32,
    salt: salt.toString("hex"),
    c: 262144,
    prf: "hmac-sha256",
  }

  const derivedKey = cryp.pbkdf2Sync(
    Buffer.from(password),
    salt,
    kdfparams.c,
    kdfparams.dklen,
    "sha256"
  )
  const cipher = cryp.createCipheriv(cipherAlg, derivedKey.slice(0, 32), iv)
  if (!cipher) {
    throw new Error("Unsupported cipher")
  }

  const ciphertext = Buffer.concat([
    cipher.update(Buffer.from(privateKeyHex, "hex")),
    cipher.final(),
  ])
  const bufferValue = Buffer.concat([derivedKey.slice(16, 32), ciphertext])

  return {
    version: 1,
    id: uuid.v4({
      random: cryp.randomBytes(16),
    }),
    crypto: {
      ciphertext: ciphertext.toString("hex"),
      cipherparams: {
        iv: iv.toString("hex"),
      },
      cipher: cipherAlg,
      kdf,
      kdfparams,
      // mac must use sha3 according to web3 secret storage spec
      mac: sha3(bufferValue.toString("hex")),
    },
  }
}

/**
 * Gets a private key from a keystore given its password.
 * @category crypto
 * @param {string} keystore the keystore in json format
 * @param {string} password the password.
 */
export const getPrivateKeyFromKeyStore = (
  keystore: string,
  password: string
): string => {
  if (!is.string(password)) {
    throw new Error("No password given.")
  }

  const json: KeyStore = is.object(keystore) ? keystore : JSON.parse(keystore)
  const kdfparams = json.crypto.kdfparams

  if (kdfparams.prf !== "hmac-sha256") {
    throw new Error("Unsupported parameters to PBKDF2")
  }

  const derivedKey = cryp.pbkdf2Sync(
    Buffer.from(password),
    Buffer.from(kdfparams.salt, "hex"),
    kdfparams.c,
    kdfparams.dklen,
    "sha256"
  )
  const ciphertext = Buffer.from(json.crypto.ciphertext, "hex")
  const bufferValue = Buffer.concat([derivedKey.slice(16, 32), ciphertext])

  // try sha3 (new / ethereum keystore) mac first
  const mac = sha3(bufferValue.toString("hex"))
  if (mac !== json.crypto.mac) {
    // the legacy (sha256) mac is next to be checked. pre-testnet keystores used a sha256 digest for the mac.
    // the sha256 mac was not compatible with ethereum keystores, so it was changed to sha3 for mainnet.
    const macLegacy = sha256(bufferValue.toString("hex"))
    if (macLegacy !== json.crypto.mac) {
      throw new Error(
        "Keystore mac check failed (sha3 & sha256) - wrong password?"
      )
    }
  }

  const decipher = cryp.createDecipheriv(
    json.crypto.cipher,
    derivedKey.slice(0, 32),
    Buffer.from(json.crypto.cipherparams.iv, "hex")
  )
  const privateKey = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("hex")

  return privateKey
}

/**
 * Generates mnemonic phrase words using random entropy.
 * @category crypto
 */
export const generateMnemonic = (): string =>
  bip39.generateMnemonic(MNEMONIC_LEN)

/**
 * Validates mnemonic phrase words.
 * @ignore
 * @param {string} mnemonic the mnemonic phrase words
 * @return {bool} validation result
 */
export const validateMnemonic = bip39.validateMnemonic

/**
 * Get a private key from mnemonic words.
 * @category crypto
 * @param {string} mnemonic the mnemonic phrase words
 * @param {Boolean} derive derive a private key using the default HD path (default: true)
 * @param {number} index the bip44 address index (default: 0)
 * @param {string} password according to bip39
 * @return {string} hexstring
 */
export const getPrivateKeyFromMnemonic = (
  mnemonic: string,
  derive = true,
  index = 0,
  password = ""
): string => {
  if (
    !bip39.validateMnemonic(mnemonic, bip39.wordlists.english) &&
    !bip39.validateMnemonic(mnemonic, bip39.wordlists.chinese_simplified) &&
    !bip39.validateMnemonic(mnemonic, bip39.wordlists.chinese_traditional) &&
    !bip39.validateMnemonic(mnemonic, bip39.wordlists.korean) &&
    !bip39.validateMnemonic(mnemonic, bip39.wordlists.french) &&
    !bip39.validateMnemonic(mnemonic, bip39.wordlists.italian) &&
    !bip39.validateMnemonic(mnemonic, bip39.wordlists.spanish) &&
    !bip39.validateMnemonic(mnemonic, bip39.wordlists.japanese)
  ) {
    throw new Error("wrong mnemonic format")
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic, password)
  if (derive) {
    const master = bip32.fromSeed(seed)
    const child = master.derivePath(HDPATH + index)
    if (!child.privateKey) {
      throw new Error("child does not have a privateKey")
    }

    return child.privateKey.toString("hex")
  }
  return seed.toString("hex")
}
