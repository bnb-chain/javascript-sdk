import Tx, { txType } from '../src/tx';
import * as crypto from '../src/crypto';

const signature = '7fc4a495473045022100be9e9777b989e0d2bb37d47c056a2c17a631031f3d9a5887d8f7360e162c7e280220311fe25968b17ae66e940ce7b304aa58d74d9bdf09ce0c5e758925c6acd6a68f';

const txObj = {
  "account_number": 0,
  "chain_id": "test-chain-n4b735",
  "fee": {
    "amount": [{
      "denom": "",
      "amount": 0
    }],
    "gas": 200000
  },
  "memo": "",
  "msgs": [{
    version: 1,
    sender: crypto.decodeAddress("cosmosaccaddr1wqrn76z0v36pr3vx3sgue4y5rv4pzpu6ffnjj0"),
    "id": "70073F684F647411C5868C11CCD4941B2A11079A-6",
    "symbol": "NNB_BNB",
    "ordertype": 2,
    "side": 1,
    "price": 600000000,
    "quantity": 1497869700,
    "timeinforce": 1,
    "msgType": 'NewOrderMsg'
  }],
  "sequence": 5,
  type: 'NewOrderMsg'
}

describe('Transaction', () => {
  it('signAndEncode', () => {
    const tx = new Tx(txObj);
    const pk = '897f4cfd1bf7f3d58e1037843d289c7ad42067ce79517d594b3dc4596f2b65ff';
    // const pub_key = 'AsJ+V9rl0ns7dZ/BSjKtfQ7t9h32DJ8EJev+qD78EnQq';
    const encodeTXString = tx.sign(pk).serialize();
    expect(tx.sig).toBe(signature);
    console.log(encodeTXString);
  })
});