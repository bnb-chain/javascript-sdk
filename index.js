import * as crypto from './src/crypto/';
import * as amino from './src/encoder/';
import Transaction from './src/tx/';
import HttpRequest from './src/utils/request';

class Bnc {
  constructor(server){
    this.httpClient = new HttpRequest(server);
  }

  async sendTx(tx) {
    const opts = {
      data: tx,
      headers:{ 
        'content-type': 'text/plain',
        'X-Real-Ip': '127.0.0.1',
      }
    };
    const data = await this.httpClient.request('post', '/api/v1/broadcast', null, opts);
    return data;
  }
}

export { crypto, amino, Transaction };

export default Bnc;