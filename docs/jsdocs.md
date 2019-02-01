## Classes

<dl>
<dt><a href="#LedgerApp">LedgerApp</a></dt>
<dd></dd>
<dt><a href="#Transaction">Transaction</a></dt>
<dd><p>Creates a new transaction object.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#decodeAddress">decodeAddress</a></dt>
<dd><p>Decodes an address in bech32 format.</p>
</dd>
<dt><a href="#checkAddress">checkAddress</a></dt>
<dd><p>checek address whether is valid</p>
</dd>
<dt><a href="#encodeAddress">encodeAddress</a></dt>
<dd><p>Encodes an address from input data bytes.</p>
</dd>
<dt><a href="#generatePrivateKey">generatePrivateKey</a> ⇒ <code>string</code></dt>
<dd><p>Generates a random private key</p>
</dd>
<dt><a href="#generateRandomArray">generateRandomArray</a> ⇒ <code>ArrayBuffer</code></dt>
<dd><p>Generates an arrayBuffer filled with random bits.</p>
</dd>
<dt><a href="#getPublicKey">getPublicKey</a> ⇒ <code>Elliptic.PublicKey</code></dt>
<dd></dd>
<dt><a href="#getPublicKeyFromPrivateKey">getPublicKeyFromPrivateKey</a> ⇒ <code>string</code></dt>
<dd><p>Calculates the public key from a given private key.</p>
</dd>
<dt><a href="#generatePubKey">generatePubKey</a> ⇒ <code>Elliptic.PublicKey</code></dt>
<dd><p>PubKey performs the point-scalar multiplication from the privKey on the
generator point to get the pubkey.</p>
</dd>
<dt><a href="#getAddressFromPublicKey">getAddressFromPublicKey</a></dt>
<dd><p>Gets an address from a public key hex.</p>
</dd>
<dt><a href="#getAddressFromPrivateKey">getAddressFromPrivateKey</a></dt>
<dd><p>Gets an address from a private key.</p>
</dd>
<dt><a href="#generateSignature">generateSignature</a> ⇒ <code>Buffer</code></dt>
<dd><p>Generates a signature (64 byte &lt;r,s&gt;) for a transaction based on given private key.</p>
</dd>
<dt><a href="#verifySignature">verifySignature</a> ⇒ <code>Buffer</code></dt>
<dd><p>Verifies a signature (64 byte &lt;r,s&gt;) given the sign bytes and public key.</p>
</dd>
<dt><a href="#generateKeyStore">generateKeyStore</a></dt>
<dd><p>Generates a keystore file based on given private key and password.</p>
</dd>
<dt><a href="#getPrivateKeyFromKeyStore">getPrivateKeyFromKeyStore</a></dt>
<dd><p>Generates privatekey based on keystore and password</p>
</dd>
<dt><a href="#getMnemonicFromPrivateKey">getMnemonicFromPrivateKey</a></dt>
<dd><p>Gets Mnemonic from a private key.</p>
</dd>
<dt><a href="#generateMnemonic">generateMnemonic</a></dt>
<dd><p>Generate Mnemonic (length=== 15)</p>
</dd>
<dt><a href="#getPrivateKeyFromMnemonic">getPrivateKeyFromMnemonic</a></dt>
<dd><p>Get privatekey from mnemonic.</p>
</dd>
<dt><a href="#encodeNumber">encodeNumber</a></dt>
<dd><p>encode number</p>
</dd>
<dt><a href="#encodeBool">encodeBool</a></dt>
<dd><p>encode bool</p>
</dd>
<dt><a href="#encodeString">encodeString</a></dt>
<dd><p>encode string</p>
</dd>
<dt><a href="#encodeTime">encodeTime</a></dt>
<dd><p>encode time</p>
</dd>
<dt><a href="#convertObjectToSignBytes">convertObjectToSignBytes</a> ⇒ <code>Buffer</code></dt>
<dd></dd>
<dt><a href="#marshalBinary">marshalBinary</a></dt>
<dd><p>js amino MarshalBinary</p>
</dd>
<dt><a href="#marshalBinaryBare">marshalBinaryBare</a></dt>
<dd><p>js amino MarshalBinaryBare</p>
</dd>
<dt><a href="#encodeBinary">encodeBinary</a> ⇒ <code>Buffer</code></dt>
<dd><p>This is the main entrypoint for encoding all types in binary form.</p>
</dd>
<dt><a href="#encodeBinaryByteArray">encodeBinaryByteArray</a> ⇒ <code>Buffer</code></dt>
<dd><p>prefixed with bytes length</p>
</dd>
<dt><a href="#encodeObjectBinary">encodeObjectBinary</a> ⇒ <code>Buffer</code></dt>
<dd></dd>
<dt><a href="#encodeArrayBinary">encodeArrayBinary</a> ⇒ <code>Buffer</code></dt>
<dd></dd>
<dt><a href="#ab2str">ab2str</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#str2ab">str2ab</a> ⇒ <code>arrayBuffer</code></dt>
<dd></dd>
<dt><a href="#hexstring2ab">hexstring2ab</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd></dd>
<dt><a href="#ab2hexstring">ab2hexstring</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#str2hexstring">str2hexstring</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#hexstring2str">hexstring2str</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#int2hex">int2hex</a> ⇒ <code>string</code></dt>
<dd><p>convert an integer to big endian hex and add leading zeros</p>
</dd>
<dt><a href="#num2hexstring">num2hexstring</a> ⇒ <code>string</code></dt>
<dd><p>Converts a number to a big endian hexstring of a suitable size, optionally little endian</p>
</dd>
<dt><a href="#num2VarInt">num2VarInt</a> ⇒ <code>string</code></dt>
<dd><p>Converts a number to a variable length Int. Used for array length header</p>
</dd>
<dt><a href="#hexXor">hexXor</a> ⇒ <code>string</code></dt>
<dd><p>XORs two hexstrings</p>
</dd>
<dt><a href="#reverseArray">reverseArray</a> ⇒ <code>Uint8Array</code></dt>
<dd><p>Reverses an array. Accepts arrayBuffer.</p>
</dd>
<dt><a href="#reverseHex">reverseHex</a> ⇒ <code>string</code></dt>
<dd><p>Reverses a HEX string, treating 2 chars as a byte.</p>
</dd>
<dt><a href="#isHex">isHex</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if input is a hexstring. Empty string is considered a hexstring.</p>
</dd>
<dt><a href="#ensureHex">ensureHex</a></dt>
<dd><p>Throws an error if input is not hexstring.</p>
</dd>
<dt><a href="#sha256ripemd160">sha256ripemd160</a> ⇒ <code>string</code></dt>
<dd><p>Performs a SHA256 followed by a RIPEMD160.</p>
</dd>
<dt><a href="#sha256">sha256</a> ⇒ <code>string</code></dt>
<dd><p>Performs a single SHA256.</p>
</dd>
</dl>

