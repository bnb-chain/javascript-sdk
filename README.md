# JS-Lib

Binance Chain JavaScript API

# Usage

> yarn add @binance/bnc-js -S --registry https://npm-registry.fdgahl.cn

# API

## crypto

generate privatekey, address, keystore, mneonic

```js
const privateKey = crypto.generatePrivateKey()

const address = crypto.getAddressFromPrivateKey(privateKey)

const keyStore = crypto.generateKeyStore(privateKey, password)

const mneonic = crypto.getMnemonicFromPrivateKey(privateKey)
crypto.generateMnemonic() //24
```

recover privatekey, address from keystore, mneonic

```js
const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password)

const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)

const address = crypto.getAddressFromPrivateKey(privateKey)
```

## amino (js-amino)

[Read go-amino](https://github.com/tendermint/go-amino)

serialize object to hex string which compatible with go-amino

```js
amino.marshalBinary(data)

amino.marshalBinaryBare(data)
```

## BncClient

- every tx has a specified type and encode prefix

- supported type and prefix:

  | type           | name        | prefix   |
  | :------------- | :---------- | :------- |
  | MsgSend        | transfer    | 2A2C87FA |
  | NewOrderMsg    | placeOrder  | CE6DC043 |
  | CancelOrderMsg | cancelOrder | 166E681B |

## API

### Initial client

```js

//common
const BncClient = require('@binance/bnc-js')

//es6
import BncClient from '@binance/bnc-js'


const client = new BncClient("https://xxx.api.com/")
client.initChain()
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

  - mneomnic - **String**: mnemonic sentence -- a group of easy to remember words.

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

  - privateKey - **String**: The accounts private key. This should never be shared or stored unencrypted in localstorage! Also make sure to null the memory after usage.

### getBalance

```js
client.getBalance(address)
```

### Parameters

- address - **String**: a valid binance chain address.

### Returns

```js
[
  {
    symbol: "BNB",
    free: "3999.41000000",
    locked: "1000.00000000",
    frozen: "0.00000000"
  }
]
```

### placeOrder

```js
client.placeOrder(address, symbol, side, price, quantity, sequence)
```

### Parameters

- address - **String**: a valid binance chain address

- symbol - **String**: trade pair

- side - **String**: buy or sell, value can only be 1(buy) or 2(sell)

- price - **Number**: the price of trade pair

- quantity - **Number**: the amount of symbol

- sequence - **Number**: sequence from account

### Returns

```js
{
  "result": {
    "code": 0,
    "data": "{type:dex/NewOrderResponse,value:{order_id:BA36F0FAD74D8F41045463E4774F328F4AF779E5-80}}",
    "hash": "641F4333F05B2374700E191EE6B6B03F9A543514",
    "log": "Msg 0: ",
    "ok": true
  },
  "status": 200
}

```

### transfer

```js
client.transfer(fromAddress, toAddress, amount, asset, memo, sequence)
```

### Parameters

- fromAddress - **String**: a valid binance chain address.

- toAddress - **String**: a valid binance chain address.

- amount - **Number**

- asset - **String**

- memo - **String**

- sequence - **Number**: sequence from account

### Returns

```js
{
  "result": [
    {
      "code": 0,
      "hash": "1C1AC45E4E9D213606660264F906310458AEA449",
      "log": "Msg 0: ",
      "ok": true
    }
  ],
  "status": 200
}
```

### cancelOrder

```js
client.cancelOrder(fromAddress, symbols, orderIds, refids, sequence)
```

### Parameters

- fromAddress - **String**: a valid binance chain address.

- symbols - **Array[String]**

- orderIds - **Array[Number]**

- refids - **Array[Number]**

- sequence - **Number**

### Returns

```js
{
  "result": {
    "code": 0,
    "hash": "79D09209710E32D75935186830AF4309D2A2D9C5",
    "log": "Msg 0: ",
    "ok": true
  },
  "status": 200
}
```

### getAccount

```js
client.getAccount(address)
```

### Parameters

- address - **String**: a valid binance chain address.

### Returns

```js
{
  "address": "bnc1hgm0p7khfk85zpz5v0j8wnej3a90w7098fpxyh",
  "public_key": [],
  "account_number": 9,
  "sequence": 81,
  "balances": [
    {
      "symbol": "BNB",
      "free": "9834046.15286760",
      "locked": "145.00000000",
      "frozen": "0.00000000"
    }
  ]
}
```

## Test Cases

go to [test folder](./__tests__)
