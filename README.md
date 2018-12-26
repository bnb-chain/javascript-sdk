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

  

## API 

### Initial client
```js
  const client = new BncClient('https://xxx.api.com/');
  client.initChain();
```

### create

```js
  client.createAccount()

  client.createAccountWithKeystore([password])

  client.createAccountWithMneomnic()
```

### Parameters
 
- password - **String**


### Returns
- Object - The account object with the following structure:

   - address - **String**: The account address.

   - privateKey - **String**: The accounts private key. This should never be shared or stored unencrypted in localstorage! Also make sure to null the memory after usage.

   - keystore - **Object**: The encrypted keystore JSON

   - mneomnic - **String**:  mnemonic sentence -- a group of easy to remember words. 

   
### recover

```js
  client.recoverAccountFromKeystore(keystore, password)

  client.recoverAccountFromMneomnic(mnemonic)

  client.recoverAccountFromPrivateKey(privateKey)
```

### Parameters
 
- keystore - **Object**: Keystore JSON object.

- password - **String**: The password used for encryption

- mnemonic - **String**: mnemonic sentence.

### Returns
- Object - The account object with the following structure:

   - address - **String**: The account address.

   - privateKey - **String**: The accounts private key. This should never be shared or stored unencrypted in localstorage!    Also make sure to null the memory after usage.


### placeOrder

```js
  client.placeOrder(address, symbol, side, price, quantity, sequence)
```

### Parameters

- address - **String**: a valid binance chain address.

- symbol - **String**: trade pair

- side - **String**: buy or sell

- price - **Number**: the price of trade pair

- quantity - **Number**: the amount of symbol

- sequence - **Number**: sequence from every address


### Returns
```js
{
  "0": {
    "code": 0,
    "data": "{type:dex/NewOrderResponse,value:{order_id:BA36F0FAD74D8F41045463E4774F328F4AF779E5-80}}",
    "hash": "641F4333F05B2374700E191EE6B6B03F9A543514",
    "log": "Msg 0: ",
    "ok": true
  },
  "status": 200
}

```

## Test Cases

go to [test folder](./__tests__)
  


