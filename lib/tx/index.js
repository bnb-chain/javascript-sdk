"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var crypto = tslib_1.__importStar(require("../crypto"));
var encoder = tslib_1.__importStar(require("../encoder"));
var varint_1 = require("../encoder/varint");
var stdTx_1 = require("../types/stdTx");
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
var Transaction = /** @class */ (function () {
    function Transaction(data) {
        data = data || {};
        if (!data.chainId) {
            throw new Error("chain id should not be null");
        }
        this.sequence = data.sequence || 0;
        this.account_number = data.accountNumber || 0;
        this.chain_id = data.chainId;
        this.msg = data.msg;
        this.baseMsg = data.baseMsg;
        this.memo = data.memo;
        this.source = data.source || 0; // default value is 0
        this.signatures = [];
    }
    /**
     * generate the sign bytes for a transaction, given a msg
     * @param {SignMsg} concrete msg object
     * @return {Buffer}
     **/
    Transaction.prototype.getSignBytes = function (msg) {
        msg = msg || (this.baseMsg && this.baseMsg.getSignMsg());
        var signMsg = {
            account_number: this.account_number.toString(),
            chain_id: this.chain_id,
            data: null,
            memo: this.memo,
            msgs: [msg],
            sequence: this.sequence.toString(),
            source: this.source.toString()
        };
        return encoder.convertObjectToSignBytes(signMsg);
    };
    /**
     * attaches a signature to the transaction
     * @param {Elliptic.PublicKey} pubKey
     * @param {Buffer} signature
     * @return {Transaction}
     **/
    Transaction.prototype.addSignature = function (pubKey, signature) {
        var pubKeyBuf = this._serializePubKey(pubKey); // => Buffer
        this.signatures = [
            {
                pub_key: pubKeyBuf,
                signature: signature,
                account_number: this.account_number,
                sequence: this.sequence
            }
        ];
        return this;
    };
    /**
     * sign transaction with a given private key and msg
     * @param {string} privateKey private key hex string
     * @param {SignMsg} concrete msg object
     * @return {Transaction}
     **/
    Transaction.prototype.sign = function (privateKey, msg) {
        if (!privateKey) {
            throw new Error("private key should not be null");
        }
        var signBytes = this.getSignBytes(msg);
        var privKeyBuf = Buffer.from(privateKey, "hex");
        var signature = crypto.generateSignature(signBytes.toString("hex"), privKeyBuf);
        this.addSignature(crypto.generatePubKey(privKeyBuf), signature);
        return this;
    };
    /**
     * encode signed transaction to hex which is compatible with amino
     */
    Transaction.prototype.serialize = function () {
        if (!this.signatures) {
            throw new Error("need signature");
        }
        var msg = this.msg || (this.baseMsg && this.baseMsg.getMsg());
        var stdTx = {
            msg: [msg],
            signatures: this.signatures,
            memo: this.memo,
            source: this.source,
            data: "",
            aminoPrefix: stdTx_1.TxAminoPrefix.StdTx
        };
        var bytes = encoder.marshalBinary(stdTx);
        return bytes.toString("hex");
    };
    /**
     * serializes a public key in a 33-byte compressed format.
     * @param {Elliptic.PublicKey} unencodedPubKey
     * @return {Buffer}
     */
    Transaction.prototype._serializePubKey = function (unencodedPubKey) {
        var format = 0x2;
        var y = unencodedPubKey.getY();
        var x = unencodedPubKey.getX();
        if (y && y.isOdd()) {
            format |= 0x1;
        }
        var pubBz = Buffer.concat([
            varint_1.UVarInt.encode(format),
            x.toArrayLike(Buffer, "be", 32)
        ]);
        // prefixed with length
        pubBz = encoder.encodeBinaryByteArray(pubBz);
        // add the amino prefix
        pubBz = Buffer.concat([Buffer.from("EB5AE987", "hex"), pubBz]);
        return pubBz;
    };
    return Transaction;
}());
// Transaction.TxTypes = TxTypes
// Transaction.TypePrefixes = TypePrefixes
// DEPRECATED: Retained for backward compatibility
// Transaction.txType = TxTypes
// Transaction.typePrefix = TypePrefixes
exports.default = Transaction;
//# sourceMappingURL=index.js.map