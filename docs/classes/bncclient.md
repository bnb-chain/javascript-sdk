[@binance-chain/javascript-sdk](../README.md) › [BncClient](bncclient.md)

# Class: BncClient

The Binance Chain client.

## Hierarchy

* **BncClient**

## Index

### Constructors

* [constructor](bncclient.md#constructor)

### Methods

* [_prepareTransaction](bncclient.md#_preparetransaction)
* [_sendTransaction](bncclient.md#_sendtransaction)
* [cancelOrder](bncclient.md#cancelorder)
* [checkAddress](bncclient.md#checkaddress)
* [chooseNetwork](bncclient.md#choosenetwork)
* [createAccount](bncclient.md#createaccount)
* [createAccountWithKeystore](bncclient.md#createaccountwithkeystore)
* [createAccountWithMneomnic](bncclient.md#createaccountwithmneomnic)
* [getAccount](bncclient.md#getaccount)
* [getBalance](bncclient.md#getbalance)
* [getClientKeyAddress](bncclient.md#getclientkeyaddress)
* [getDepth](bncclient.md#getdepth)
* [getMarkets](bncclient.md#getmarkets)
* [getOpenOrders](bncclient.md#getopenorders)
* [getSwapByCreator](bncclient.md#getswapbycreator)
* [getSwapByID](bncclient.md#getswapbyid)
* [getSwapByRecipient](bncclient.md#getswapbyrecipient)
* [getTransactions](bncclient.md#gettransactions)
* [getTx](bncclient.md#gettx)
* [initChain](bncclient.md#initchain)
* [list](bncclient.md#list)
* [multiSend](bncclient.md#multisend)
* [placeOrder](bncclient.md#placeorder)
* [recoverAccountFromKeystore](bncclient.md#recoveraccountfromkeystore)
* [recoverAccountFromMnemonic](bncclient.md#recoveraccountfrommnemonic)
* [recoverAccountFromPrivateKey](bncclient.md#recoveraccountfromprivatekey)
* [sendRawTransaction](bncclient.md#sendrawtransaction)
* [sendTransaction](bncclient.md#sendtransaction)
* [setAccountFlags](bncclient.md#setaccountflags)
* [setAccountNumber](bncclient.md#setaccountnumber)
* [setBroadcastDelegate](bncclient.md#setbroadcastdelegate)
* [setPrivateKey](bncclient.md#setprivatekey)
* [setSigningDelegate](bncclient.md#setsigningdelegate)
* [transfer](bncclient.md#transfer)
* [useAsyncBroadcast](bncclient.md#useasyncbroadcast)
* [useDefaultBroadcastDelegate](bncclient.md#usedefaultbroadcastdelegate)
* [useDefaultSigningDelegate](bncclient.md#usedefaultsigningdelegate)
* [useLedgerSigningDelegate](bncclient.md#useledgersigningdelegate)

## Constructors

###  constructor

\+ **new BncClient**(`server`: string, `useAsyncBroadcast`: boolean, `source`: number): *[BncClient](bncclient.md)*

*Defined in [client/index.ts:147](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L147)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`server` | string | - | Binance Chain public url |
`useAsyncBroadcast` | boolean | false | use async broadcast mode, faster but less guarantees (default off) |
`source` | number | 0 | where does this transaction come from (default 0)  |

**Returns:** *[BncClient](bncclient.md)*

## Methods

###  _prepareTransaction

▸ **_prepareTransaction**(`msg`: any, `stdSignMsg`: any, `address`: string, `sequence`: string | number | null, `memo`: string): *Promise‹[Transaction](transaction.md)‹››*

*Defined in [client/index.ts:715](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L715)*

Prepare a serialized raw transaction for sending to the blockchain.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`msg` | any | - | the msg object |
`stdSignMsg` | any | - | the sign doc object used to generate a signature |
`address` | string | - | - |
`sequence` | string &#124; number &#124; null | null | optional sequence |
`memo` | string | "" | optional memo |

**Returns:** *Promise‹[Transaction](transaction.md)‹››*

signed transaction

___

###  _sendTransaction

▸ **_sendTransaction**(`msg`: any, `stdSignMsg`: any, `address`: string, `sequence`: string | number | null, `memo`: string, `sync`: boolean): *Promise‹object›*

*Defined in [client/index.ts:793](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L793)*

Broadcast a raw transaction to the blockchain.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`msg` | any | - | the msg object |
`stdSignMsg` | any | - | the sign doc object used to generate a signature |
`address` | string | - | - |
`sequence` | string &#124; number &#124; null | null | optional sequence |
`memo` | string | "" | optional memo |
`sync` | boolean | !this._useAsyncBroadcast | use synchronous mode, optional |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  cancelOrder

▸ **cancelOrder**(`fromAddress`: string, `symbol`: string, `refid`: string, `sequence`: number | null): *Promise‹object›*

*Defined in [client/index.ts:493](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L493)*

Cancel an order.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`fromAddress` | string | - | - |
`symbol` | string | - | the market pair |
`refid` | string | - | the order ID of the order to cancel |
`sequence` | number &#124; null | null | optional sequence |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  checkAddress

▸ **checkAddress**(`address`: string, `prefix`: BncClient["addressPrefix"]): *boolean*

*Defined in [client/index.ts:1139](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L1139)*

Validates an address.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`address` | string | - |
`prefix` | BncClient["addressPrefix"] | this.addressPrefix |

**Returns:** *boolean*

___

###  chooseNetwork

▸ **chooseNetwork**(`network`: keyof typeof NETWORK_PREFIX_MAPPING): *void*

*Defined in [client/index.ts:189](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L189)*

Sets the client network (testnet or mainnet).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`network` | keyof typeof NETWORK_PREFIX_MAPPING | Indicate testnet or mainnet  |

**Returns:** *void*

___

###  createAccount

▸ **createAccount**(): *object*

*Defined in [client/index.ts:1009](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L1009)*

Creates a private key and returns it and its address.

**Returns:** *object*

the private key and address in an object.
{
 address,
 privateKey
}

___

###  createAccountWithKeystore

▸ **createAccountWithKeystore**(`password`: string): *object*

*Defined in [client/index.ts:1026](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L1026)*

Creates an account keystore object, and returns the private key and address.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`password` | string |   {  privateKey,  address,  keystore }  |

**Returns:** *object*

___

###  createAccountWithMneomnic

▸ **createAccountWithMneomnic**(): *object*

*Defined in [client/index.ts:1052](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L1052)*

Creates an account from mnemonic seed phrase.

**Returns:** *object*

{
 privateKey,
 address,
 mnemonic
}

___

###  getAccount

▸ **getAccount**(`address`: undefined | string): *Promise‹null | object›*

*Defined in [client/index.ts:816](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L816)*

get account

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`address` | undefined &#124; string | this.address |

**Returns:** *Promise‹null | object›*

resolves with http response

___

###  getBalance

▸ **getBalance**(`address`: undefined | string): *Promise‹any›*

*Defined in [client/index.ts:836](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L836)*

get balances

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`address` | undefined &#124; string | this.address | optional address |

**Returns:** *Promise‹any›*

resolves with http response

___

###  getClientKeyAddress

▸ **getClientKeyAddress**(): *string*

*Defined in [client/index.ts:1150](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L1150)*

Returns the address for the current account if setPrivateKey has been called on this client.

**Returns:** *string*

___

###  getDepth

▸ **getDepth**(`symbol`: string): *Promise‹object | never[]›*

*Defined in [client/index.ts:903](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L903)*

get depth for a given market

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`symbol` | string | "BNB_BUSD-BD1" | the market pair |

**Returns:** *Promise‹object | never[]›*

resolves with http response

___

###  getMarkets

▸ **getMarkets**(`limit`: number, `offset`: number): *Promise‹object | never[]›*

*Defined in [client/index.ts:851](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L851)*

get markets

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`limit` | number | 1000 | max 1000 is default |
`offset` | number | 0 | from beggining, default 0 |

**Returns:** *Promise‹object | never[]›*

resolves with http response

___

###  getOpenOrders

▸ **getOpenOrders**(`address`: string): *Promise‹object | never[]›*

*Defined in [client/index.ts:922](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L922)*

get open orders for an address

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`address` | string | this.address! | binance address |

**Returns:** *Promise‹object | never[]›*

resolves with http response

___

###  getSwapByCreator

▸ **getSwapByCreator**(`creator`: string, `limit`: number, `offset`: number): *Promise‹object | never[]›*

*Defined in [client/index.ts:960](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L960)*

query atomic swap list by creator address

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`creator` | string | - | - |
`limit` | number | 100 | - |
`offset` | number | 0 | from beginning, default 0 |

**Returns:** *Promise‹object | never[]›*

Array of AtomicSwap

___

###  getSwapByID

▸ **getSwapByID**(`swapID`: string): *Promise‹object | never[]›*

*Defined in [client/index.ts:940](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L940)*

get atomic swap

**Parameters:**

Name | Type |
------ | ------ |
`swapID` | string |

**Returns:** *Promise‹object | never[]›*

AtomicSwap

___

###  getSwapByRecipient

▸ **getSwapByRecipient**(`recipient`: string, `limit`: number, `offset`: number): *Promise‹object | never[]›*

*Defined in [client/index.ts:984](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L984)*

query atomic swap list by recipient address

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`recipient` | string | - | - |
`limit` | number | 100 | - |
`offset` | number | 0 | from beginning, default 0 |

**Returns:** *Promise‹object | never[]›*

Array of AtomicSwap

___

###  getTransactions

▸ **getTransactions**(`address`: undefined | string, `offset`: number): *Promise‹object | never[]›*

*Defined in [client/index.ts:870](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L870)*

get transactions for an account

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`address` | undefined &#124; string | this.address | optional address |
`offset` | number | 0 | from beggining, default 0 |

**Returns:** *Promise‹object | never[]›*

resolves with http response

___

###  getTx

▸ **getTx**(`hash`: string): *Promise‹object | never[]›*

*Defined in [client/index.ts:888](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L888)*

get transaction

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hash` | string | the transaction hash |

**Returns:** *Promise‹object | never[]›*

resolves with http response

___

###  initChain

▸ **initChain**(): *Promise‹this›*

*Defined in [client/index.ts:177](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L177)*

Initialize the client with the chain's ID. Asynchronous.

**Returns:** *Promise‹this›*

___

###  list

▸ **list**(`address`: string, `proposalId`: number, `baseAsset`: string, `quoteAsset`: string, `initPrice`: number, `sequence`: null): *Promise‹object›*

*Defined in [client/index.ts:616](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L616)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`address` | string | - | - |
`proposalId` | number | - | - |
`baseAsset` | string | - | - |
`quoteAsset` | string | - | - |
`initPrice` | number | - | - |
`sequence` | null | null | optional sequence |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  multiSend

▸ **multiSend**(`fromAddress`: string, `outputs`: Transfer[], `memo`: string, `sequence`: null): *Promise‹object›*

*Defined in [client/index.ts:415](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L415)*

Create and sign a multi send tx

**`example`** 
const outputs = [
{
  "to": "tbnb1p4kpnj5qz5spsaf0d2555h6ctngse0me5q57qe",
  "coins": [{
    "denom": "BNB",
    "amount": 10
  },{
    "denom": "BTC",
    "amount": 10
  }]
},
{
  "to": "tbnb1scjj8chhhp7lngdeflltzex22yaf9ep59ls4gk",
  "coins": [{
    "denom": "BTC",
    "amount": 10
  },{
    "denom": "BNB",
    "amount": 10
  }]
}]

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`fromAddress` | string | - | - |
`outputs` | Transfer[] | - | - |
`memo` | string | "" | optional memo |
`sequence` | null | null | optional sequence |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  placeOrder

▸ **placeOrder**(`address`: string, `symbol`: string, `side`: number, `price`: number, `quantity`: number, `sequence`: number | null, `timeinforce`: number): *Promise‹object›*

*Defined in [client/index.ts:535](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L535)*

Place an order.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`address` | string | this.address! | - |
`symbol` | string | - | the market pair |
`side` | number | - | (1-Buy, 2-Sell) |
`price` | number | - | - |
`quantity` | number | - | - |
`sequence` | number &#124; null | null | optional sequence |
`timeinforce` | number | 1 | (1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel)) |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  recoverAccountFromKeystore

▸ **recoverAccountFromKeystore**(`keystore`: Parameters<typeof getPrivateKeyFromKeyStore>[0], `password`: Parameters<typeof getPrivateKeyFromKeyStore>[1]): *object*

*Defined in [client/index.ts:1075](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L1075)*

Recovers an account from a keystore object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keystore` | Parameters<typeof getPrivateKeyFromKeyStore>[0] | object. |
`password` | Parameters<typeof getPrivateKeyFromKeyStore>[1] | password. { privateKey, address }  |

**Returns:** *object*

___

###  recoverAccountFromMnemonic

▸ **recoverAccountFromMnemonic**(`mnemonic`: string): *object*

*Defined in [client/index.ts:1098](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L1098)*

Recovers an account from a mnemonic seed phrase.

**Parameters:**

Name | Type |
------ | ------ |
`mnemonic` | string |

**Returns:** *object*

___

###  recoverAccountFromPrivateKey

▸ **recoverAccountFromPrivateKey**(`privateKey`: string): *object*

*Defined in [client/index.ts:1122](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L1122)*

Recovers an account using private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | string |  { privateKey, address }  |

**Returns:** *object*

___

###  sendRawTransaction

▸ **sendRawTransaction**(`signedBz`: string, `sync`: boolean): *Promise‹object›*

*Defined in [client/index.ts:765](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L765)*

Broadcast a raw transaction to the blockchain.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`signedBz` | string | - | signed and serialized raw transaction |
`sync` | boolean | !this._useAsyncBroadcast | use synchronous mode, optional |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  sendTransaction

▸ **sendTransaction**(`signedTx`: [Transaction](transaction.md), `sync`: boolean): *Promise‹object›*

*Defined in [client/index.ts:754](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L754)*

Broadcast a transaction to the blockchain.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`signedTx` | [Transaction](transaction.md) | - |
`sync` | boolean | use synchronous mode, optional |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  setAccountFlags

▸ **setAccountFlags**(`address`: string, `flags`: number, `sequence`: null): *Promise‹object›*

*Defined in [client/index.ts:682](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L682)*

Set account flags

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`address` | string | - | - |
`flags` | number | - | new value of account flags |
`sequence` | null | null | optional sequence |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  setAccountNumber

▸ **setAccountNumber**(`accountNumber`: number): *void*

*Defined in [client/index.ts:234](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L234)*

Sets the client's account number.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`accountNumber` | number |   |

**Returns:** *void*

___

###  setBroadcastDelegate

▸ **setBroadcastDelegate**(`delegate`: BncClient["_broadcastDelegate"]): *[BncClient](bncclient.md)*

*Defined in [client/index.ts:265](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L265)*

Sets the broadcast delegate (for wallet integrations).

**Parameters:**

Name | Type |
------ | ------ |
`delegate` | BncClient["_broadcastDelegate"] |

**Returns:** *[BncClient](bncclient.md)*

this instance (for chaining)

___

###  setPrivateKey

▸ **setPrivateKey**(`privateKey`: string, `localOnly`: boolean): *Promise‹this›*

*Defined in [client/index.ts:200](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L200)*

Sets the client's private key for calls made by this client. Asynchronous.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`privateKey` | string | - | the private key hexstring |
`localOnly` | boolean | false | set this to true if you will supply an account_number yourself via `setAccountNumber`. Warning: You must do that if you set this to true! |

**Returns:** *Promise‹this›*

___

###  setSigningDelegate

▸ **setSigningDelegate**(`delegate`: BncClient["_signingDelegate"]): *[BncClient](bncclient.md)*

*Defined in [client/index.ts:253](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L253)*

Sets the signing delegate (for wallet integrations).

**Parameters:**

Name | Type |
------ | ------ |
`delegate` | BncClient["_signingDelegate"] |

**Returns:** *[BncClient](bncclient.md)*

this instance (for chaining)

___

###  transfer

▸ **transfer**(`fromAddress`: string, `toAddress`: string, `amount`: BigSource, `asset`: string, `memo`: string, `sequence`: null): *Promise‹object›*

*Defined in [client/index.ts:313](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L313)*

Transfer tokens from one address to another.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`fromAddress` | string | - | - |
`toAddress` | string | - | - |
`amount` | BigSource | - | - |
`asset` | string | - | - |
`memo` | string | "" | optional memo |
`sequence` | null | null | optional sequence |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  useAsyncBroadcast

▸ **useAsyncBroadcast**(`useAsyncBroadcast`: boolean): *[BncClient](bncclient.md)*

*Defined in [client/index.ts:243](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L243)*

Use async broadcast mode. Broadcasts faster with less guarantees (default off)

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`useAsyncBroadcast` | boolean | true |

**Returns:** *[BncClient](bncclient.md)*

this instance (for chaining)

___

###  useDefaultBroadcastDelegate

▸ **useDefaultBroadcastDelegate**(): *[BncClient](bncclient.md)*

*Defined in [client/index.ts:285](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L285)*

Applies the default broadcast delegate.

**Returns:** *[BncClient](bncclient.md)*

this instance (for chaining)

___

###  useDefaultSigningDelegate

▸ **useDefaultSigningDelegate**(): *[BncClient](bncclient.md)*

*Defined in [client/index.ts:276](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L276)*

Applies the default signing delegate.

**Returns:** *[BncClient](bncclient.md)*

this instance (for chaining)

___

###  useLedgerSigningDelegate

▸ **useLedgerSigningDelegate**(...`args`: Parameters‹typeof LedgerSigningDelegate›): *this*

*Defined in [client/index.ts:298](https://github.com/binance-chain/javascript-sdk/blob/cd0d303/src/client/index.ts#L298)*

Applies the Ledger signing delegate.

**Parameters:**

Name | Type |
------ | ------ |
`...args` | Parameters‹typeof LedgerSigningDelegate› |

**Returns:** *this*

this instance (for chaining)
