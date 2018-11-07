"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.typePrefix = exports.txType = void 0;

var crypto = _interopRequireWildcard(require("../crypto/"));

var encoder = _interopRequireWildcard(require("../encoder/"));

var _varint = require("../encoder/varint");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var txType = {
  MsgSend: 'MsgSend',
  NewOrderMsg: 'NewOrderMsg',
  CancelOrderMsg: 'CancelOrderMsg',
  StdTx: 'StdTx',
  PubKeySecp256k1: 'PubKeySecp256k1',
  SignatureSecp256k1: 'SignatureSecp256k1'
};
exports.txType = txType;
var typePrefix = {
  MsgSend: '2A2C87FA',
  NewOrderMsg: 'CE6DC043',
  CancelOrderMsg: '166E681B',
  StdTx: 'F0625DEE',
  PubKeySecp256k1: 'EB5AE987',
  SignatureSecp256k1: '7FC4A495'
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
   * };
   * var tx = new Transaction(rawTx);
   * @property {Buffer} raw The raw vstruct encoded transaction
   * @param {number} data.account_number account number
   * @param {string} data.chain_id bnbChain Id
   * @param {string} data.memo transaction memo
   * @param {string} type transaction type
   * @param {object} data.msg object data of tx type
   * @param {number} data.sequence transaction counts
   * */

};
exports.typePrefix = typePrefix;

var Transaction =
/*#__PURE__*/
function () {
  function Transaction(data) {
    _classCallCheck(this, Transaction);

    if (!txType[data.type]) {
      throw new TypeError("does not support transaction type: ".concat(data.type));
    }

    data = data || {};
    this.type = data.type;
    this.sequence = data.sequence || 0;
    this.account_number = data.account_number || 0;
    this.chain_id = data.chain_id || 'bnbchain-1000';
    this.msgs = data.msg ? [data.msg] : [];
    this.fee = {
      "amount": [{
        "denom": "",
        "amount": "0"
      }],
      "gas": 200000
    };
    this.memo = data.memo;
  }
  /**
   * serializes a public key in a 33-byte compressed format.
   * @param {hex string} privateKey 
   * @return {Buffer}
   */


  _createClass(Transaction, [{
    key: "serializePubKey",
    value: function serializePubKey(privateKey) {
      var unencodedPubKey = crypto.generatePubKey(privateKey);
      var format = 0x2;

      if (unencodedPubKey.y && unencodedPubKey.y.isOdd()) {
        format |= 0x1;
      }

      var pubKey = Buffer.concat([_varint.UVarInt.encode(format), Buffer.from(unencodedPubKey.x.toString('hex'), 'hex')]); //prefixed with length;

      return encoder.encodeBinaryByteArray(pubKey);
    }
    /**
     * sign transaction with a given private key and msg
     * @param {string} privateKey
     * @param {Object} concrete msg object
     **/

  }, {
    key: "sign",
    value: function sign(privateKey, msg) {
      if (!msg) {
        throw new Error("msg should be an object");
      }

      var signMsg = {
        "account_number": this.account_number.toString(),
        "chain_id": this.chain_id,
        // "fee": {
        //   "amount": [{
        //     "amount": "0",
        //     "denom": ""
        //   }],
        //   "gas": "200000"
        // },
        "memo": this.memo,
        "msgs": [msg],
        "sequence": this.sequence.toString()
      };
      var signMsgBytes = encoder.convertObjectToBytes(signMsg);
      var signature = crypto.generateSignature(signMsgBytes.toString('hex'), privateKey);
      var pub_key = this.serializePubKey(privateKey);
      this.signatures = [{
        pub_key: Buffer.concat([Buffer.from('EB5AE987', 'hex'), pub_key]),
        signature: signature,
        account_number: this.account_number,
        sequence: this.sequence
      }];
      this.sig = signature.toString('hex');
      return this;
    }
    /**
     * encode signed transaction to hex which is compatible with amino
     * @param {object} opts msg field
     */

  }, {
    key: "serialize",
    value: function serialize() {
      if (!this.signatures) {
        throw new Error("need signature");
      }

      var msg = this.msgs[0];
      msg = Object.assign({
        version: 0x1
      }, msg);
      var stdTx = {
        msg: [msg],
        fee: this.fee,
        signatures: this.signatures,
        memo: this.memo,
        msgType: txType.StdTx
      };
      var bytes = encoder.marshalBinary(stdTx);
      return bytes.toString('hex');
    }
  }]);

  return Transaction;
}();

Transaction.txType = txType;
Transaction.typePrefix = typePrefix;
var _default = Transaction;
exports.default = _default;