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

*Defined in [client/bridge/index.ts:22](https://github.com/binance-chain/javascript-sdk/blob/2f1f2a6/src/client/bridge/index.ts#L22)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bncClient` | [BncClient](bncclient.md) |   |

**Returns:** *[Bridge](bridge.md)*

## Methods

###  bind

▸ **bind**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:166](https://github.com/binance-chain/javascript-sdk/blob/2f1f2a6/src/client/bridge/index.ts#L166)*

bind smart chain token to bep2 token

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*

___

###  transferIn

▸ **transferIn**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:39](https://github.com/binance-chain/javascript-sdk/blob/2f1f2a6/src/client/bridge/index.ts#L39)*

transfer smart chain token to binance chain receiver

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*

___

###  transferOut

▸ **transferOut**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:204](https://github.com/binance-chain/javascript-sdk/blob/2f1f2a6/src/client/bridge/index.ts#L204)*

transfer bep2 token to smart chain

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*

___

###  transferOutRefund

▸ **transferOutRefund**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:121](https://github.com/binance-chain/javascript-sdk/blob/2f1f2a6/src/client/bridge/index.ts#L121)*

refund tokens to sender if transfer to smart chain failed

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*

___

###  upateBind

▸ **upateBind**(`__namedParameters`: object): *Promise‹object›*

*Defined in [client/bridge/index.ts:236](https://github.com/binance-chain/javascript-sdk/blob/2f1f2a6/src/client/bridge/index.ts#L236)*

update bind request when events from smart chain received

**Parameters:**

Name | Type |
------ | ------ |
`__namedParameters` | object |

**Returns:** *Promise‹object›*
