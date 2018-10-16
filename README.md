# bnc-web-lib
Basic JS Libraray for BinanceChain, include two parts: wallet libraray and encoding.

## Usage
add "bnc-wallet-lib": "https://github.com/BiJie/bnc-web-lib.git" to package.json,
then yarn or npm install.

```js
import Bnc from 'bnc-wallet-lib/';
```

## API

### Bnc.crypto

generate privatekey, address, keystore, mneonic

```js
const privateKey = crypto.generatePrivateKey();

const address = crypto.getAddressFromPrivateKey(privateKey);

const keyStore = crypto.generateKeyStore(privateKey, password);

const mneonic = crypto.getMnemonicFromPrivateKey(privateKey);
                crypto.generateMnemonic();//15 
```

recover privatekey, address from keystore, mneonic

```js
const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);

const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);

const address = crypto.getAddressFromPrivateKey(privateKey);
```

### Bnc.amino (js-amino)

serialize object to hex string which compatible with go-amino

```js
amino.marshalBinary(data)

amino.marshalBinaryBare(data);
```

### SendTx
every tx has a specified type and encode prefix
supported type and according prefix:
  MsgSend: '2A2C87FA',
  NewOrderMsg: 'CE6DC043',
  CancelOrderMsg: '166E681B',
  StdTx: 'F0625DEE'

```js
const txType = Transaction.txType;
const typePrefix = Transaction.typePrefix;

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

const tx = new Transcation(txObj, txType.NewOrderMsg);
const bnc = new Bnc('http://xxxx.com');
bnc.sendTx(tx);
```



