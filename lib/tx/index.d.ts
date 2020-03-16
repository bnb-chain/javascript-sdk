/// <reference types="node" />
import { curve } from "elliptic";
import { SignMsg } from "../types/msg";
import { StdSignMsg } from "../types/stdTx";
/**
 * Creates a new transaction object.
 * @example
 * var rawTx = {
 *   account_number: 1,
 *   chain_id: 'bnbchain-1000',
 *   memo: '',
 *   msg: {},
 *   type: 'NewOrderMsg',
 *   sequence: 29,
 *   source: 0
 * };
 * var tx = new Transaction(rawTx);
 * @property {Buffer} raw The raw vstruct encoded transaction
 * @param {Number} data.account_number account number
 * @param {String} data.chain_id bnbChain Id
 * @param {String} data.memo transaction memo
 * @param {String} type transaction type
 * @param {Msg} data.msg object data of tx type
 * @param {Number} data.sequence transaction counts
 * @param {Number} data.source where does this transaction come from
 */
declare class Transaction {
    private sequence;
    private account_number;
    private chain_id;
    private msg?;
    private baseMsg?;
    private memo;
    private source;
    private signatures;
    constructor(data: StdSignMsg);
    /**
     * generate the sign bytes for a transaction, given a msg
     * @param {SignMsg} concrete msg object
     * @return {Buffer}
     **/
    getSignBytes(msg?: SignMsg): Buffer;
    /**
     * attaches a signature to the transaction
     * @param {Elliptic.PublicKey} pubKey
     * @param {Buffer} signature
     * @return {Transaction}
     **/
    addSignature(pubKey: curve.base.BasePoint, signature: Buffer): this;
    /**
     * sign transaction with a given private key and msg
     * @param {string} privateKey private key hex string
     * @param {SignMsg} concrete msg object
     * @return {Transaction}
     **/
    sign(privateKey: string, msg?: SignMsg): this;
    /**
     * encode signed transaction to hex which is compatible with amino
     */
    serialize(): string;
    /**
     * serializes a public key in a 33-byte compressed format.
     * @param {Elliptic.PublicKey} unencodedPubKey
     * @return {Buffer}
     */
    _serializePubKey(unencodedPubKey: curve.base.BasePoint): Buffer;
}
export default Transaction;
