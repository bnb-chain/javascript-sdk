[@binance-chain/javascript-sdk](../README.md) › [Bridge](bridge.md)

# Class: Bridge

Bridge

## Hierarchy

* **Bridge**

## Index

### Constructors

* [constructor](bridge.md#constructor)

### Methods

* [bind](bridge.md#bind)
* [transferFromBcToBsc](bridge.md#transferfrombctobsc)
* [transferIn](bridge.md#transferin)
* [transferOutRefund](bridge.md#transferoutrefund)
* [upateBind](bridge.md#upatebind)

## Constructors

###  constructor

\+ **new Bridge**(`bncClient`: [BncClient](bncclient.md)): *[Bridge](bridge.md)*

*Defined in [client/bridge/index.ts:20](https://github.com/binance-chain/javascript-sdk/blob/567ede2/src/client/bridge/index.ts#L20)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bncClient` | [BncClient](bncclient.md) |   |

**Returns:** *[Bridge](bridge.md)*

## Methods

###  bind

▸ **bind**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:164](https://github.com/binance-chain/javascript-sdk/blob/567ede2/src/client/bridge/index.ts#L164)*

bind smart chain token to bep2 token

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*

___

###  transferFromBcToBsc

▸ **transferFromBcToBsc**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:202](https://github.com/binance-chain/javascript-sdk/blob/567ede2/src/client/bridge/index.ts#L202)*

transfer token from Binance Chain to Binance Smart Chain

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*

___

###  transferIn

▸ **transferIn**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:37](https://github.com/binance-chain/javascript-sdk/blob/567ede2/src/client/bridge/index.ts#L37)*

transfer smart chain token to binance chain receiver

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*

___

###  transferOutRefund

▸ **transferOutRefund**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:119](https://github.com/binance-chain/javascript-sdk/blob/567ede2/src/client/bridge/index.ts#L119)*

refund tokens to sender if transfer to smart chain failed

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*

___

###  upateBind

▸ **upateBind**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:236](https://github.com/binance-chain/javascript-sdk/blob/567ede2/src/client/bridge/index.ts#L236)*

update bind request when events from smart chain received

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*
