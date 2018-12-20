import * as crypto from './crypto';
import * as amino from './encoder';
import Transaction from './tx';
import HttpRequest from './utils/request';

const sortFieldSequence = (obj) => {
  if (!obj) return { };
  const result = {};
  const sortedKeys = Object.keys(obj).sort();
  sortedKeys.map((key) => {
    if(key !== 'msgType') {
      result[key] = obj[key];
    }
  });
  return result;
};

class BncClient {

   /**
   * @param {string} Binance Chain url
   * @param {String} privateKey
   * @param {String} chainId
   * @param {Number} account_number
   */
  constructor(options) {
    if(!options) {
      throw new Error(`options should not be null`);
    }

    if(!options.server) {
      throw new Error(`Binance chain server should not be null`);
    }

    this.httpClient = new HttpRequest(options.server);
    this.account_number = options.account_number;
    this.chainId = options.chainId || 'chain-bnb';
  }

  setPrivateKey(privateKey) {
    this.privateKey = privateKey;
    return this;
  }

   /**
   * 
   * @param {String} fromAddress 
   * @param {String} toAddress 
   * @param {Number} amount 
   * @param {String} asset 
   * @param {String} memo 
   */
  async transfer(fromAddress, toAddress, amount, asset, memo){
    const accCode = crypto.decodeAddress(fromAddress);
    const toAccCode = crypto.decodeAddress(toAddress);

    const coin = {
      denom: asset,
      amount: amount,
    };
  
    const msg = {
      inputs: [{
        address: accCode,
        coins: [coin]
      }],
      outputs: [{
        address: toAccCode,
        coins: [coin]
      }], 
      msgType: 'MsgSend'
    };
  
    const signMsg = {
      inputs: [{
        address: fromAddress,
        coins: [{
          amount: amount.toString(),
          denom: asset
        }]
      }],
      outputs: [{
        address: toAddress,
        coins: [{
          amount: amount.toString(),
          denom: asset
        }]
      }]
    };

    return await this.sendTransaction(msg, signMsg, fromAddress, null, memo, true);
  }

  async cancelOrder(fromAddress, symbol, orderIds, refids, sequence) {
    const accCode = crypto.decodeAddress(fromAddress);
    const requests = [];
    orderIds.forEach((orderId, index) => {
      msg = {
        sender: accCode,
        symbol,
        id: orderId,
        refid: refids[index],
        msgType: 'CancelOrderMsg'
      };

      signMsg = {
        id: orderId,
        refid: refids[index],
        sender: fromAddress,
        symbol
      };

      requests.push(this.sendTransaction(msg, signMsg, fromAddress, sequence, ''));
    });

    return await Promise.all(requests);
  }

  /**
   * placeOrder
   * @param {String} address
   * @param {String} symbol
   * @param {String} side
   * @param {Number} price
   * @param {Number} quantity
   * @param {Number} sequence
   */
  async placeOrder(address, symbol, side, price, quantity, sequence) {
    const accCode = crypto.decodeAddress(address);

    const placeOrderMsg = {
      sender: accCode,
      id: `${accCode.toString('hex')}-${sequence+1}`.toUpperCase(),
      symbol: symbol,
      ordertype: 2,
      side,
      price: Math.floor(price * 100000000),
      quantity: Math.floor(quantity * 100000000),
      timeinforce: 1,
      msgType: 'NewOrderMsg',
    };

    const signMsg = {
      id: placeOrderMsg.id,
      ordertype: placeOrderMsg.ordertype,
      price: placeOrderMsg.price,
      quantity: placeOrderMsg.quantity,
      sender: address,
      side: placeOrderMsg.side,
      symbol: placeOrderMsg.symbol,
      timeinforce: 1,
    };

    return await this.sendTransaction(placeOrderMsg, signMsg, address, sequence, '', true);
  }

  /**
   * send single transaction to binance chain
   * @param {Object} concrete msg type
   * @param {Object} stdSignMsg
   * @param {String} address
   * @param {Number} sequence
   * @param {String} memo
   * @param {Boolean} sync 
   * @return {Object} response (success or fail)
   */
  async sendTransaction(msg, stdSignMsg, address, sequence=null, memo='', sync=false ){
    if(!sequence && address) {
      const data = await this.httpClient.request('get', `/api/v1/account/${address}`);
      sequence = data.sequence;
    }

    const options = {
      account_number: parseInt(this.account_number),
      chain_id: this.chainId,
      memo: memo,
      msg,
      sequence: parseInt(sequence),
      type: msg.msgType,
    };

    const tx = new Transaction(options);

    const txBytes = tx.sign(this.privateKey, stdSignMsg).serialize();
    console.log(txBytes);
    return await this.sendTx(txBytes, sync);
  }

  /**
   * send multiple transaction to binance chain
   * @param {Array} concrete msg type array
   * @param {Array} signature msg array
   * @param {Boolean} sync
   * @param {Number} sequence
   * @return {Object} send transaction response(success or fail)
   */
  async sendBatchTransaction(msgs, signMsgs, sync=false, sequence=null) {
    if (sequence === null) {
      // TODO: fetch sequence from API
    }

    const batchBytes = [];
    
    msgs.forEach((msg, index)=>{
      const options = {
        account_number: parseInt(this.account_number),
        chain_id: this.chainId,
        memo: '',
        msg,
        sequence: parseInt(this.sequence),
        type: msg.msgType,
      };
  
      const tx = new Transaction(options);
  
      const txBytes = tx.sign(this.privateKey, signMsgs[index]).serialize();
      batchBytes.push(txBytes);
    });
    
    return await this.sendTx(batchBytes.join(','), sync);
  }

  async sendTx(tx, sync=true) {
    const opts = {
      data: tx,
      headers: { 
        'content-type': 'text/plain',
      }
    };
    const data = await this.httpClient.request('post', `/api/v1/broadcast?sync=${sync}`, null, opts);
    return data;
  }
}

export { crypto, amino, Transaction };

export default BncClient;