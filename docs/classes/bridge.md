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
* [transferIn](bridge.md#transferin)
* [transferOut](bridge.md#transferout)
* [transferOutRefund](bridge.md#transferoutrefund)
* [upateBind](bridge.md#upatebind)

## Constructors

###  constructor

\+ **new Bridge**(`bncClient`: [BncClient](bncclient.md)): *[Bridge](bridge.md)*

*Defined in [client/bridge/index.ts:21](https://github.com/binance-chain/javascript-sdk/blob/419c3d2/src/client/bridge/index.ts#L21)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bncClient` | [BncClient](bncclient.md) |   |

**Returns:** *[Bridge](bridge.md)*

## Methods

###  bind

▸ **bind**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:165](https://github.com/binance-chain/javascript-sdk/blob/419c3d2/src/client/bridge/index.ts#L165)*

bind smart chain token to bep2 token

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*

___

###  transferIn

▸ **transferIn**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:38](https://github.com/binance-chain/javascript-sdk/blob/419c3d2/src/client/bridge/index.ts#L38)*

transfer smart chain token to binance chain receiver

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*

___

###  transferOut

▸ **transferOut**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:203](https://github.com/binance-chain/javascript-sdk/blob/419c3d2/src/client/bridge/index.ts#L203)*

transfer bep2 token to smart chain

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*

___

###  transferOutRefund

▸ **transferOutRefund**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:120](https://github.com/binance-chain/javascript-sdk/blob/419c3d2/src/client/bridge/index.ts#L120)*

refund tokens to sender if transfer to smart chain failed

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*

___

###  upateBind

▸ **upateBind**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:235](https://github.com/binance-chain/javascript-sdk/blob/419c3d2/src/client/bridge/index.ts#L235)*

update bind request when events from smart chain received

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*
