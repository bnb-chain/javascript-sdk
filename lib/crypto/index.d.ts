/**
 * @module crypto
 */
/// <reference types="node" />
import * as bip39 from "bip39";
import { curve } from "elliptic";
export interface KeyStore {
    version: number;
    id: string;
    crypto: {
        ciphertext: string;
        cipherparams: {
            iv: string;
        };
        cipher: string;
        kdf: string;
        kdfparams: {
            dklen: number;
            salt: string;
            c: number;
            prf: string;
        };
        /** Must use sha3 according to web3 secret storage spec. */
        mac: string;
    };
}
/**
 * Decodes an address in bech32 format.
 * @param {string} value the bech32 address to decode
 */
export declare const decodeAddress: (value: string) => Buffer;
/**
 * Checks whether an address is valid.
 * @param {string} address the bech32 address to decode
 * @param {string} hrp the prefix to check for the bech32 address
 * @return {boolean}
 */
export declare const checkAddress: (address: string, hrp: string) => boolean;
/**
 * Encodes an address from input data bytes.
 * @param {string} value the public key to encode
 * @param {*} prefix the address prefix
 * @param {*} type the output type (default: hex)
 */
export declare const encodeAddress: (value: string | Buffer, prefix?: string, type?: BufferEncoding) => string;
/**
 * Generates 32 bytes of random entropy
 * @param {number} len output length (default: 32 bytes)
 * @returns {string} entropy bytes hexstring
 */
export declare const generatePrivateKey: (len?: number) => string;
/**
 * Generates an arrayBuffer filled with random bits.
 * @param {number} length - Length of buffer.
 * @returns {ArrayBuffer}
 */
export declare const generateRandomArray: (length: number) => ArrayBuffer;
/**
 * @param {string} publicKey - Encoded public key
 * @return {Elliptic.PublicKey} public key hexstring
 */
export declare const getPublicKey: (publicKey: string) => curve.base.BasePoint;
/**
 * Calculates the public key from a given private key.
 * @param {string} privateKeyHex the private key hexstring
 * @return {string} public key hexstring
 */
export declare const getPublicKeyFromPrivateKey: (privateKeyHex: string) => string;
/**
 * PubKey performs the point-scalar multiplication from the privKey on the
 * generator point to get the pubkey.
 * @param {Buffer} privateKey
 * @return {Elliptic.PublicKey} PubKey
 * */
export declare const generatePubKey: (privateKey: Buffer) => curve.base.BasePoint;
/**
 * Gets an address from a public key hex.
 * @param {string} publicKeyHex the public key hexstring
 * @param {string} prefix the address prefix
 */
export declare const getAddressFromPublicKey: (publicKeyHex: string, prefix?: string | undefined) => string;
/**
 * Gets an address from a private key.
 * @param {string} privateKeyHex the private key hexstring
 */
export declare const getAddressFromPrivateKey: (privateKeyHex: string, prefix?: string | undefined) => string;
/**
 * Generates a signature (64 byte <r,s>) for a transaction based on given private key.
 * @param {string} signBytesHex - Unsigned transaction sign bytes hexstring.
 * @param {string | Buffer} privateKey - The private key.
 * @return {Buffer} Signature. Does not include tx.
 */
export declare const generateSignature: (signBytesHex: string, privateKey: string | Buffer) => Buffer;
/**
 * Verifies a signature (64 byte <r,s>) given the sign bytes and public key.
 * @param {string} sigHex - The signature hexstring.
 * @param {string} signBytesHex - Unsigned transaction sign bytes hexstring.
 * @param {string} publicKeyHex - The public key.
 * @return {boolean}
 */
export declare const verifySignature: (sigHex: string, signBytesHex: string, publicKeyHex: string) => boolean;
/**
 * Generates a keystore object (web3 secret storage format) given a private key to store and a password.
 * @param {string} privateKeyHex the private key hexstring.
 * @param {string} password the password.
 * @return {object} the keystore object.
 */
export declare const generateKeyStore: (privateKeyHex: string, password: string) => KeyStore;
/**
 * Gets a private key from a keystore given its password.
 * @param {string} keystore the keystore in json format
 * @param {string} password the password.
 */
export declare const getPrivateKeyFromKeyStore: (keystore: string, password: string) => string;
/**
 * Generates mnemonic phrase words using random entropy.
 */
export declare const generateMnemonic: () => string;
/**
 * Validates mnemonic phrase words.
 * @param {string} mnemonic the mnemonic phrase words
 * @return {bool} validation result
 */
export declare const validateMnemonic: typeof bip39.validateMnemonic;
/**
 * Get a private key from mnemonic words.
 * @param {string} mnemonic the mnemonic phrase words
 * @param {Boolean} derive derive a private key using the default HD path (default: true)
 * @param {number} index the bip44 address index (default: 0)
 * @param {string} password according to bip39
 * @return {string} hexstring
 */
export declare const getPrivateKeyFromMnemonic: (mnemonic: string, derive?: boolean, index?: number, password?: string) => string;
