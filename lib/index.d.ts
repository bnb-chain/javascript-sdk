/// <reference types="node" />
import * as client from "./client";
import * as crypto from "./crypto";
import * as utils from "./utils";
import * as types from "./types";
import rpc from "./rpc/client";
import ledger from "./ledger";
import Transaction from "./tx";
import "../src/declarations";
declare const BncClient: typeof client.BncClient;
declare const amino: {
    unMarshalBinaryLengthPrefixed: (bytes: Buffer, type: any) => object;
    unMarshalBinaryBare: (bytes: Buffer, type: any) => object;
    decodeFieldNumberAndTyp3: (bytes: Buffer) => any;
    encodeNumber: (num: number) => any;
    encodeBool: (b: boolean) => any;
    encodeString: (str: string) => typeof Buffer;
    encodeTime: (value: string | Date) => Buffer;
    convertObjectToSignBytes: (obj: any) => Buffer;
    marshalBinary: (obj: any) => any;
    marshalBinaryBare: (obj: any) => any;
    encodeBinary: (val: any, fieldNum?: number | undefined, isByteLenPrefix?: boolean | undefined) => any;
    encodeBinaryByteArray: (bytes: Buffer) => Buffer;
    encodeObjectBinary: (obj: any, isByteLenPrefix?: boolean | undefined) => Buffer;
    encodeArrayBinary: (fieldNum: number | undefined, arr: any[], isByteLenPrefix?: boolean | undefined) => Buffer;
};
export { Transaction, crypto, amino, utils, ledger, rpc, types };
export default BncClient;
