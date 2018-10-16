import Tx, { txType } from '../src/tx';

const txObj = {
  "account_number": "2",
  "chain_id": "bnbchain-1000",
  "fee": {
    "amount": [{
      "amount": "0",
      "denom": ""
    }],
    "gas": "0"
  },
  "memo": "",
  "msgs": [{
    "id": "cosmosaccaddr173hyu6dtfkrj9vujjhvz2ayehrng64rxq3h4yp-46",
    "ordertype": 2,
    "price": 1,
    "quantity": 1,
    "sender": "cosmosaccaddr173hyu6dtfkrj9vujjhvz2ayehrng64rxq3h4yp",
    "side": 1,
    "symbol": "XYZ_BNB",
    "timeinforce": 1
  }],
  "sequence": "46"
}

describe('Transaction', () => {
  it('signAndEncode', () => {
    const tx = new Tx(txObj, txType.NewOrderMsg);
    const encodeTXString = tx.sign('fbd9eb6aea3fb34f40e57154e7d0602f3391a06a560c5d99ba256619f781672f').serialize();
    console.log(encodeTXString);
  })
});