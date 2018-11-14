import * as crypto from '../crypto/';
import * as encoder from '../encoder/';
import { UVarInt } from '../encoder/varint';

export const txType = {
  MsgSend: 'MsgSend',
  NewOrderMsg: 'NewOrderMsg',
  CancelOrderMsg: 'CancelOrderMsg',
  StdTx: 'StdTx',
  PubKeySecp256k1: 'PubKeySecp256k1',
  SignatureSecp256k1: 'SignatureSecp256k1',
}

export const typePrefix = {
  MsgSend: '2A2C87FA',
  NewOrderMsg: 'CE6DC043',
  CancelOrderMsg: '166E681B',
  StdTx: 'F0625DEE',
  PubKeySecp256k1: 'EB5AE987',
  SignatureSecp256k1: '7FC4A495',
}

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
class Transaction {
  constructor(data) {
    if(!txType[data.type]) {
      throw new TypeError(`does not support transaction type: ${data.type}`);
    }

    if(!data.chain_id){
      throw new Error('chain id should not be null');
    }

    data = data || {};

    this.type = data.type;
    this.sequence = data.sequence || 0;
    this.account_number = data.account_number || 0;
    this.chain_id = data.chain_id;
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
  serializePubKey(privateKey){
    let unencodedPubKey = crypto.generatePubKey(privateKey);
    let format = 0x2;
    if(unencodedPubKey.y && unencodedPubKey.y.isOdd()){
      format |= 0x1;
    }

    const pubKey = Buffer.concat([
      UVarInt.encode(format), 
      unencodedPubKey.x.toArrayLike(Buffer, 'be', 32)
    ]);

    //prefixed with length;
    return encoder.encodeBinaryByteArray(pubKey);
  }

  /**
   * sign transaction with a given private key and msg
   * @param {string} privateKey
   * @param {Object} concrete msg object
   **/
  sign(privateKey, msg) {
    if(!msg){
      throw new Error(`msg should be an object`);
    }

    const signMsg = {
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

    const signMsgBytes = encoder.convertObjectToBytes(signMsg);
    const signature = crypto.generateSignature(signMsgBytes.toString('hex'), privateKey);
    const pub_key = this.serializePubKey(privateKey);
    this.signatures = [{
      pub_key: Buffer.concat([Buffer.from('EB5AE987', 'hex'), pub_key]),
      signature: signature,
      account_number: this.account_number,
      sequence: this.sequence,
    }];
    this.sig = signature.toString('hex');
    return this;
  }

  /**
   * encode signed transaction to hex which is compatible with amino
   * @param {object} opts msg field
   */
  serialize(){
    if(!this.signatures){
      throw new Error(`need signature`);
    }

    let msg = this.msgs[0];
    // msg = Object.assign({ version: 0x1 }, msg);

    const stdTx = {
      msg: [msg],
      // fee: this.fee,
      signatures: this.signatures,
      memo: this.memo,
      msgType: txType.StdTx
    };

    const bytes = encoder.marshalBinary(stdTx);
    return bytes.toString('hex');
  }
}

Transaction.txType = txType;
Transaction.typePrefix = typePrefix;

export default Transaction;