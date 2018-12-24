# bnc-web-lib
Binance Chain JavaScript API

# Usage
> yarn add @binance/bnc-web-lib -S --registry https://npm-registry.fdgahl.cn

# API

## crypto

generate privatekey, address, keystore, mneonic

```js
const privateKey = crypto.generatePrivateKey();

const address = crypto.getAddressFromPrivateKey(privateKey);

const keyStore = crypto.generateKeyStore(privateKey, password);

const mneonic = crypto.getMnemonicFromPrivateKey(privateKey);
                crypto.generateMnemonic();//24
```

recover privatekey, address from keystore, mneonic

```js
const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);

const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);

const address = crypto.getAddressFromPrivateKey(privateKey);
```

## amino (js-amino)

[Read go-amino](https://github.com/tendermint/go-amino)

serialize object to hex string which compatible with go-amino

```js
amino.marshalBinary(data)

amino.marshalBinaryBare(data);
```

## BncClient
- every tx has a specified type and encode prefix
- supported type and prefix:

  |type|name|prefix|
  |:---|:---|:---
  |MsgSend|transfer|2A2C87FA|
  |NewOrderMsg|placeOrder|CE6DC043|
  |CancelOrderMsg|cancelOrder|166E681B|

- initial client
```js
  const client = new BncClient('https://xxx.api.com/');
```  

- API 

it should set private key with setPrivateKey method before use.

```js

  client.setPrivateKey(privateKey);

  client.placeOrder(address, symbol, side, price, quantity)

  client.transfer(address, to, amount, symbol, memo)

  client.canceOrder(address, symbols, orderIds, orderIds, sequence) 
```

## Test Cases

go to [test folder](./__tests__)
  


