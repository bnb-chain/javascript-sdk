
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

*Defined in [src/client/bridge/index.ts:20](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/bridge/index.ts#L20)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bncClient` | [BncClient](bncclient.md) |   |

**Returns:** *[Bridge](bridge.md)*

## Methods

###  bind

▸ **bind**(`__namedParameters`: object): *Promise‹object›*

*Defined in [src/client/bridge/index.ts:164](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/bridge/index.ts#L164)*

bind smart chain token to bep2 token

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`amount` | number |
`contractAddress` | string |
`contractDecimal` | number |
`expireTime` | number |
`fromAddress` | string |
`symbol` | string |

**Returns:** *Promise‹object›*

___

###  transferFromBcToBsc

▸ **transferFromBcToBsc**(`__namedParameters`: object): *Promise‹object›*

*Defined in [src/client/bridge/index.ts:202](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/bridge/index.ts#L202)*

transfer token from Binance Chain to Binance Smart Chain

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`amount` | number |
`expireTime` | number |
`fromAddress` | string |
`symbol` | string |
`toAddress` | string |

**Returns:** *Promise‹object›*

___

###  transferIn

▸ **transferIn**(`__namedParameters`: object): *Promise‹object›*

*Defined in [src/client/bridge/index.ts:37](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/bridge/index.ts#L37)*

transfer smart chain token to binance chain receiver

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`amounts` | number[] |
`contract_address` | string |
`expire_time` | number |
`fromAddress` | string |
`receiver_addresses` | string[] |
`refund_addresses` | string[] |
`relay_fee` | Coin |
`sequence` | number |
`symbol` | string |

**Returns:** *Promise‹object›*

___

###  transferOutRefund

▸ **transferOutRefund**(`__namedParameters`: object): *Promise‹object›*

*Defined in [src/client/bridge/index.ts:119](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/bridge/index.ts#L119)*

refund tokens to sender if transfer to smart chain failed

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`amount` | Coin |
`fromAddress` | string |
`refund_address` | string |
`refund_reason` | RefundReason |
`transfer_out_sequence` | number |

**Returns:** *Promise‹object›*

___

###  upateBind

▸ **upateBind**(`__namedParameters`: object): *Promise‹object›*

*Defined in [src/client/bridge/index.ts:236](https://github.com/binance-chain/javascript-sdk/blob/595f658/src/client/bridge/index.ts#L236)*

update bind request when events from smart chain received

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`contract_address` | string |
`fromAddress` | string |
`sequence` | number |
`status` | BindStatus |
`symbol` | string |

**Returns:** *Promise‹object›*
