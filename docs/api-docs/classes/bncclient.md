
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

*Defined in [src/client/index.ts:156](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L156)*

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

*Defined in [src/client/index.ts:785](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L785)*

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

*Defined in [src/client/index.ts:860](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L860)*

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

*Defined in [src/client/index.ts:515](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L515)*

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

*Defined in [src/client/index.ts:1198](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L1198)*

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

*Defined in [src/client/index.ts:194](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L194)*

Sets the client network (testnet or mainnet).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`network` | keyof typeof NETWORK_PREFIX_MAPPING | Indicate testnet or mainnet  |

**Returns:** *void*

___

###  createAccount

▸ **createAccount**(): *object*

*Defined in [src/client/index.ts:1068](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L1068)*

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

*Defined in [src/client/index.ts:1085](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L1085)*

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

*Defined in [src/client/index.ts:1111](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L1111)*

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

*Defined in [src/client/index.ts:883](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L883)*

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

*Defined in [src/client/index.ts:903](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L903)*

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

*Defined in [src/client/index.ts:1209](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L1209)*

Returns the address for the current account if setPrivateKey has been called on this client.

**Returns:** *string*

___

###  getDepth

▸ **getDepth**(`symbol`: string): *Promise‹object | never[]›*

*Defined in [src/client/index.ts:970](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L970)*

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

*Defined in [src/client/index.ts:918](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L918)*

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

*Defined in [src/client/index.ts:989](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L989)*

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

*Defined in [src/client/index.ts:248](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L248)*

Gets client's private key.

**Returns:** *null | string*

the private key hexstring or `null` if no private key has been set

___

###  getSwapByCreator

▸ **getSwapByCreator**(`creator`: string, `limit`: number, `offset`: number): *Promise‹object | never[]›*

*Defined in [src/client/index.ts:1027](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L1027)*

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

*Defined in [src/client/index.ts:1007](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L1007)*

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

*Defined in [src/client/index.ts:1047](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L1047)*

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

*Defined in [src/client/index.ts:937](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L937)*

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

*Defined in [src/client/index.ts:955](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L955)*

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

*Defined in [src/client/index.ts:182](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L182)*

Initialize the client with the chain's ID. Asynchronous.

**Returns:** *Promise‹this›*

___

###  list

▸ **list**(`address`: string, `proposalId`: number, `baseAsset`: string, `quoteAsset`: string, `initPrice`: number, `sequence`: null): *Promise‹object›*

*Defined in [src/client/index.ts:638](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L638)*

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

###  listMiniToken

▸ **listMiniToken**(`__namedParameters`: object): *Promise‹object›*

*Defined in [src/client/index.ts:700](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L700)*

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

▸ **multiSend**(`fromAddress`: string, `outputs`: Transfer[], `memo`: string, `sequence`: null): *Promise‹object›*

*Defined in [src/client/index.ts:437](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L437)*

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

*Defined in [src/client/index.ts:557](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L557)*

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

*Defined in [src/client/index.ts:1134](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L1134)*

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

*Defined in [src/client/index.ts:1157](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L1157)*

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

*Defined in [src/client/index.ts:1181](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L1181)*

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

*Defined in [src/client/index.ts:239](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L239)*

Removes client's private key.

**Returns:** *this*

this instance (for chaining)

___

###  sendRawTransaction

▸ **sendRawTransaction**(`signedBz`: string, `sync`: boolean): *Promise‹object›*

*Defined in [src/client/index.ts:835](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L835)*

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

*Defined in [src/client/index.ts:824](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L824)*

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

*Defined in [src/client/index.ts:752](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L752)*

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

*Defined in [src/client/index.ts:256](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L256)*

Sets the client's account number.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`accountNumber` | number |   |

**Returns:** *void*

___

###  setBroadcastDelegate

▸ **setBroadcastDelegate**(`delegate`: BncClient["_broadcastDelegate"]): *[BncClient](bncclient.md)*

*Defined in [src/client/index.ts:287](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L287)*

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

*Defined in [src/client/index.ts:205](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L205)*

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

*Defined in [src/client/index.ts:275](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L275)*

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

*Defined in [src/client/index.ts:335](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L335)*

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

*Defined in [src/client/index.ts:265](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L265)*

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

*Defined in [src/client/index.ts:307](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L307)*

Applies the default broadcast delegate.

**Returns:** *[BncClient](bncclient.md)*

this instance (for chaining)

___

###  useDefaultSigningDelegate

▸ **useDefaultSigningDelegate**(): *[BncClient](bncclient.md)*

*Defined in [src/client/index.ts:298](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L298)*

Applies the default signing delegate.

**Returns:** *[BncClient](bncclient.md)*

this instance (for chaining)

___

###  useLedgerSigningDelegate

▸ **useLedgerSigningDelegate**(...`args`: Parameters‹typeof LedgerSigningDelegate›): *this*

*Defined in [src/client/index.ts:320](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/index.ts#L320)*

Applies the Ledger signing delegate.

**Parameters:**

Name | Type |
------ | ------ |
`...args` | Parameters‹typeof LedgerSigningDelegate› |

**Returns:** *this*

this instance (for chaining)
