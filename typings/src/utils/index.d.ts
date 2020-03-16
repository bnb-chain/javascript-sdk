/**
 * @module utils
 */
/**
 * @param {arrayBuffer} buf
 * @returns {string} ASCII string
 */
export declare const ab2str: (buf: Uint8Array) => void;
/**
 * @param {string} str - ASCII string
 * @returns {arrayBuffer}
 */
export declare const str2ab: (str: string) => Uint8Array;
/**
 * @param {string} str - HEX string
 * @returns {number[]}
 */
export declare const hexstring2ab: (str: string) => Uint8Array;
/**
 * @param {arrayBuffer} arr
 * @returns {string} HEX string
 */
export declare const ab2hexstring: (arr: any) => string;
/**
 * @param {string} str - ASCII string
 * @returns {string} HEX string
 */
export declare const str2hexstring: (str: string) => string;
/**
 * @param {string} hexstring - HEX string
 * @returns {string} ASCII string
 */
export declare const hexstring2str: (hexstring: string) => void;
/**
 * convert an integer to big endian hex and add leading zeros
 * @param {Number} num
 * @returns {string}
 */
export declare const int2hex: (num: number) => string;
/**
 * Converts a number to a big endian hexstring of a suitable size, optionally little endian
 * @param {Number} num
 * @param {Number} size - The required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1.
 * @param {Boolean} littleEndian - Encode the hex in little endian form
 * @return {string}
 */
export declare const num2hexstring: (num: number, size?: number, littleEndian?: boolean) => string;
/**
 * Converts a number to a variable length Int. Used for array length header
 * @param {Number} num - The number
 * @returns {string} hexstring of the variable Int.
 */
export declare const num2VarInt: (num: number) => string;
/**
 * XORs two hexstrings
 * @param {string} str1 - HEX string
 * @param {string} str2 - HEX string
 * @returns {string} XOR output as a HEX string
 */
export declare const hexXor: (str1: string, str2: string) => string;
/**
 * Reverses an array. Accepts arrayBuffer.
 * @param {Array} arr
 * @returns {Uint8Array}
 */
export declare const reverseArray: (arr: any[]) => Uint8Array;
/**
 * Reverses a HEX string, treating 2 chars as a byte.
 * @example
 * reverseHex('abcdef') = 'efcdab'
 * @param {string} hex - HEX string
 * @return {string} HEX string reversed in 2s.
 */
export declare const reverseHex: (hex: string) => string;
/**
 * Checks if input is a hexstring. Empty string is considered a hexstring.
 * @example
 * isHex('0101') = true
 * isHex('') = true
 * isHex('0x01') = false
 * @param {string} str
 * @return {boolean}
 */
export declare const isHex: (str: string) => boolean;
/**
 * Throws an error if input is not hexstring.
 * @param {string} str
 */
export declare const ensureHex: (str: string) => void;
/**
 * Computes a SHA256 followed by a RIPEMD160.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */
export declare const sha256ripemd160: (hex: string) => string;
/**
 * Computes a single SHA256 digest.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */
export declare const sha256: (hex: string) => string;
/**
 * Computes a single SHA3 (Keccak) digest.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */
export declare const sha3: (hex: string) => string;
/**
 * Computes sha256 of random number and timestamp
 * @param {String} randomNumber
 * @param {Number} timestamp
 * @returns {string} sha256 result
 */
export declare const calculateRandomNumberHash: (randomNumber: string, timestamp: number) => string;
/**
 * Computes swapID
 * @param {String} randomNumberHash
 * @param {String} sender
 * @param {String} senderOtherChain
 * @returns {string} sha256 result
 */
export declare const calculateSwapID: (randomNumberHash: string, sender: string, senderOtherChain: string) => string;
