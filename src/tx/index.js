import * as crypto from '../crypto/';
import * as encoder from '../encoder/';

const txType = {
  MsgSend: 'MsgSend',
  NewOrderMsg: 'NewOrderMsg',
  CancelOrderMsg: 'CancelOrderMsg',
  StdTx: 'StdTx'
}

const typePrefix = {
  MsgSend: '2A2C87FA',
  NewOrderMsg: 'CE6DC043',
  CancelOrderMsg: '166E681B',
  StdTx: 'F0625DEE'
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

    data = data || {};

    //add specified version field to msg
    data.msg = data.msg || {};
    data.msg.version = 0x01;

    this.type = data.type;
    this.sequence = data.sequence || 0;
    this.account_number = data.account_number || 0;
    this.chain_id = data.chain_id || 'bnbchain-1000';
    this.msgs = data.msg ? [data.msg] : [];
    this.fee = data.fee ? data.fee : {};
    this.memo = data.memo;
  }

  /**
   * sign transaction with a given private key
   * @param {string} privateKey
   **/
  sign(privateKey) {
    const msg = this.msgs.length > 0 ? this.msgs[0] : {};
    const signMsg = {
      account_number: this.account_number,
      chain_id: this.chain_id,
      fee: encoder.convertObjectToBytes(this.fee),
      memo: this.memo,
      msgs: encoder.convertObjectToBytes(msg),
      sequence: this.sequence
    };
    const signMsgBytes = encoder.convertObjectToBytes(signMsg);
    const signature = crypto.generateSignature(signMsgBytes.toString('hex'), privateKey);
    this.signatures = [{
      account_number: this.account_number,
      sequence: this.sequence,
      signature
    }];
    return this;
  }

  /**
   * encode signed transaction to hex which is compatible with amino 
   */
  serialize(){
    if(!this.signatures){
      throw new Error(`need signature`);
    }

    const stdTx = {
      msg: this.msgs,
      fee: this.fee,
      signatures: this.signatures,
      memo: this.memo
    }

    const bytes = encoder.marshalBinary(stdTx);
    return bytes.toString('hex');
  }
}

Transaction.txType = txType;
Transaction.typePrefix = typePrefix;

export default Transaction;