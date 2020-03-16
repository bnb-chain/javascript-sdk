/**
 * @module amino.decode
 */
/// <reference types="node" />
/**
 * js amino UnmarshalBinaryLengthPrefixed
 * @param {Buffer} bytes
 * @param {Object} type
 * @returns {Object}
 *  */
export declare const unMarshalBinaryLengthPrefixed: (bytes: Buffer, type: any) => object;
/**
 * js amino UnmarshalBinaryBare
 * @param {Buffer} bytes
 * @param {Object} type
 * @returns {Object}
 *  */
export declare const unMarshalBinaryBare: (bytes: Buffer, type: any) => object;
export declare const decodeFieldNumberAndTyp3: (bytes: Buffer) => any;
