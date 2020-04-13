[@binance-chain/javascript-sdk](../README.md) › [RpcClient](rpcclient.md)

# Class: RpcClient

The Binance Chain Node rpc client

## Hierarchy

* BaseRpc

  ↳ **RpcClient**

## Index

### Constructors

* [constructor](rpcclient.md#constructor)

### Methods

* [broadcastDelegate](rpcclient.md#broadcastdelegate)
* [getAccount](rpcclient.md#getaccount)
* [getBalance](rpcclient.md#getbalance)
* [getBalances](rpcclient.md#getbalances)
* [getDepth](rpcclient.md#getdepth)
* [getOpenOrders](rpcclient.md#getopenorders)
* [getTokenInfo](rpcclient.md#gettokeninfo)
* [getTradingPairs](rpcclient.md#gettradingpairs)
* [listAllTokens](rpcclient.md#listalltokens)

## Constructors

###  constructor

\+ **new RpcClient**(`uriString`: string, `netWork`: keyof typeof NETWORK_PREFIX_MAPPING): *[RpcClient](rpcclient.md)*

*Defined in [rpc/index.ts:36](https://github.com/binance-chain/javascript-sdk/blob/03c8bcb/src/rpc/index.ts#L36)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`uriString` | string | "localhost:27146" | dataseed address |
`netWork` | keyof typeof NETWORK_PREFIX_MAPPING | - | Binance Chain network  |

**Returns:** *[RpcClient](rpcclient.md)*

## Methods

###  broadcastDelegate

▸ **broadcastDelegate**(`signedTx`: [Transaction](transaction.md)): *Promise‹any›*

*Defined in [rpc/index.ts:55](https://github.com/binance-chain/javascript-sdk/blob/03c8bcb/src/rpc/index.ts#L55)*

The RPC broadcast delegate broadcasts a transaction via RPC. This is intended for optional use as BncClient's broadcast delegate.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`signedTx` | [Transaction](transaction.md) | the signed transaction |

**Returns:** *Promise‹any›*

___

###  getAccount

▸ **getAccount**(`address`: string): *Promise‹object›*

*Defined in [rpc/index.ts:132](https://github.com/binance-chain/javascript-sdk/blob/03c8bcb/src/rpc/index.ts#L132)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Promise‹object›*

Account info

___

###  getBalance

▸ **getBalance**(`address`: string, `symbol`: string): *Promise‹undefined | TokenBalance‹››*

*Defined in [rpc/index.ts:190](https://github.com/binance-chain/javascript-sdk/blob/03c8bcb/src/rpc/index.ts#L190)*

get balance by symbol and address

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |
`symbol` | string |

**Returns:** *Promise‹undefined | TokenBalance‹››*

___

###  getBalances

▸ **getBalances**(`address`: string): *Promise‹TokenBalance‹›[]›*

*Defined in [rpc/index.ts:155](https://github.com/binance-chain/javascript-sdk/blob/03c8bcb/src/rpc/index.ts#L155)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Promise‹TokenBalance‹›[]›*

___

###  getDepth

▸ **getDepth**(`tradePair`: string): *Promise‹any›*

*Defined in [rpc/index.ts:240](https://github.com/binance-chain/javascript-sdk/blob/03c8bcb/src/rpc/index.ts#L240)*

**Parameters:**

Name | Type |
------ | ------ |
`tradePair` | string |

**Returns:** *Promise‹any›*

___

###  getOpenOrders

▸ **getOpenOrders**(`address`: string, `symbol`: string): *Promise‹any›*

*Defined in [rpc/index.ts:204](https://github.com/binance-chain/javascript-sdk/blob/03c8bcb/src/rpc/index.ts#L204)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |
`symbol` | string |

**Returns:** *Promise‹any›*

___

###  getTokenInfo

▸ **getTokenInfo**(`symbol`: string): *Promise‹object›*

*Defined in [rpc/index.ts:86](https://github.com/binance-chain/javascript-sdk/blob/03c8bcb/src/rpc/index.ts#L86)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`symbol` | string | required |

**Returns:** *Promise‹object›*

token detail info

___

###  getTradingPairs

▸ **getTradingPairs**(`offset`: number, `limit`: number): *Promise‹any›*

*Defined in [rpc/index.ts:222](https://github.com/binance-chain/javascript-sdk/blob/03c8bcb/src/rpc/index.ts#L222)*

**Parameters:**

Name | Type |
------ | ------ |
`offset` | number |
`limit` | number |

**Returns:** *Promise‹any›*

___

###  listAllTokens

▸ **listAllTokens**(`offset`: number, `limit`: number): *Promise‹any›*

*Defined in [rpc/index.ts:109](https://github.com/binance-chain/javascript-sdk/blob/03c8bcb/src/rpc/index.ts#L109)*

get tokens by offset and limit

**Parameters:**

Name | Type |
------ | ------ |
`offset` | number |
`limit` | number |

**Returns:** *Promise‹any›*

token list
