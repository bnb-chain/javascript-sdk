# bnc-web-lib
Basic JS Libraray for BinanceChain, include two parts: wallet libraray and encoding.

## Usage
add "bnc-wallet-lib": "https://github.com/BiJie/bnc-web-lib.git" to package.json,
then yarn or npm install.

```js
import * as crypto from 'bnc-wallet-lib/src/crypto';

import * as encoder from '../src/amino/';
```

## API

### crypto

generate privatekey, address, keystore, mneonic

```js
const privateKey = crypto.generatePrivateKey();

const address = crypto.getAddressFromPrivateKey(privateKey);

const keyStore = crypto.generateKeyStore(privateKey, password);

const mneonic = crypto.getMnemonicFromPrivateKey(privateKey);
                crypto.generateMnemonic();//15 
```

get privatekey from keystore, mneonic

```js
const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);

const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);

```

get address from privatekey

```js
const address = crypto.getAddressFromPrivateKey(privateKey);
```

### js-amino(not fully implement, only encode binrary part)

serialize object to hex string which compatible with go-amino

```js
const data = {
      "id": "cosmosaccaddr173hyu6dtfkrj9vujjhvz2ayehrng64rxq3h4yp-46",
      "ordertype": 2,
      "price": 1,
      "quantity": 1,
      "sender": "cosmosaccaddr173hyu6dtfkrj9vujjhvz2ayehrng64rxq3h4yp",
      "side": 1,
      "symbol": "XYZ_BNB",
      "timeinforce": 1
    };
    
const encodeString = encoder.encodeStruct(data);
```



