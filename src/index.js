import * as crypto from './crypto';
import * as amino from './encoder';
import Transaction from './tx';
import HttpRequest from './utils/request';

class BncClient {

   /**
   * @param {string} Binance Chain public url
   */
  constructor(server) {
    if(!server) {
      throw new Error(`Binance chain server should not be null`);
    }

    this.httpClient = new HttpRequest(server);
  }

  async initChain() {
    if(!this.chainId) {
      const data = await this.httpClient.request('get', `/api/v1/node-info`);
      this.chainId = data.node_info && data.node_info.network || 'chain-bnb';
    }
    return this;
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
  async transfer(fromAddress, toAddress, amount, asset, memo) {
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

  async cancelOrder(fromAddress, symbols, orderIds, refids, sequence) {
    const accCode = crypto.decodeAddress(fromAddress);
    const requests = [];
    orderIds.forEach((orderId, index) => {
      const msg = {
        sender: accCode,
        symbol: symbols[index],
        id: orderId,
        refid: refids[index],
        msgType: 'CancelOrderMsg'
      };

      const signMsg = {
        id: orderId,
        refid: refids[index],
        sender: fromAddress,
        symbol: symbols[index]
      };

      requests.push(this.sendTransaction(msg, signMsg, fromAddress, sequence+index, ''));
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
      this.account_number = data.account_number;
    }

    if(!this.account_number){
      const data = await this.httpClient.request('get', `/api/v1/account/${address}`);
      this.account_number = data.account_number;
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
  async sendBatchTransaction(msgs, stdSignMsgs, address, sequence=null, memo='', sync=false ) {
    if(!sequence && address) {
      const data = await this.httpClient.request('get', `/api/v1/account/${address}`);
      sequence = data.sequence;
      this.account_number = data.account_number;
    }

    if(!this.account_number){
      const data = await this.httpClient.request('get', `/api/v1/account/${address}`);
      this.account_number = data.account_number;
    }

    const batchBytes = [];
    
    msgs.forEach((msg, index)=>{
      const options = {
        account_number: parseInt(this.account_number),
        chain_id: this.chainId,
        memo: '',
        msg,
        sequence: parseInt(sequence),
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