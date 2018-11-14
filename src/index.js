import * as crypto from './crypto';
import * as amino from './encoder';
import Transaction from './tx';
import HttpRequest from './utils/request';

class Bnc {
  constructor(server){
    this.httpClient = new HttpRequest(server);
  }

  async sendTx(tx, sync) {
    const opts = {
      data: tx,
      headers:{ 
        'content-type': 'text/plain',
      }
    };
    const data = await this.httpClient.request('post', `/api/v1/broadcast?sync=${sync}`, null, opts);
    return data;
  }
}

export { crypto, amino, Transaction };

export default Bnc;