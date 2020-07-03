
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
* [getPrivateKey](bncclient.md#getprivatekey)
* [getSwapByCreator](bncclient.md#getswapbycreator)
* [getSwapByID](bncclient.md#getswapbyid)
* [getSwapByRecipient](bncclient.md#getswapbyrecipient)
* [getTransactions](bncclient.md#gettransactions)
* [getTx](bncclient.md#gettx)
* [initChain](bncclient.md#initchain)
* [list](bncclient.md#list)
* [listMiniToken](bncclient.md#listminitoken)
* [multiSend](bncclient.md#multisend)
* [placeOrder](bncclient.md#placeorder)
* [recoverAccountFromKeystore](bncclient.md#recoveraccountfromkeystore)
* [recoverAccountFromMnemonic](bncclient.md#recoveraccountfrommnemonic)
* [recoverAccountFromPrivateKey](bncclient.md#recoveraccountfromprivatekey)
* [removePrivateKey](bncclient.md#removeprivatekey)
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

Sets the client network (testnet or mainnet).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`network` | keyof typeof NETWORK_PREFIX_MAPPING | Indicate testnet or mainnet  |

**Returns:** *void*

___

###  createAccount

▸ **createAccount**(): *object*

Creates a private key and returns it and its address.

**Returns:** *object*

the private key and address in an object.
{
 address,
 privateKey
}

* **address**: *string* = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix)

* **privateKey**: *string*

___

###  createAccountWithKeystore

▸ **createAccountWithKeystore**(`password`: string): *object*

Creates an account keystore object, and returns the private key and address.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`password` | string |   {  privateKey,  address,  keystore }  |

**Returns:** *object*

* **address**: *string*

* **keystore**: *KeyStore*

* **privateKey**: *string*

___

###  createAccountWithMneomnic

▸ **createAccountWithMneomnic**(): *object*

Creates an account from mnemonic seed phrase.

**Returns:** *object*

{
 privateKey,
 address,
 mnemonic
}

* **address**: *string*

* **mnemonic**: *string*

* **privateKey**: *string*

___

###  getAccount

▸ **getAccount**(`address`: undefined | string): *Promise‹null | object›*

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

Returns the address for the current account if setPrivateKey has been called on this client.

**Returns:** *string*

___

###  getDepth

▸ **getDepth**(`symbol`: string): *Promise‹object | never[]›*

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

get open orders for an address

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`address` | string | this.address! | binance address |

**Returns:** *Promise‹object | never[]›*

resolves with http response

___

###  getPrivateKey

▸ **getPrivateKey**(): *null | string*

Gets client's private key.

**Returns:** *null | string*

the private key hexstring or `null` if no private key has been set

___

###  getSwapByCreator

▸ **getSwapByCreator**(`creator`: string, `limit`: number, `offset`: number): *Promise‹object | never[]›*

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

Initialize the client with the chain's ID. Asynchronous.

**Returns:** *Promise‹this›*

___

###  list

▸ **list**(`address`: string, `proposalId`: number, `baseAsset`: string, `quoteAsset`: string, `initPrice`: number, `sequence`: number | null): *Promise‹object›*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`address` | string | - | - |
`proposalId` | number | - | - |
`baseAsset` | string | - | - |
`quoteAsset` | string | - | - |
`initPrice` | number | - | - |
`sequence` | number &#124; null | null | optional sequence |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  listMiniToken

▸ **listMiniToken**(`__namedParameters`: object): *Promise‹object›*

list miniToken

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`baseAsset` | string | - |
`from` | string | - |
`initPrice` | number | - |
`quoteAsset` | string | - |
`sequence` | null &#124; number | null |

**Returns:** *Promise‹object›*

___

###  multiSend

▸ **multiSend**(`fromAddress`: string, `outputs`: Transfer[], `memo`: string, `sequence`: number | null): *Promise‹object›*

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
`sequence` | number &#124; null | null | optional sequence |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  placeOrder

▸ **placeOrder**(`address`: string, `symbol`: string, `side`: number, `price`: number, `quantity`: number, `sequence`: number | null, `timeinforce`: number): *Promise‹object›*

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

Recovers an account from a keystore object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keystore` | Parameters<typeof getPrivateKeyFromKeyStore>[0] | object. |
`password` | Parameters<typeof getPrivateKeyFromKeyStore>[1] | password. { privateKey, address }  |

**Returns:** *object*

* **address**: *string*

* **privateKey**: *string*

___

###  recoverAccountFromMnemonic

▸ **recoverAccountFromMnemonic**(`mnemonic`: string): *object*

Recovers an account from a mnemonic seed phrase.

**Parameters:**

Name | Type |
------ | ------ |
`mnemonic` | string |

**Returns:** *object*

* **address**: *string*

* **privateKey**: *string*

___

###  recoverAccountFromPrivateKey

▸ **recoverAccountFromPrivateKey**(`privateKey`: string): *object*

Recovers an account using private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | string |  { privateKey, address }  |

**Returns:** *object*

* **address**: *string*

* **privateKey**: *string*

___

###  removePrivateKey

▸ **removePrivateKey**(): *this*

Removes client's private key.

**Returns:** *this*

this instance (for chaining)

___

###  sendRawTransaction

▸ **sendRawTransaction**(`signedBz`: string, `sync`: boolean): *Promise‹object›*

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

▸ **setAccountFlags**(`address`: string, `flags`: number, `sequence`: number | null): *Promise‹object›*

Set account flags

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`address` | string | - | - |
`flags` | number | - | new value of account flags |
`sequence` | number &#124; null | null | optional sequence |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  setAccountNumber

▸ **setAccountNumber**(`accountNumber`: number): *void*

Sets the client's account number.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`accountNumber` | number |   |

**Returns:** *void*

___

###  setBroadcastDelegate

▸ **setBroadcastDelegate**(`delegate`: BncClient["_broadcastDelegate"]): *[BncClient](bncclient.md)*

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

Sets the signing delegate (for wallet integrations).

**Parameters:**

Name | Type |
------ | ------ |
`delegate` | BncClient["_signingDelegate"] |

**Returns:** *[BncClient](bncclient.md)*

this instance (for chaining)

___

###  transfer

▸ **transfer**(`fromAddress`: string, `toAddress`: string, `amount`: BigSource, `asset`: string, `memo`: string, `sequence`: number | null): *Promise‹object›*

Transfer tokens from one address to another.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`fromAddress` | string | - | - |
`toAddress` | string | - | - |
`amount` | BigSource | - | - |
`asset` | string | - | - |
`memo` | string | "" | optional memo |
`sequence` | number &#124; null | null | optional sequence |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  useAsyncBroadcast

▸ **useAsyncBroadcast**(`useAsyncBroadcast`: boolean): *[BncClient](bncclient.md)*

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

Applies the default broadcast delegate.

**Returns:** *[BncClient](bncclient.md)*

this instance (for chaining)

___

###  useDefaultSigningDelegate

▸ **useDefaultSigningDelegate**(): *[BncClient](bncclient.md)*

Applies the default signing delegate.

**Returns:** *[BncClient](bncclient.md)*

this instance (for chaining)

___

###  useLedgerSigningDelegate

▸ **useLedgerSigningDelegate**(...`args`: Parameters‹typeof LedgerSigningDelegate›): *this*

Applies the Ledger signing delegate.

**Parameters:**

Name | Type |
------ | ------ |
`...args` | Parameters‹typeof LedgerSigningDelegate› |

**Returns:** *this*

this instance (for chaining)
