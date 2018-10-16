import * as crypto from './src/crypto/';
import * as amino from './src/encoder/';
import Transaction from './src/tx/';
import HttpRequest from './src/utils/request';

class Bnc {
  constructor(server){
    this.httpClient = new HttpRequest(server);
  }

  async sendTx(tx) {
    const data = await this.httpClient.request('post', '/api/v1/broadcast', {tx});
    return data;
  }
}

Bnc.crypto = crypto;
Bnc.amino = amino;
Bnc.Transaction = Transaction;

export default Bnc;