
# Class: Transaction

Creates a new transaction object.

**`example`** 
var rawTx = {
  accountNumber: 1,
  chainId: 'bnbchain-1000',
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

serializes a public key in a 33-byte compressed format.

**Parameters:**

Name | Type |
------ | ------ |
`unencodedPubKey` | BasePoint |

**Returns:** *Buffer‹›*

___

###  addSignature

▸ **addSignature**(`pubKey`: BasePoint, `signature`: Buffer): *[Transaction](transaction.md)*

attaches a signature to the transaction

**Parameters:**

Name | Type |
------ | ------ |
`pubKey` | BasePoint |
`signature` | Buffer |

**Returns:** *[Transaction](transaction.md)*

___

###  getSignBytes

▸ **getSignBytes**(`msg?`: SignMsg): *Buffer*

generate the sign bytes for a transaction, given a msg

**Parameters:**

Name | Type |
------ | ------ |
`msg?` | SignMsg |

**Returns:** *Buffer*

___

###  serialize

▸ **serialize**(): *string*

encode signed transaction to hex which is compatible with amino

**Returns:** *string*

___

###  sign

▸ **sign**(`privateKey`: string, `msg?`: SignMsg): *[Transaction](transaction.md)*

sign transaction with a given private key and msg

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | string | private key hex string |
`msg?` | SignMsg | - |

**Returns:** *[Transaction](transaction.md)*
