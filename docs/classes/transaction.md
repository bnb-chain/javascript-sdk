[@binance-chain/javascript-sdk](../README.md) › [Transaction](transaction.md)

# Class: Transaction

Creates a new transaction object.

**`example`** 
var rawTx = {
  account_number: 1,
  chain_id: 'bnbchain-1000',
  memo: '',
  msg: {},
  type: 'NewOrderMsg',
  sequence: 29,
  source: 0
};
var tx = new Transaction(rawTx);

**`property`** {Buffer} raw The raw vstruct encoded transaction

**`param`** account number

**`param`** bnbChain Id

**`param`** transaction memo

**`param`** transaction type

**`param`** object data of tx type

**`param`** transaction counts

**`param`** where does this transaction come from

## Hierarchy

* **Transaction**

## Index

### Methods

* [_serializePubKey](transaction.md#private-_serializepubkey)
* [addSignature](transaction.md#addsignature)
* [getSignBytes](transaction.md#getsignbytes)
* [serialize](transaction.md#serialize)
* [sign](transaction.md#sign)

## Methods

### `Private` _serializePubKey

▸ **_serializePubKey**(`unencodedPubKey`: BasePoint): *Buffer‹›*

*Defined in [tx/index.ts:158](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/tx/index.ts#L158)*

serializes a public key in a 33-byte compressed format.

**Parameters:**

Name | Type |
------ | ------ |
`unencodedPubKey` | BasePoint |

**Returns:** *Buffer‹›*

___

###  addSignature

▸ **addSignature**(`pubKey`: BasePoint, `signature`: Buffer): *this*

*Defined in [tx/index.ts:99](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/tx/index.ts#L99)*

attaches a signature to the transaction

**Parameters:**

Name | Type |
------ | ------ |
`pubKey` | BasePoint |
`signature` | Buffer |

**Returns:** *this*

___

###  getSignBytes

▸ **getSignBytes**(`msg?`: SignMsg): *Buffer‹›*

*Defined in [tx/index.ts:78](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/tx/index.ts#L78)*

generate the sign bytes for a transaction, given a msg

**Parameters:**

Name | Type |
------ | ------ |
`msg?` | SignMsg |

**Returns:** *Buffer‹›*

___

###  serialize

▸ **serialize**(): *string*

*Defined in [tx/index.ts:136](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/tx/index.ts#L136)*

encode signed transaction to hex which is compatible with amino

**Returns:** *string*

___

###  sign

▸ **sign**(`privateKey`: string, `msg?`: SignMsg): *this*

*Defined in [tx/index.ts:118](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/tx/index.ts#L118)*

sign transaction with a given private key and msg

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | string | private key hex string |
`msg?` | SignMsg | - |

**Returns:** *this*