<a name="LedgerApp"></a>

## LedgerApp
**Kind**: global class  

* [LedgerApp](#LedgerApp)
    * [new LedgerApp(transport, interactiveTimeout, nonInteractiveTimeout)](#new_LedgerApp_new)
    * [.getVersion()](#LedgerApp+getVersion)
    * [.publicKeySecp256k1(hdPath)](#LedgerApp+publicKeySecp256k1)
    * [.signSecp256k1(signBytes, hdPath)](#LedgerApp+signSecp256k1)
    * [.getPublicKey(hdPath)](#LedgerApp+getPublicKey)
    * [.sign(signBytes, hdPath)](#LedgerApp+sign)

<a name="new_LedgerApp_new"></a>

### new LedgerApp(transport, interactiveTimeout, nonInteractiveTimeout)
Constructs a new LedgerApp.


| Param | Type | Description |
| --- | --- | --- |
| transport | <code>Transport</code> | Ledger Transport, a subclass of ledgerjs Transport. |
| interactiveTimeout | <code>number</code> | The interactive (user input) timeout in ms. Default 45s. |
| nonInteractiveTimeout | <code>number</code> | The non-interactive timeout in ms. Default 3s. |

<a name="LedgerApp+getVersion"></a>

### ledgerApp.getVersion()
Gets the version of the Ledger app that is currently open on the device.

**Kind**: instance method of [<code>LedgerApp</code>](#LedgerApp)  
**Throws**:

- Will throw Error if a transport error occurs, or if the firmware app is not open.

<a name="LedgerApp+publicKeySecp256k1"></a>

### ledgerApp.publicKeySecp256k1(hdPath)
Gets the public key from the Ledger app that is currently open on the device.

**Kind**: instance method of [<code>LedgerApp</code>](#LedgerApp)  
**Throws**:

- Will throw Error if a transport error occurs, or if the firmware app is not open.


| Param | Type | Description |
| --- | --- | --- |
| hdPath | <code>array</code> | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

<a name="LedgerApp+signSecp256k1"></a>

### ledgerApp.signSecp256k1(signBytes, hdPath)
Sends a transaction sign doc to the Ledger app to be signed.

**Kind**: instance method of [<code>LedgerApp</code>](#LedgerApp)  
**Throws**:

- Will throw Error if a transport error occurs, or if the firmware app is not open.


| Param | Type | Description |
| --- | --- | --- |
| signBytes | <code>Buffer</code> | The TX sign doc bytes to sign |
| hdPath | <code>array</code> | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

<a name="LedgerApp+getPublicKey"></a>

### ledgerApp.getPublicKey(hdPath)
Gets the public key from the Ledger app that is currently open on the device.

**Kind**: instance method of [<code>LedgerApp</code>](#LedgerApp)  
**Throws**:

- Will throw Error if a transport error occurs, or if the firmware app is not open.


| Param | Type | Description |
| --- | --- | --- |
| hdPath | <code>array</code> | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

<a name="LedgerApp+sign"></a>

### ledgerApp.sign(signBytes, hdPath)
Sends a transaction sign doc to the Ledger app to be signed.

**Kind**: instance method of [<code>LedgerApp</code>](#LedgerApp)  
**Throws**:

- Will throw Error if a transport error occurs, or if the firmware app is not open.


| Param | Type | Description |
| --- | --- | --- |
| signBytes | <code>Buffer</code> | The TX sign doc bytes to sign |
| hdPath | <code>array</code> | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

<a name="Transaction"></a>

## Transaction
Creates a new transaction object.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| raw | <code>Buffer</code> | The raw vstruct encoded transaction |


* [Transaction](#Transaction)
    * [new Transaction(type)](#new_Transaction_new)
    * [.getSignBytes(concrete)](#Transaction+getSignBytes) ⇒ <code>Buffer</code>
    * [.addSignature(pubKey, signature)](#Transaction+addSignature) ⇒ [<code>Transaction</code>](#Transaction)
    * [.sign(privateKey, concrete)](#Transaction+sign) ⇒ [<code>Transaction</code>](#Transaction)
    * [.serialize(opts)](#Transaction+serialize)
    * [._serializePubKey(unencodedPubKey)](#Transaction+_serializePubKey) ⇒ <code>Buffer</code>

<a name="new_Transaction_new"></a>

### new Transaction(type)

| Param | Type | Description |
| --- | --- | --- |
| data.account_number | <code>number</code> | account number |
| data.chain_id | <code>string</code> | bnbChain Id |
| data.memo | <code>string</code> | transaction memo |
| type | <code>string</code> | transaction type |
| data.msg | <code>object</code> | object data of tx type |
| data.sequence | <code>number</code> | transaction counts |

**Example**  
```js
var rawTx = {
  account_number: 1,
  chain_id: 'bnbchain-1000',
  memo: '',
  msg: {},
  type: 'NewOrderMsg',
  sequence: 29,
};
var tx = new Transaction(rawTx);
```
<a name="Transaction+getSignBytes"></a>

### transaction.getSignBytes(concrete) ⇒ <code>Buffer</code>
generate the sign bytes for a transaction, given a msg

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  

| Param | Type | Description |
| --- | --- | --- |
| concrete | <code>Object</code> | msg object |

<a name="Transaction+addSignature"></a>

### transaction.addSignature(pubKey, signature) ⇒ [<code>Transaction</code>](#Transaction)
attaches a signature to the transaction

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  

| Param | Type |
| --- | --- |
| pubKey | <code>Elliptic.PublicKey</code> | 
| signature | <code>Buffer</code> | 

<a name="Transaction+sign"></a>

### transaction.sign(privateKey, concrete) ⇒ [<code>Transaction</code>](#Transaction)
sign transaction with a given private key and msg

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | private key hex string |
| concrete | <code>Object</code> | msg object |

<a name="Transaction+serialize"></a>

### transaction.serialize(opts)
encode signed transaction to hex which is compatible with amino

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> | msg field |

<a name="Transaction+_serializePubKey"></a>

### transaction.\_serializePubKey(unencodedPubKey) ⇒ <code>Buffer</code>
serializes a public key in a 33-byte compressed format.

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  

| Param | Type |
| --- | --- |
| unencodedPubKey | <code>Elliptic.PublicKey</code> | 

<a name="decodeAddress"></a>

## decodeAddress
Decodes an address in bech32 format.

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | the bech32 address to decode |

<a name="checkAddress"></a>

## checkAddress
checek address whether is valid

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | the bech32 address to decode |

<a name="encodeAddress"></a>

## encodeAddress
Encodes an address from input data bytes.

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | the public key to encode |
| prefix | <code>\*</code> | the address prefix |
| type | <code>\*</code> | the output type (default: hex) |

<a name="generatePrivateKey"></a>

## generatePrivateKey ⇒ <code>string</code>
Generates a random private key

**Kind**: global constant  
<a name="generateRandomArray"></a>

## generateRandomArray ⇒ <code>ArrayBuffer</code>
Generates an arrayBuffer filled with random bits.

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| length | <code>number</code> | Length of buffer. |

<a name="getPublicKey"></a>

## getPublicKey ⇒ <code>Elliptic.PublicKey</code>
**Kind**: global constant  
**Returns**: <code>Elliptic.PublicKey</code> - public key  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | Encoded public key |

<a name="getPublicKeyFromPrivateKey"></a>

## getPublicKeyFromPrivateKey ⇒ <code>string</code>
Calculates the public key from a given private key.

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| privateKeyHex | <code>string</code> | the private key hexstring |

<a name="generatePubKey"></a>

## generatePubKey ⇒ <code>Elliptic.PublicKey</code>
PubKey performs the point-scalar multiplication from the privKey on the
generator point to get the pubkey.

**Kind**: global constant  
**Returns**: <code>Elliptic.PublicKey</code> - PubKey  

| Param | Type |
| --- | --- |
| privateKey | <code>Buffer</code> | 

<a name="getAddressFromPublicKey"></a>

## getAddressFromPublicKey
Gets an address from a public key hex.

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| publicKeyHex | <code>string</code> | the public key hexstring |

<a name="getAddressFromPrivateKey"></a>

## getAddressFromPrivateKey
Gets an address from a private key.

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| privateKeyHex | <code>string</code> | the private key hexstring |

<a name="generateSignature"></a>

## generateSignature ⇒ <code>Buffer</code>
Generates a signature (64 byte <r,s>) for a transaction based on given private key.

**Kind**: global constant  
**Returns**: <code>Buffer</code> - Signature. Does not include tx.  

| Param | Type | Description |
| --- | --- | --- |
| signBytesHex | <code>string</code> | Unsigned transaction sign bytes hexstring. |
| privateKey | <code>string</code> \| <code>Buffer</code> | The private key. |

<a name="verifySignature"></a>

## verifySignature ⇒ <code>Buffer</code>
Verifies a signature (64 byte <r,s>) given the sign bytes and public key.

**Kind**: global constant  
**Returns**: <code>Buffer</code> - Signature. Does not include tx.  

| Param | Type | Description |
| --- | --- | --- |
| sigHex | <code>string</code> | The signature hexstring. |
| signBytesHex | <code>string</code> | Unsigned transaction sign bytes hexstring. |
| publicKeyHex | <code>string</code> | The public key. |

<a name="generateKeyStore"></a>

## generateKeyStore
Generates a keystore file based on given private key and password.

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | Private Key. |
| password | <code>string</code> | Password. |

<a name="getPrivateKeyFromKeyStore"></a>

## getPrivateKeyFromKeyStore
Generates privatekey based on keystore and password

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| keystore | <code>string</code> | keystore file json format. |
| password | <code>string</code> | Password. |

<a name="getMnemonicFromPrivateKey"></a>

## getMnemonicFromPrivateKey
Gets Mnemonic from a private key.

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | the private key hexstring |

<a name="generateMnemonic"></a>

## generateMnemonic
Generate Mnemonic (length=== 15)

**Kind**: global constant  
<a name="getPrivateKeyFromMnemonic"></a>

## getPrivateKeyFromMnemonic
Get privatekey from mnemonic.

**Kind**: global constant  

| Type |
| --- |
| <code>mnemonic</code> | 

<a name="encodeNumber"></a>

## encodeNumber
encode number

**Kind**: global constant  

| Param |
| --- |
| num | 

<a name="encodeBool"></a>

## encodeBool
encode bool

**Kind**: global constant  

| Param |
| --- |
| b | 

<a name="encodeString"></a>

## encodeString
encode string

**Kind**: global constant  

| Param |
| --- |
| str | 

<a name="encodeTime"></a>

## encodeTime
encode time

**Kind**: global constant  

| Param |
| --- |
| value | 

<a name="convertObjectToSignBytes"></a>

## convertObjectToSignBytes ⇒ <code>Buffer</code>
**Kind**: global constant  
**Returns**: <code>Buffer</code> - bytes  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | - |

<a name="marshalBinary"></a>

## marshalBinary
js amino MarshalBinary

**Kind**: global constant  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="marshalBinaryBare"></a>

## marshalBinaryBare
js amino MarshalBinaryBare

**Kind**: global constant  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="encodeBinary"></a>

## encodeBinary ⇒ <code>Buffer</code>
This is the main entrypoint for encoding all types in binary form.

**Kind**: global constant  
**Returns**: <code>Buffer</code> - binary of object.  

| Param | Type | Description |
| --- | --- | --- |
| js | <code>\*</code> | data type (not null, not undefined) |
| field | <code>number</code> | index of object |
| isByteLenPrefix | <code>bool</code> |  |

<a name="encodeBinaryByteArray"></a>

## encodeBinaryByteArray ⇒ <code>Buffer</code>
prefixed with bytes length

**Kind**: global constant  
**Returns**: <code>Buffer</code> - with bytes length prefixed  

| Param | Type |
| --- | --- |
| bytes | <code>Buffer</code> | 

<a name="encodeObjectBinary"></a>

## encodeObjectBinary ⇒ <code>Buffer</code>
**Kind**: global constant  
**Returns**: <code>Buffer</code> - with bytes length prefixed  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="encodeArrayBinary"></a>

## encodeArrayBinary ⇒ <code>Buffer</code>
**Kind**: global constant  
**Returns**: <code>Buffer</code> - bytes of array  

| Param | Type | Description |
| --- | --- | --- |
| fieldNum | <code>number</code> | object field index |
| arr | <code>Array</code> |  |
| isByteLenPrefix | <code>bool</code> |  |

<a name="ab2str"></a>

## ab2str ⇒ <code>string</code>
**Kind**: global constant  
**Returns**: <code>string</code> - ASCII string  

| Param | Type |
| --- | --- |
| buf | <code>arrayBuffer</code> | 

<a name="str2ab"></a>

## str2ab ⇒ <code>arrayBuffer</code>
**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | ASCII string |

<a name="hexstring2ab"></a>

## hexstring2ab ⇒ <code>Array.&lt;number&gt;</code>
**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | HEX string |

<a name="ab2hexstring"></a>

## ab2hexstring ⇒ <code>string</code>
**Kind**: global constant  
**Returns**: <code>string</code> - HEX string  

| Param | Type |
| --- | --- |
| arr | <code>arrayBuffer</code> | 

<a name="str2hexstring"></a>

## str2hexstring ⇒ <code>string</code>
**Kind**: global constant  
**Returns**: <code>string</code> - HEX string  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | ASCII string |

<a name="hexstring2str"></a>

## hexstring2str ⇒ <code>string</code>
**Kind**: global constant  
**Returns**: <code>string</code> - ASCII string  

| Param | Type | Description |
| --- | --- | --- |
| hexstring | <code>string</code> | HEX string |

<a name="int2hex"></a>

## int2hex ⇒ <code>string</code>
convert an integer to big endian hex and add leading zeros

**Kind**: global constant  

| Param | Type |
| --- | --- |
| num | <code>number</code> | 

<a name="num2hexstring"></a>

## num2hexstring ⇒ <code>string</code>
Converts a number to a big endian hexstring of a suitable size, optionally little endian

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> |  |
| size | <code>number</code> | The required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1. |
| littleEndian | <code>boolean</code> | Encode the hex in little endian form |

<a name="num2VarInt"></a>

## num2VarInt ⇒ <code>string</code>
Converts a number to a variable length Int. Used for array length header

**Kind**: global constant  
**Returns**: <code>string</code> - hexstring of the variable Int.  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | The number |

<a name="hexXor"></a>

## hexXor ⇒ <code>string</code>
XORs two hexstrings

**Kind**: global constant  
**Returns**: <code>string</code> - XOR output as a HEX string  

| Param | Type | Description |
| --- | --- | --- |
| str1 | <code>string</code> | HEX string |
| str2 | <code>string</code> | HEX string |

<a name="reverseArray"></a>

## reverseArray ⇒ <code>Uint8Array</code>
Reverses an array. Accepts arrayBuffer.

**Kind**: global constant  

| Param | Type |
| --- | --- |
| arr | <code>Array</code> | 

<a name="reverseHex"></a>

## reverseHex ⇒ <code>string</code>
Reverses a HEX string, treating 2 chars as a byte.

**Kind**: global constant  
**Returns**: <code>string</code> - HEX string reversed in 2s.  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | HEX string |

**Example**  
```js
reverseHex('abcdef') = 'efcdab'
```
<a name="isHex"></a>

## isHex ⇒ <code>boolean</code>
Checks if input is a hexstring. Empty string is considered a hexstring.

**Kind**: global constant  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

**Example**  
```js
isHex('0101') = true
isHex('') = true
isHex('0x01') = false
```
<a name="ensureHex"></a>

## ensureHex
Throws an error if input is not hexstring.

**Kind**: global constant  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="sha256ripemd160"></a>

## sha256ripemd160 ⇒ <code>string</code>
Performs a SHA256 followed by a RIPEMD160.

**Kind**: global constant  
**Returns**: <code>string</code> - hash output  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | String to hash |

<a name="sha256"></a>

## sha256 ⇒ <code>string</code>
Performs a single SHA256.

**Kind**: global constant  
**Returns**: <code>string</code> - hash output  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | String to hash |

