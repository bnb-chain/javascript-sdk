import * as crypto from './crypto';
import * as amino from './encoder';
import Transaction from './tx';
import HttpRequest from './utils/request';

const api = {
  broadcast: '/api/v1/broadcast',
  nodeInfo: '/api/v1/node-info',
  getAccount: '/api/v1/account'
}

class BncClient {

   /**
   * @param {string} Binance Chain public url
   */
  constructor(server) {
    if(!server) {
      throw new Error(`Binance chain server should not be null`);
    }

    this._httpClient = new HttpRequest(server);
  }

  async initChain() {
    if(!this.chainId) {
      const data = await this._httpClient.request('get', api.nodeInfo);
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
    amount = amount * Math.pow(10, 8);

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

    return await this._sendTransaction(msg, signMsg, fromAddress, null, memo, true);
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

      requests.push(this._sendTransaction(msg, signMsg, fromAddress, sequence+index, ''));
    });

    return Promise.all(requests);
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

    if(!sequence){
      const data = await this._httpClient.request('get', `${api.getAccount}/${address}`);
      sequence = data.sequence;
      console.log(data);
    }

    const placeOrderMsg = {
      sender: accCode,
      id: `${accCode.toString('hex')}-${sequence+1}`.toUpperCase(),
      symbol: symbol,
      ordertype: 2,
      side,
      price: Math.floor(price * Math.pow(10, 8)),
      quantity: Math.floor(quantity * Math.pow(10, 8)),
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

    return await this._sendTransaction(placeOrderMsg, signMsg, address, sequence, '', true);
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
  async _sendTransaction(msg, stdSignMsg, address, sequence=null, memo='', sync=false ){
    if(!sequence && address) {
      const data = await this._httpClient.request('get', `/api/v1/account/${address}`);
      sequence = data.sequence;
      this.account_number = data.account_number;
    }

    if(!this.account_number){
      const data = await this._httpClient.request('get', `/api/v1/account/${address}`);
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
    return await this._sendTx(txBytes, sync);
  }

  /**
   * send multiple transaction to binance chain
   * @param {Array} concrete msg type array
   * @param {Array} signature msg array
   * @param {Boolean} sync
   * @param {Number} sequence
   * @return {Object} send transaction response(success or fail)
   */
  async _sendBatchTransaction(msgs, stdSignMsgs, address, sequence=null, memo='', sync=false ) {
    if(!sequence && address) {
      const data = await this._httpClient.request('get', `/api/v1/account/${address}`);
      sequence = data.sequence;
      this.account_number = data.account_number;
    }

    if(!this.account_number){
      const data = await this._httpClient.request('get', `/api/v1/account/${address}`);
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

      const txBytes = tx.sign(this.privateKey, stdSignMsgs[index]).serialize();
    });

    return await this._sendTx(batchBytes.join(','), sync);
  }

  async _sendTx(tx, sync=true) {
    const opts = {
      data: tx,
      headers: {
        'content-type': 'text/plain',
      }
    }
    const data = await this._httpClient.request('post', `${api.broadcast}?sync=${sync}`, null, opts);
    return data;
  }

  /**
   * get balance
   * @param {String} address 
   */
  async getBalance(address) {
    if(!address) {
      throw new Error(`address should not be null`);
    }

    try {
      const data = await this._httpClient.request('get', `${api.getAccount}/${address}`);
      return data.balances;
    } catch(err) {
      return 0;
    }
  }

  /**
   * 
   * @return {Object} 
   * {
   *  address,
   *  privateKey
   * }
   */
  createAccount() {
    const privateKey = crypto.generatePrivateKey();
    return {
      privateKey,
      address: crypto.getAddressFromPrivateKey(privateKey)
    }
  }

  /**
   * 
   * @param {String} password 
   *  {
   *  privateKey,
   *  address,
   *  keystore
   * }
   */
  createAccountWithKeystore(password){
    if(!password){
      throw new Error(`password should not be null`);
    }

    const privateKey = crypto.generatePrivateKey();
    const address = crypto.getAddressFromPrivateKey(privateKey);
    const keystore = crypto.generateKeyStore(privateKey, password);
    return {
      privateKey,
      address,
      keystore
    }
  }

  /**
   * @return {Object}
   * {
   *  privateKey,
   *  address,
   *  mnemonic
   * }
   */
  createAccountWithMneomnic() {
    const mnemonic = crypto.generateMnemonic();
    const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
    const address = crypto.getAddressFromPrivateKey(privateKey);
    return {
      privateKey,
      address,
      mnemonic
    }
  }

}

export { crypto, amino, Transaction };

export default BncClient;