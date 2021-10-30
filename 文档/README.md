## Terms

- **Account** refers to a private/public keypair with a corresponding address.
  The address is derived from a hardcoded derivation path of `44'/714'/0'/0/0`
  from the seed.
- **Keystore** refers to an Ethereum-like encrypted keystore JSON blob
  containing the seed.
- **Mnemonic** refers to a phrase of words that can be remembered and used to
  recover the seed.

## Creating a Client

```js 
//common
const { BncClient } = require("@binance-chain/javascript-sdk")

//es6
import { BncClient } from "@binance-chain/javascript-sdk"

const client = new BncClient("https://xxx.api.com/")
client.initChain()
```

## Creating an Account

```js
client.createAccount()

client.createAccountWithKeystore([password])

client.createAccountWithMnemonic()
```

### Parameters

- password - **String**

### Returns

- Object - The account object with the following structure:

  - address - **String**: The account address.

  - privateKey - **String**: The accounts private key. This should never be
    shared or stored unencrypted in localstorage! Also make sure to null the
    memory after usage.

  - keystore - **Object**: The encrypted keystore JSON

  - mnemonic - **String**: mnemonic sentence -- a group of easy to remember
    words that can be used to recover the seed.

## Recover an Account from Keystore or Mnemonic

```js
client.recoverAccountFromKeystore(keystore, password)

client.recoverAccountFromMnemonic(mnemonic)

client.recoverAccountFromPrivateKey(privateKey)
```

### Parameters

- keystore - **Object**: Keystore JSON object.

- password - **String**: The password used for encryption

- mnemonic - **String**: mnemonic sentence.

### Returns

- Object - The account object with the following structure:

  - address - **String**: The account address.

  - privateKey - **String**: The accounts private key. This should never be
    shared or stored unencrypted in localStorage! Also make sure to null the
    memory after usage.

### Get Balances

```js
client.getBalance(address)
```

### Parameters

- address - **String**: a valid Binance Chain address.

### Returns (example)

```js
;[
  {
    symbol: "BNB",
    free: "3999.41000000",
    locked: "1000.00000000",
    frozen: "0.00000000",
  },
]
```

## Place an Order

```js
client.placeOrder(address, symbol, side, price, quantity, sequence)
```

### Parameters

- address - **String**: a valid binance chain address

- symbol - **String**: an active market pair

- side - **String**: buy or sell, value can only be 1(buy) or 2(sell)

- price - **Number**: the price of trade pair

- quantity - **Number**: the amount of symbol

- sequence - **Number**: sequence from account

### Returns (example)

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

## Transfer Tokens

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

### Returns (example)

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

### Cancel an Order

```js
client.cancelOrder(fromAddress, symbols, orderIds, refids, sequence)
```

### Parameters

- fromAddress - **String**: a valid binance chain address.

- symbols - **Array[String]**

- orderIds - **Array[Number]**

- refids - **Array[Number]**

- sequence - **Number**

### Returns (example)

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

### Get an Account

```js
client.getAccount(address)
```

### Parameters

- address - **String**: a valid Binance Chain address.

### Returns (example)

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

## Other pages

- [API Documentation](./api-docs/README.md)
- [API Examples](./examples.md)
- [Supported Transaction Types](./transaction-types.md)
