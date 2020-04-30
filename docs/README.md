[@binance-chain/javascript-sdk](README.md)

# @binance-chain/javascript-sdk

## Index

### Classes

* [BncClient](classes/bncclient.md)
* [HttpRequest](classes/httprequest.md)
* [LedgerApp](classes/ledgerapp.md)
* [RpcClient](classes/rpcclient.md)
* [SendMsg](classes/sendmsg.md)
* [Transaction](classes/transaction.md)

### Variables

* [validateMnemonic](README.md#const-validatemnemonic)
* [voteOption](README.md#const-voteoption)

### Functions

* [DefaultBroadcastDelegate](README.md#const-defaultbroadcastdelegate)
* [DefaultSigningDelegate](README.md#const-defaultsigningdelegate)
* [LedgerSigningDelegate](README.md#const-ledgersigningdelegate)
* [ab2hexstring](README.md#const-ab2hexstring)
* [ab2str](README.md#const-ab2str)
* [calInputCoins](README.md#const-calinputcoins)
* [calculateRandomNumberHash](README.md#const-calculaterandomnumberhash)
* [calculateSwapID](README.md#const-calculateswapid)
* [checkAddress](README.md#const-checkaddress)
* [checkCoins](README.md#const-checkcoins)
* [checkNumber](README.md#const-checknumber)
* [checkOutputs](README.md#const-checkoutputs)
* [convertObjectToSignBytes](README.md#const-convertobjecttosignbytes)
* [decodeAddress](README.md#const-decodeaddress)
* [encodeAddress](README.md#const-encodeaddress)
* [encodeArrayBinary](README.md#const-encodearraybinary)
* [encodeBinary](README.md#const-encodebinary)
* [encodeBinaryByteArray](README.md#const-encodebinarybytearray)
* [encodeBool](README.md#const-encodebool)
* [encodeNumber](README.md#const-encodenumber)
* [encodeObjectBinary](README.md#const-encodeobjectbinary)
* [encodeString](README.md#const-encodestring)
* [encodeTime](README.md#const-encodetime)
* [ensureHex](README.md#const-ensurehex)
* [generateKeyStore](README.md#const-generatekeystore)
* [generateMnemonic](README.md#const-generatemnemonic)
* [generatePrivateKey](README.md#const-generateprivatekey)
* [generatePubKey](README.md#const-generatepubkey)
* [generateRandomArray](README.md#const-generaterandomarray)
* [generateSignature](README.md#const-generatesignature)
* [getAddressFromPrivateKey](README.md#const-getaddressfromprivatekey)
* [getAddressFromPublicKey](README.md#const-getaddressfrompublickey)
* [getPrivateKeyFromKeyStore](README.md#const-getprivatekeyfromkeystore)
* [getPrivateKeyFromMnemonic](README.md#const-getprivatekeyfrommnemonic)
* [getPublicKey](README.md#const-getpublickey)
* [getPublicKeyFromPrivateKey](README.md#const-getpublickeyfromprivatekey)
* [hexXor](README.md#const-hexxor)
* [hexstring2ab](README.md#const-hexstring2ab)
* [hexstring2str](README.md#const-hexstring2str)
* [int2hex](README.md#const-int2hex)
* [isHex](README.md#const-ishex)
* [marshalBinary](README.md#const-marshalbinary)
* [marshalBinaryBare](README.md#const-marshalbinarybare)
* [num2VarInt](README.md#const-num2varint)
* [num2hexstring](README.md#const-num2hexstring)
* [reverseArray](README.md#const-reversearray)
* [reverseHex](README.md#const-reversehex)
* [sha256](README.md#const-sha256)
* [sha256ripemd160](README.md#const-sha256ripemd160)
* [sha3](README.md#const-sha3)
* [str2ab](README.md#const-str2ab)
* [str2hexstring](README.md#const-str2hexstring)
* [unMarshalBinaryBare](README.md#const-unmarshalbinarybare)
* [unMarshalBinaryLengthPrefixed](README.md#const-unmarshalbinarylengthprefixed)
* [verifySignature](README.md#const-verifysignature)

## Variables

### `Const` validateMnemonic

• **validateMnemonic**: *validateMnemonic* = bip39.validateMnemonic

*Defined in [crypto/index.ts:353](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L353)*

Validates mnemonic phrase words.

**`param`** the mnemonic phrase words

**`returns`** validation result

___

### `Const` voteOption

• **voteOption**: *object* = {
  OptionEmpty: 0x00,
  OptionYes: 0x01,
  OptionAbstain: 0x02,
  OptionNo: 0x03,
  OptionNoWithVeto: 0x04,
} as const

*Defined in [client/gov/index.ts:34](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/client/gov/index.ts#L34)*

VoteOption

**`example`** 
OptionEmpty - 0x00
OptionYes - 0x01
OptionAbstain - 0x02
OptionNo - 0x03
OptionNoWithVeto - 0x04

#### Type declaration:

## Functions

### `Const` DefaultBroadcastDelegate

▸ **DefaultBroadcastDelegate**(`this`: [BncClient](classes/bncclient.md), `signedTx`: [Transaction](classes/transaction.md)): *Promise‹object›*

*Defined in [client/index.ts:54](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/client/index.ts#L54)*

The default broadcast delegate which immediately broadcasts a transaction.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | [BncClient](classes/bncclient.md) | - |
`signedTx` | [Transaction](classes/transaction.md) | the signed transaction  |

**Returns:** *Promise‹object›*

___

### `Const` DefaultSigningDelegate

▸ **DefaultSigningDelegate**(`this`: [BncClient](classes/bncclient.md), `tx`: [Transaction](classes/transaction.md), `signMsg?`: any): *Promise‹[Transaction](classes/transaction.md)›*

*Defined in [client/index.ts:42](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/client/index.ts#L42)*

The default signing delegate which uses the local private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | [BncClient](classes/bncclient.md) | - |
`tx` | [Transaction](classes/transaction.md) | the transaction |
`signMsg?` | any | the canonical sign bytes for the msg |

**Returns:** *Promise‹[Transaction](classes/transaction.md)›*

___

### `Const` LedgerSigningDelegate

▸ **LedgerSigningDelegate**(`ledgerApp`: [LedgerApp](classes/ledgerapp.md), `preSignCb`: function, `postSignCb`: function, `errCb`: function, `hdPath`: number[]): *typeof DefaultSigningDelegate*

*Defined in [client/index.ts:69](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/client/index.ts#L69)*

The Ledger signing delegate.

**Parameters:**

▪ **ledgerApp**: *[LedgerApp](classes/ledgerapp.md)*

▪ **preSignCb**: *function*

▸ (`preSignCb`: Buffer): *void*

**Parameters:**

Name | Type |
------ | ------ |
`preSignCb` | Buffer |

▪ **postSignCb**: *function*

▸ (`pubKeyResp`: PublicKey, `sigResp`: SignedSignature): *void*

**Parameters:**

Name | Type |
------ | ------ |
`pubKeyResp` | PublicKey |
`sigResp` | SignedSignature |

▪ **errCb**: *function*

▸ (`error`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

▪ **hdPath**: *number[]*

**Returns:** *typeof DefaultSigningDelegate*

___

### `Const` ab2hexstring

▸ **ab2hexstring**(`arr`: any): *string*

*Defined in [utils/cryptoHelper.ts:58](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`arr` | any |

**Returns:** *string*

HEX string

___

### `Const` ab2str

▸ **ab2str**(`buf`: Uint8Array): *void*

*Defined in [utils/cryptoHelper.ts:15](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`buf` | Uint8Array |

**Returns:** *void*

ASCII string

___

### `Const` calInputCoins

▸ **calInputCoins**(`inputs`: Array‹object›, `coins`: Coin[]): *void*

*Defined in [client/index.ts:116](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/client/index.ts#L116)*

sum corresponding input coin

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`inputs` | Array‹object› | - |
`coins` | Coin[] |   |

**Returns:** *void*

___

### `Const` calculateRandomNumberHash

▸ **calculateRandomNumberHash**(`randomNumber`: string, `timestamp`: number): *string*

*Defined in [utils/cryptoHelper.ts:267](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L267)*

Computes sha256 of random number and timestamp

**Parameters:**

Name | Type |
------ | ------ |
`randomNumber` | string |
`timestamp` | number |

**Returns:** *string*

sha256 result

___

### `Const` calculateSwapID

▸ **calculateSwapID**(`randomNumberHash`: string, `sender`: string, `senderOtherChain`: string): *string*

*Defined in [utils/cryptoHelper.ts:291](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L291)*

Computes swapID

**Parameters:**

Name | Type |
------ | ------ |
`randomNumberHash` | string |
`sender` | string |
`senderOtherChain` | string |

**Returns:** *string*

sha256 result

___

### `Const` checkAddress

▸ **checkAddress**(`address`: string, `hrp`: string): *boolean*

*Defined in [crypto/index.ts:64](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L64)*

Checks whether an address is valid.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | the bech32 address to decode |
`hrp` | string | the prefix to check for the bech32 address |

**Returns:** *boolean*

___

### `Const` checkCoins

▸ **checkCoins**(`coins`: Coin[]): *void*

*Defined in [utils/validateHelper.ts:24](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/validateHelper.ts#L24)*

basic validation of coins

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`coins` | Coin[] |   |

**Returns:** *void*

___

### `Const` checkNumber

▸ **checkNumber**(`value`: BigSource, `name`: string): *void*

*Defined in [utils/validateHelper.ts:10](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/validateHelper.ts#L10)*

validate the input number.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`value` | BigSource | - |   |
`name` | string | "input number" | - |

**Returns:** *void*

___

### `Const` checkOutputs

▸ **checkOutputs**(`outputs`: Transfer[]): *void*

*Defined in [client/index.ts:99](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/client/index.ts#L99)*

validate the input number.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`outputs` | Transfer[] |   |

**Returns:** *void*

___

### `Const` convertObjectToSignBytes

▸ **convertObjectToSignBytes**(`obj`: any): *Buffer‹›*

*Defined in [amino/encoder/index.ts:71](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/encoder/index.ts#L71)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`obj` | any | -- {object} |

**Returns:** *Buffer‹›*

bytes {Buffer}

___

### `Const` decodeAddress

▸ **decodeAddress**(`value`: string): *Buffer*

*Defined in [crypto/index.ts:53](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L53)*

Decodes an address in bech32 format.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | string | the bech32 address to decode  |

**Returns:** *Buffer*

___

### `Const` encodeAddress

▸ **encodeAddress**(`value`: string | Buffer, `prefix`: string, `type`: BufferEncoding): *string*

*Defined in [crypto/index.ts:91](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L91)*

Encodes an address from input data bytes.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`value` | string &#124; Buffer | - | the public key to encode |
`prefix` | string | "tbnb" | the address prefix |
`type` | BufferEncoding | "hex" | the output type (default: hex)  |

**Returns:** *string*

___

### `Const` encodeArrayBinary

▸ **encodeArrayBinary**(`fieldNum`: number | undefined, `arr`: any[], `isByteLenPrefix?`: undefined | false | true): *Buffer‹›*

*Defined in [amino/encoder/index.ts:192](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/encoder/index.ts#L192)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fieldNum` | number &#124; undefined | object field index |
`arr` | any[] | - |
`isByteLenPrefix?` | undefined &#124; false &#124; true | - |

**Returns:** *Buffer‹›*

bytes of array

___

### `Const` encodeBinary

▸ **encodeBinary**(`val`: any, `fieldNum?`: undefined | number, `isByteLenPrefix?`: undefined | false | true): *any*

*Defined in [amino/encoder/index.ts:101](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/encoder/index.ts#L101)*

This is the main entrypoint for encoding all types in binary form.

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |
`fieldNum?` | undefined &#124; number |
`isByteLenPrefix?` | undefined &#124; false &#124; true |

**Returns:** *any*

binary of object.

___

### `Const` encodeBinaryByteArray

▸ **encodeBinaryByteArray**(`bytes`: Buffer): *Buffer‹›*

*Defined in [amino/encoder/index.ts:143](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/encoder/index.ts#L143)*

prefixed with bytes length

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Buffer |

**Returns:** *Buffer‹›*

with bytes length prefixed

___

### `Const` encodeBool

▸ **encodeBool**(`b`: boolean): *any*

*Defined in [amino/encoder/index.ts:33](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/encoder/index.ts#L33)*

encode bool

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`b` | boolean |   |

**Returns:** *any*

___

### `Const` encodeNumber

▸ **encodeNumber**(`num`: number): *any*

*Defined in [amino/encoder/index.ts:27](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/encoder/index.ts#L27)*

encode number

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | number |   |

**Returns:** *any*

___

### `Const` encodeObjectBinary

▸ **encodeObjectBinary**(`obj`: any, `isByteLenPrefix?`: undefined | false | true): *Buffer‹›*

*Defined in [amino/encoder/index.ts:153](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/encoder/index.ts#L153)*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | any |
`isByteLenPrefix?` | undefined &#124; false &#124; true |

**Returns:** *Buffer‹›*

with bytes length prefixed

___

### `Const` encodeString

▸ **encodeString**(`str`: string): *Buffer‹›*

*Defined in [amino/encoder/index.ts:40](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/encoder/index.ts#L40)*

encode string

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string |   |

**Returns:** *Buffer‹›*

___

### `Const` encodeTime

▸ **encodeTime**(`value`: string | Date): *Buffer‹›*

*Defined in [amino/encoder/index.ts:49](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/encoder/index.ts#L49)*

encode time

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | string &#124; Date |   |

**Returns:** *Buffer‹›*

___

### `Const` ensureHex

▸ **ensureHex**(`str`: string): *void*

*Defined in [utils/cryptoHelper.ts:219](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L219)*

Throws an error if input is not hexstring.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string |   |

**Returns:** *void*

___

### `Const` generateKeyStore

▸ **generateKeyStore**(`privateKeyHex`: string, `password`: string): *KeyStore*

*Defined in [crypto/index.ts:233](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L233)*

Generates a keystore object (web3 secret storage format) given a private key to store and a password.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKeyHex` | string | the private key hexstring. |
`password` | string | the password. |

**Returns:** *KeyStore*

the keystore object.

___

### `Const` generateMnemonic

▸ **generateMnemonic**(): *string*

*Defined in [crypto/index.ts:345](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L345)*

Generates mnemonic phrase words using random entropy.

**Returns:** *string*

___

### `Const` generatePrivateKey

▸ **generatePrivateKey**(`len`: number): *string*

*Defined in [crypto/index.ts:110](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L110)*

Generates 32 bytes of random entropy

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`len` | number | PRIVKEY_LEN | output length (default: 32 bytes) |

**Returns:** *string*

entropy bytes hexstring

___

### `Const` generatePubKey

▸ **generatePubKey**(`privateKey`: Buffer): *BasePoint*

*Defined in [crypto/index.ts:151](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L151)*

PubKey performs the point-scalar multiplication from the privKey on the
generator point to get the pubkey.

**Parameters:**

Name | Type |
------ | ------ |
`privateKey` | Buffer |

**Returns:** *BasePoint*

PubKey

___

### `Const` generateRandomArray

▸ **generateRandomArray**(`length`: number): *ArrayBuffer*

*Defined in [crypto/index.ts:118](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L118)*

Generates an arrayBuffer filled with random bits.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`length` | number | Length of buffer. |

**Returns:** *ArrayBuffer*

___

### `Const` generateSignature

▸ **generateSignature**(`signBytesHex`: string, `privateKey`: string | Buffer): *Buffer*

*Defined in [crypto/index.ts:195](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L195)*

Generates a signature (64 byte <r,s>) for a transaction based on given private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`signBytesHex` | string | Unsigned transaction sign bytes hexstring. |
`privateKey` | string &#124; Buffer | The private key. |

**Returns:** *Buffer*

Signature. Does not include tx.

___

### `Const` getAddressFromPrivateKey

▸ **getAddressFromPrivateKey**(`privateKeyHex`: string, `prefix?`: undefined | string): *string*

*Defined in [crypto/index.ts:179](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L179)*

Gets an address from a private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKeyHex` | string | the private key hexstring  |
`prefix?` | undefined &#124; string | - |

**Returns:** *string*

___

### `Const` getAddressFromPublicKey

▸ **getAddressFromPublicKey**(`publicKeyHex`: string, `prefix?`: undefined | string): *string*

*Defined in [crypto/index.ts:162](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L162)*

Gets an address from a public key hex.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`publicKeyHex` | string | the public key hexstring |
`prefix?` | undefined &#124; string | the address prefix  |

**Returns:** *string*

___

### `Const` getPrivateKeyFromKeyStore

▸ **getPrivateKeyFromKeyStore**(`keystore`: string, `password`: string): *string*

*Defined in [crypto/index.ts:291](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L291)*

Gets a private key from a keystore given its password.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keystore` | string | the keystore in json format |
`password` | string | the password.  |

**Returns:** *string*

___

### `Const` getPrivateKeyFromMnemonic

▸ **getPrivateKeyFromMnemonic**(`mnemonic`: string, `derive`: boolean, `index`: number, `password`: string): *string*

*Defined in [crypto/index.ts:363](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L363)*

Get a private key from mnemonic words.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`mnemonic` | string | - | the mnemonic phrase words |
`derive` | boolean | true | derive a private key using the default HD path (default: true) |
`index` | number | 0 | the bip44 address index (default: 0) |
`password` | string | "" | according to bip39 |

**Returns:** *string*

hexstring

___

### `Const` getPublicKey

▸ **getPublicKey**(`publicKey`: string): *BasePoint‹›*

*Defined in [crypto/index.ts:125](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L125)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`publicKey` | string | Encoded public key |

**Returns:** *BasePoint‹›*

public key hexstring

___

### `Const` getPublicKeyFromPrivateKey

▸ **getPublicKeyFromPrivateKey**(`privateKeyHex`: string): *string*

*Defined in [crypto/index.ts:135](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L135)*

Calculates the public key from a given private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKeyHex` | string | the private key hexstring |

**Returns:** *string*

public key hexstring

___

### `Const` hexXor

▸ **hexXor**(`str1`: string, `str2`: string): *string*

*Defined in [utils/cryptoHelper.ts:150](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L150)*

XORs two hexstrings

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str1` | string | HEX string |
`str2` | string | HEX string |

**Returns:** *string*

XOR output as a HEX string

___

### `Const` hexstring2ab

▸ **hexstring2ab**(`str`: string): *Uint8Array‹›*

*Defined in [utils/cryptoHelper.ts:42](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L42)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string | HEX string |

**Returns:** *Uint8Array‹›*

___

### `Const` hexstring2str

▸ **hexstring2str**(`hexstring`: string): *void*

*Defined in [utils/cryptoHelper.ts:81](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L81)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hexstring` | string | HEX string |

**Returns:** *void*

ASCII string

___

### `Const` int2hex

▸ **int2hex**(`num`: number): *string*

*Defined in [utils/cryptoHelper.ts:89](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L89)*

convert an integer to big endian hex and add leading zeros

**Parameters:**

Name | Type |
------ | ------ |
`num` | number |

**Returns:** *string*

___

### `Const` isHex

▸ **isHex**(`str`: string): *boolean*

*Defined in [utils/cryptoHelper.ts:207](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L207)*

Checks if input is a hexstring. Empty string is considered a hexstring.

**`example`** 
isHex('0101') = true
isHex('') = true
isHex('0x01') = false

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *boolean*

___

### `Const` marshalBinary

▸ **marshalBinary**(`obj`: any): *any*

*Defined in [amino/encoder/index.ts:78](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/encoder/index.ts#L78)*

js amino MarshalBinary

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`obj` | any |   |

**Returns:** *any*

___

### `Const` marshalBinaryBare

▸ **marshalBinaryBare**(`obj`: any): *any*

*Defined in [amino/encoder/index.ts:88](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/encoder/index.ts#L88)*

js amino MarshalBinaryBare

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`obj` | any |   |

**Returns:** *any*

___

### `Const` num2VarInt

▸ **num2VarInt**(`num`: number): *string*

*Defined in [utils/cryptoHelper.ts:129](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L129)*

Converts a number to a variable length Int. Used for array length header

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | number | The number |

**Returns:** *string*

hexstring of the variable Int.

___

### `Const` num2hexstring

▸ **num2hexstring**(`num`: number, `size`: number, `littleEndian`: boolean): *string*

*Defined in [utils/cryptoHelper.ts:104](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L104)*

Converts a number to a big endian hexstring of a suitable size, optionally little endian

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`num` | number | - | - |
`size` | number | 1 | The required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1. |
`littleEndian` | boolean | false | Encode the hex in little endian form |

**Returns:** *string*

___

### `Const` reverseArray

▸ **reverseArray**(`arr`: any[]): *Uint8Array‹›*

*Defined in [utils/cryptoHelper.ts:169](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L169)*

Reverses an array. Accepts arrayBuffer.

**Parameters:**

Name | Type |
------ | ------ |
`arr` | any[] |

**Returns:** *Uint8Array‹›*

___

### `Const` reverseHex

▸ **reverseHex**(`hex`: string): *string*

*Defined in [utils/cryptoHelper.ts:187](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L187)*

Reverses a HEX string, treating 2 chars as a byte.

**`example`** 
reverseHex('abcdef') = 'efcdab'

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hex` | string | HEX string |

**Returns:** *string*

HEX string reversed in 2s.

___

### `Const` sha256

▸ **sha256**(`hex`: string): *string*

*Defined in [utils/cryptoHelper.ts:242](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L242)*

Computes a single SHA256 digest.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hex` | string | message to hash |

**Returns:** *string*

hash output

___

### `Const` sha256ripemd160

▸ **sha256ripemd160**(`hex`: string): *string*

*Defined in [utils/cryptoHelper.ts:228](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L228)*

Computes a SHA256 followed by a RIPEMD160.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hex` | string | message to hash |

**Returns:** *string*

hash output

___

### `Const` sha3

▸ **sha3**(`hex`: string): *string*

*Defined in [utils/cryptoHelper.ts:254](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L254)*

Computes a single SHA3 (Keccak) digest.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hex` | string | message to hash |

**Returns:** *string*

hash output

___

### `Const` str2ab

▸ **str2ab**(`str`: string): *Uint8Array‹›*

*Defined in [utils/cryptoHelper.ts:27](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L27)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string | ASCII string |

**Returns:** *Uint8Array‹›*

___

### `Const` str2hexstring

▸ **str2hexstring**(`str`: string): *string*

*Defined in [utils/cryptoHelper.ts:75](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/utils/cryptoHelper.ts#L75)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string | ASCII string |

**Returns:** *string*

HEX string

___

### `Const` unMarshalBinaryBare

▸ **unMarshalBinaryBare**(`bytes`: Buffer, `type`: any): *object*

*Defined in [amino/decoder/index.ts:50](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/decoder/index.ts#L50)*

js amino UnmarshalBinaryBare

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Buffer |
`type` | any |

**Returns:** *object*

___

### `Const` unMarshalBinaryLengthPrefixed

▸ **unMarshalBinaryLengthPrefixed**(`bytes`: Buffer, `type`: any): *object*

*Defined in [amino/decoder/index.ts:27](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/amino/decoder/index.ts#L27)*

js amino UnmarshalBinaryLengthPrefixed

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Buffer |
`type` | any |

**Returns:** *object*

___

### `Const` verifySignature

▸ **verifySignature**(`sigHex`: string, `signBytesHex`: string, `publicKeyHex`: string): *boolean*

*Defined in [crypto/index.ts:215](https://github.com/binance-chain/javascript-sdk/blob/da1c1f0/src/crypto/index.ts#L215)*

Verifies a signature (64 byte <r,s>) given the sign bytes and public key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sigHex` | string | The signature hexstring. |
`signBytesHex` | string | Unsigned transaction sign bytes hexstring. |
`publicKeyHex` | string | The public key. |

**Returns:** *boolean*
