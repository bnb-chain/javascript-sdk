
# @binance-chain/javascript-sdk

## Index

### Classes

* [BncClient](classes/bncclient.md)
* [Bridge](classes/bridge.md)
* [LedgerApp](classes/ledgerapp.md)
* [RpcClient](classes/rpcclient.md)
* [TokenManagement](classes/tokenmanagement.md)
* [Transaction](classes/transaction.md)

### Other Functions

* [DefaultBroadcastDelegate](README.md#const-defaultbroadcastdelegate)
* [DefaultSigningDelegate](README.md#const-defaultsigningdelegate)
* [LedgerSigningDelegate](README.md#const-ledgersigningdelegate)
* [ab2hexstring](README.md#const-ab2hexstring)
* [ab2str](README.md#const-ab2str)
* [calInputCoins](README.md#const-calinputcoins)
* [calculateRandomNumberHash](README.md#const-calculaterandomnumberhash)
* [calculateSwapID](README.md#const-calculateswapid)
* [checkCoins](README.md#const-checkcoins)
* [checkNumber](README.md#const-checknumber)
* [checkOutputs](README.md#const-checkoutputs)
* [ensureHex](README.md#const-ensurehex)
* [hexXor](README.md#const-hexxor)
* [hexstring2ab](README.md#const-hexstring2ab)
* [hexstring2str](README.md#const-hexstring2str)
* [int2hex](README.md#const-int2hex)
* [isHex](README.md#const-ishex)
* [num2VarInt](README.md#const-num2varint)
* [num2hexstring](README.md#const-num2hexstring)
* [reverseArray](README.md#const-reversearray)
* [reverseHex](README.md#const-reversehex)
* [sha256](README.md#const-sha256)
* [sha256ripemd160](README.md#const-sha256ripemd160)
* [sha3](README.md#const-sha3)
* [str2ab](README.md#const-str2ab)
* [str2hexstring](README.md#const-str2hexstring)

### amino Functions

* [convertObjectToSignBytes](README.md#const-convertobjecttosignbytes)
* [encodeArrayBinary](README.md#const-encodearraybinary)
* [encodeBinary](README.md#const-encodebinary)
* [encodeBinaryByteArray](README.md#const-encodebinarybytearray)
* [encodeBool](README.md#const-encodebool)
* [encodeNumber](README.md#const-encodenumber)
* [encodeObjectBinary](README.md#const-encodeobjectbinary)
* [encodeString](README.md#const-encodestring)
* [encodeTime](README.md#const-encodetime)
* [marshalBinary](README.md#const-marshalbinary)
* [marshalBinaryBare](README.md#const-marshalbinarybare)

### amino
js amino UnmarshalBinaryBare Functions

* [unMarshalBinaryBare](README.md#const-unmarshalbinarybare)

### amino
js amino UnmarshalBinaryLengthPrefixed Functions

* [unMarshalBinaryLengthPrefixed](README.md#const-unmarshalbinarylengthprefixed)

### crypto Functions

* [checkAddress](README.md#const-checkaddress)
* [decodeAddress](README.md#const-decodeaddress)
* [encodeAddress](README.md#const-encodeaddress)
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
* [verifySignature](README.md#const-verifysignature)

## Other Functions

### `Const` DefaultBroadcastDelegate

▸ **DefaultBroadcastDelegate**(`this`: [BncClient](classes/bncclient.md), `signedTx`: [Transaction](classes/transaction.md)): *Promise‹object›*

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

**Parameters:**

Name | Type |
------ | ------ |
`arr` | any |

**Returns:** *string*

HEX string

___

### `Const` ab2str

▸ **ab2str**(`buf`: Uint8Array): *void*

**Parameters:**

Name | Type |
------ | ------ |
`buf` | Uint8Array |

**Returns:** *void*

ASCII string

___

### `Const` calInputCoins

▸ **calInputCoins**(`inputs`: Array‹object›, `coins`: Coin[]): *void*

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

### `Const` checkCoins

▸ **checkCoins**(`coins`: Coin[]): *void*

basic validation of coins

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`coins` | Coin[] |   |

**Returns:** *void*

___

### `Const` checkNumber

▸ **checkNumber**(`value`: BigSource, `name`: string): *void*

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

validate the input number.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`outputs` | Transfer[] |   |

**Returns:** *void*

___

### `Const` ensureHex

▸ **ensureHex**(`str`: string): *void*

Throws an error if input is not hexstring.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string |   |

**Returns:** *void*

___

### `Const` hexXor

▸ **hexXor**(`str1`: string, `str2`: string): *string*

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

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string | HEX string |

**Returns:** *Uint8Array‹›*

___

### `Const` hexstring2str

▸ **hexstring2str**(`hexstring`: string): *void*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hexstring` | string | HEX string |

**Returns:** *void*

ASCII string

___

### `Const` int2hex

▸ **int2hex**(`num`: number): *string*

convert an integer to big endian hex and add leading zeros

**Parameters:**

Name | Type |
------ | ------ |
`num` | number |

**Returns:** *string*

___

### `Const` isHex

▸ **isHex**(`str`: string): *boolean*

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

### `Const` num2VarInt

▸ **num2VarInt**(`num`: number): *string*

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

Reverses an array. Accepts arrayBuffer.

**Parameters:**

Name | Type |
------ | ------ |
`arr` | any[] |

**Returns:** *Uint8Array‹›*

___

### `Const` reverseHex

▸ **reverseHex**(`hex`: string): *string*

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

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string | ASCII string |

**Returns:** *Uint8Array‹›*

___

### `Const` str2hexstring

▸ **str2hexstring**(`str`: string): *string*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string | ASCII string |

**Returns:** *string*

HEX string

___

## amino Functions

### `Const` convertObjectToSignBytes

▸ **convertObjectToSignBytes**(`obj`: any): *Buffer‹›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`obj` | any | -- {object} |

**Returns:** *Buffer‹›*

bytes {Buffer}

___

### `Const` encodeArrayBinary

▸ **encodeArrayBinary**(`fieldNum`: number | undefined, `arr`: any[], `isByteLenPrefix?`: undefined | false | true): *Buffer‹›*

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

encode bool

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`b` | boolean |   |

**Returns:** *any*

___

### `Const` encodeNumber

▸ **encodeNumber**(`num`: number): *any*

encode number

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | number |   |

**Returns:** *any*

___

### `Const` encodeObjectBinary

▸ **encodeObjectBinary**(`obj`: any, `isByteLenPrefix?`: undefined | false | true): *Buffer‹›*

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

encode string

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string |   |

**Returns:** *Buffer‹›*

___

### `Const` encodeTime

▸ **encodeTime**(`value`: string | Date): *Buffer‹›*

encode time

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | string &#124; Date |   |

**Returns:** *Buffer‹›*

___

### `Const` marshalBinary

▸ **marshalBinary**(`obj`: any): *any*

js amino MarshalBinary

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`obj` | any |   |

**Returns:** *any*

___

### `Const` marshalBinaryBare

▸ **marshalBinaryBare**(`obj`: any): *any*

js amino MarshalBinaryBare

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`obj` | any |   |

**Returns:** *any*

___

## amino
js amino UnmarshalBinaryBare Functions

### `Const` unMarshalBinaryBare

▸ **unMarshalBinaryBare**(`bytes`: Buffer, `type`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Buffer |
`type` | any |

**Returns:** *any*

___

## amino
js amino UnmarshalBinaryLengthPrefixed Functions

### `Const` unMarshalBinaryLengthPrefixed

▸ **unMarshalBinaryLengthPrefixed**(`bytes`: Buffer, `type`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Buffer |
`type` | any |

**Returns:** *any*

___

## crypto Functions

### `Const` checkAddress

▸ **checkAddress**(`address`: string, `hrp`: string): *boolean*

Checks whether an address is valid.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | the bech32 address to decode |
`hrp` | string | the prefix to check for the bech32 address |

**Returns:** *boolean*

___

### `Const` decodeAddress

▸ **decodeAddress**(`value`: string): *Buffer*

Decodes an address in bech32 format.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | string | the bech32 address to decode  |

**Returns:** *Buffer*

___

### `Const` encodeAddress

▸ **encodeAddress**(`value`: string | Buffer, `prefix`: string, `type`: BufferEncoding): *string*

Encodes an address from input data bytes.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`value` | string &#124; Buffer | - | the public key to encode |
`prefix` | string | "tbnb" | the address prefix |
`type` | BufferEncoding | "hex" | the output type (default: hex)  |

**Returns:** *string*

___

### `Const` generateKeyStore

▸ **generateKeyStore**(`privateKeyHex`: string, `password`: string): *KeyStore*

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

Generates mnemonic phrase words using random entropy.

**Returns:** *string*

___

### `Const` generatePrivateKey

▸ **generatePrivateKey**(`len`: number): *string*

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

Generates an arrayBuffer filled with random bits.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`length` | number | Length of buffer. |

**Returns:** *ArrayBuffer*

___

### `Const` generateSignature

▸ **generateSignature**(`signBytesHex`: string, `privateKey`: string | Buffer): *Buffer*

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

Gets an address from a private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKeyHex` | string | the private key hexstring |
`prefix?` | undefined &#124; string | the address prefix  |

**Returns:** *string*

___

### `Const` getAddressFromPublicKey

▸ **getAddressFromPublicKey**(`publicKeyHex`: string, `prefix?`: undefined | string): *string*

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

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`publicKey` | string | Encoded public key |

**Returns:** *BasePoint‹›*

public key hexstring

___

### `Const` getPublicKeyFromPrivateKey

▸ **getPublicKeyFromPrivateKey**(`privateKeyHex`: string): *string*

Calculates the public key from a given private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKeyHex` | string | the private key hexstring |

**Returns:** *string*

public key hexstring

___

### `Const` verifySignature

▸ **verifySignature**(`sigHex`: string, `signBytesHex`: string, `publicKeyHex`: string): *boolean*

Verifies a signature (64 byte <r,s>) given the sign bytes and public key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sigHex` | string | The signature hexstring. |
`signBytesHex` | string | Unsigned transaction sign bytes hexstring. |
`publicKeyHex` | string | The public key. |

**Returns:** *boolean*
