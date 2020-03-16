/**
 * @module amino.encode
 */
/// <reference types="node" />
/**
 * encode number
 * @param num
 */
export declare const encodeNumber: (num: number) => any;
/**
 * encode bool
 * @param b
 */
export declare const encodeBool: (b: boolean) => any;
/**
 * encode string
 * @param str
 */
export declare const encodeString: (str: string) => typeof Buffer;
/**
 * encode time
 * @param value
 */
export declare const encodeTime: (value: string | Date) => Buffer;
/**
 * @param obj -- {object}
 * @return bytes {Buffer}
 */
export declare const convertObjectToSignBytes: (obj: any) => Buffer;
/**
 * js amino MarshalBinary
 * @param {Object} obj
 *  */
export declare const marshalBinary: (obj: any) => any;
/**
 * js amino MarshalBinaryBare
 * @param {Object} obj
 *  */
export declare const marshalBinaryBare: (obj: any) => any;
/**
 * This is the main entrypoint for encoding all types in binary form.
 * @param {*} js data type (not null, not undefined)
 * @param {Number} field index of object
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} binary of object.
 */
export declare const encodeBinary: (val: any, fieldNum?: number | undefined, isByteLenPrefix?: boolean | undefined) => any;
/**
 * prefixed with bytes length
 * @param {Buffer} bytes
 * @return {Buffer} with bytes length prefixed
 */
export declare const encodeBinaryByteArray: (bytes: Buffer) => Buffer;
/**
 *
 * @param {Object} obj
 * @return {Buffer} with bytes length prefixed
 */
export declare const encodeObjectBinary: (obj: any, isByteLenPrefix?: boolean | undefined) => Buffer;
/**
 * @param {Number} fieldNum object field index
 * @param {Array} arr
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} bytes of array
 */
export declare const encodeArrayBinary: (fieldNum: number | undefined, arr: any[], isByteLenPrefix?: boolean | undefined) => Buffer;
