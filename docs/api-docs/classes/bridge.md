
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

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bncClient` | [BncClient](bncclient.md) |   |

**Returns:** *[Bridge](bridge.md)*

## Methods

###  bind

▸ **bind**(`__namedParameters`: object): *Promise‹object›*

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

transfer token from BNB Beacon Chain to BNB Smart Chain

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

transfer smart chain token to BNB Beacon Chain receiver

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
