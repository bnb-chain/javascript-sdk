## Modules

<dl>
<dt><a href="#module_crypto">crypto</a></dt>
<dd></dd>
<dt><a href="#module_ledger">ledger</a></dt>
<dd></dd>
<dt><a href="#module_utils">utils</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#BncClient">BncClient</a></dt>
<dd><p>The Binance Chain client.</p></dd>
<dt><a href="#RpcClient">RpcClient</a></dt>
<dd><p>The Binance Chain Node rpc client</p></dd>
<dt><a href="#Transaction">Transaction</a></dt>
<dd><p>Creates a new transaction object.</p></dd>
</dl>

## Members

<dl>
<dt><a href="#DefaultSigningDelegate">DefaultSigningDelegate</a></dt>
<dd><p>The default broadcast delegate which immediately broadcasts a transaction.</p></dd>
<dt><a href="#DefaultBroadcastDelegate">DefaultBroadcastDelegate</a> ⇒ <code>function</code></dt>
<dd><p>The Ledger signing delegate.</p></dd>
<dt><a href="#LedgerSigningDelegate">LedgerSigningDelegate</a></dt>
<dd><p>validate the input number.</p></dd>
<dt><a href="#checkNumber">checkNumber</a></dt>
<dd><p>basic validation of coins</p></dd>
</dl>

## Functions

<dl>
<dt><a href="#DefaultSigningDelegate">DefaultSigningDelegate(tx, signMsg)</a> ⇒ <code><a href="#Transaction">Transaction</a></code></dt>
<dd><p>The default signing delegate which uses the local private key.</p></dd>
<dt><a href="#calInputCoins">calInputCoins(inputs, coins)</a></dt>
<dd><p>sum corresponding input coin</p></dd>
<dt><a href="#checkNumber">checkNumber(value)</a></dt>
<dd><p>validate the input number.</p></dd>
</dl>

<a name="module_crypto"></a>

## crypto

* [crypto](#module_crypto)
    * _static_
        * [.decodeAddress](#module_crypto.decodeAddress) ⇒ <code>boolean</code>
        * [.checkAddress](#module_crypto.checkAddress)
        * [.encodeAddress](#module_crypto.encodeAddress) ⇒ <code>string</code>
        * [.generatePrivateKey](#module_crypto.generatePrivateKey) ⇒ <code>ArrayBuffer</code>
        * [.generateRandomArray](#module_crypto.generateRandomArray) ⇒ <code>Elliptic.PublicKey</code>
        * [.getPublicKey](#module_crypto.getPublicKey) ⇒ <code>string</code>
        * [.getPublicKeyFromPrivateKey](#module_crypto.getPublicKeyFromPrivateKey) ⇒ <code>Elliptic.PublicKey</code>
        * [.generatePubKey](#module_crypto.generatePubKey)
        * [.getAddressFromPublicKey](#module_crypto.getAddressFromPublicKey)
        * [.getAddressFromPrivateKey](#module_crypto.getAddressFromPrivateKey) ⇒ <code>Buffer</code>
        * [.generateSignature](#module_crypto.generateSignature) ⇒ <code>boolean</code>
        * [.verifySignature](#module_crypto.verifySignature) ⇒ <code>object</code>
        * [.generateKeyStore](#module_crypto.generateKeyStore)
        * [.getPrivateKeyFromKeyStore](#module_crypto.getPrivateKeyFromKeyStore)
        * [.generateMnemonic](#module_crypto.generateMnemonic) ⇒ <code>bool</code>
        * [.validateMnemonic](#module_crypto.validateMnemonic) ⇒ <code>string</code>
    * _inner_
        * [~decodeAddress(value)](#module_crypto..decodeAddress)

<a name="module_crypto.decodeAddress"></a>

### crypto.decodeAddress ⇒ <code>boolean</code>
<p>Checks whether an address is valid.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | <p>the bech32 address to decode</p> |
| hrp | <code>string</code> | <p>the prefix to check for the bech32 address</p> |

<a name="module_crypto.checkAddress"></a>

### crypto.checkAddress
<p>Encodes an address from input data bytes.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | <p>the public key to encode</p> |
| prefix | <code>\*</code> | <p>the address prefix</p> |
| type | <code>\*</code> | <p>the output type (default: hex)</p> |

<a name="module_crypto.encodeAddress"></a>

### crypto.encodeAddress ⇒ <code>string</code>
<p>Generates 32 bytes of random entropy</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  
**Returns**: <code>string</code> - <p>entropy bytes hexstring</p>  

| Param | Type | Description |
| --- | --- | --- |
| len | <code>number</code> | <p>output length (default: 32 bytes)</p> |

<a name="module_crypto.generatePrivateKey"></a>

### crypto.generatePrivateKey ⇒ <code>ArrayBuffer</code>
<p>Generates an arrayBuffer filled with random bits.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| length | <code>number</code> | <p>Length of buffer.</p> |

<a name="module_crypto.generateRandomArray"></a>

### crypto.generateRandomArray ⇒ <code>Elliptic.PublicKey</code>
**Kind**: static property of [<code>crypto</code>](#module_crypto)  
**Returns**: <code>Elliptic.PublicKey</code> - <p>public key hexstring</p>  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | <p>Encoded public key</p> |

<a name="module_crypto.getPublicKey"></a>

### crypto.getPublicKey ⇒ <code>string</code>
<p>Calculates the public key from a given private key.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  
**Returns**: <code>string</code> - <p>public key hexstring</p>  

| Param | Type | Description |
| --- | --- | --- |
| privateKeyHex | <code>string</code> | <p>the private key hexstring</p> |

<a name="module_crypto.getPublicKeyFromPrivateKey"></a>

### crypto.getPublicKeyFromPrivateKey ⇒ <code>Elliptic.PublicKey</code>
<p>PubKey performs the point-scalar multiplication from the privKey on the
generator point to get the pubkey.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  
**Returns**: <code>Elliptic.PublicKey</code> - <p>PubKey</p>  

| Param | Type |
| --- | --- |
| privateKey | <code>Buffer</code> | 

<a name="module_crypto.generatePubKey"></a>

### crypto.generatePubKey
<p>Gets an address from a public key hex.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| publicKeyHex | <code>string</code> | <p>the public key hexstring</p> |
| prefix | <code>string</code> | <p>the address prefix</p> |

<a name="module_crypto.getAddressFromPublicKey"></a>

### crypto.getAddressFromPublicKey
<p>Gets an address from a private key.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| privateKeyHex | <code>string</code> | <p>the private key hexstring</p> |

<a name="module_crypto.getAddressFromPrivateKey"></a>

### crypto.getAddressFromPrivateKey ⇒ <code>Buffer</code>
<p>Generates a signature (64 byte &lt;r,s&gt;) for a transaction based on given private key.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  
**Returns**: <code>Buffer</code> - <p>Signature. Does not include tx.</p>  

| Param | Type | Description |
| --- | --- | --- |
| signBytesHex | <code>string</code> | <p>Unsigned transaction sign bytes hexstring.</p> |
| privateKey | <code>string</code> \| <code>Buffer</code> | <p>The private key.</p> |

<a name="module_crypto.generateSignature"></a>

### crypto.generateSignature ⇒ <code>boolean</code>
<p>Verifies a signature (64 byte &lt;r,s&gt;) given the sign bytes and public key.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| sigHex | <code>string</code> | <p>The signature hexstring.</p> |
| signBytesHex | <code>string</code> | <p>Unsigned transaction sign bytes hexstring.</p> |
| publicKeyHex | <code>string</code> | <p>The public key.</p> |

<a name="module_crypto.verifySignature"></a>

### crypto.verifySignature ⇒ <code>object</code>
<p>Generates a keystore object (web3 secret storage format) given a private key to store and a password.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  
**Returns**: <code>object</code> - <p>the keystore object.</p>  

| Param | Type | Description |
| --- | --- | --- |
| privateKeyHex | <code>string</code> | <p>the private key hexstring.</p> |
| password | <code>string</code> | <p>the password.</p> |

<a name="module_crypto.generateKeyStore"></a>

### crypto.generateKeyStore
<p>Gets a private key from a keystore given its password.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| keystore | <code>string</code> | <p>the keystore in json format</p> |
| password | <code>string</code> | <p>the password.</p> |

<a name="module_crypto.getPrivateKeyFromKeyStore"></a>

### crypto.getPrivateKeyFromKeyStore
<p>Generates mnemonic phrase words using random entropy.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  
<a name="module_crypto.generateMnemonic"></a>

### crypto.generateMnemonic ⇒ <code>bool</code>
<p>Validates mnemonic phrase words.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  
**Returns**: <code>bool</code> - <p>validation result</p>  

| Param | Type | Description |
| --- | --- | --- |
| mnemonic | <code>string</code> | <p>the mnemonic phrase words</p> |

<a name="module_crypto.validateMnemonic"></a>

### crypto.validateMnemonic ⇒ <code>string</code>
<p>Get a private key from mnemonic words.</p>

**Kind**: static property of [<code>crypto</code>](#module_crypto)  
**Returns**: <code>string</code> - <p>hexstring</p>  

| Param | Type | Description |
| --- | --- | --- |
| mnemonic | <code>string</code> | <p>the mnemonic phrase words</p> |
| derive | <code>Boolean</code> | <p>derive a private key using the default HD path (default: true)</p> |
| index | <code>number</code> | <p>the bip44 address index (default: 0)</p> |
| password | <code>string</code> | <p>according to bip39</p> |

<a name="module_crypto..decodeAddress"></a>

### crypto~decodeAddress(value)
<p>Decodes an address in bech32 format.</p>

**Kind**: inner method of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | <p>the bech32 address to decode</p> |

<a name="module_ledger"></a>

## ledger

* [ledger](#module_ledger)
    * [~LedgerApp](#module_ledger.LedgerApp)
        * [new LedgerApp(transport, interactiveTimeout, nonInteractiveTimeout)](#new_module_ledger.LedgerApp_new)
        * [.getVersion()](#module_ledger.LedgerApp+getVersion)
        * [.publicKeySecp256k1(hdPath)](#module_ledger.LedgerApp+publicKeySecp256k1)
        * [.signSecp256k1(signBytes, hdPath)](#module_ledger.LedgerApp+signSecp256k1)
        * [.showAddress(hrp, hdPath)](#module_ledger.LedgerApp+showAddress)
        * [.getPublicKey(hdPath)](#module_ledger.LedgerApp+getPublicKey)
        * [.sign(signBytes, hdPath)](#module_ledger.LedgerApp+sign)

<a name="module_ledger.LedgerApp"></a>

### ledger~LedgerApp
<p>Ledger app interface.</p>

**Kind**: inner class of [<code>ledger</code>](#module_ledger)  

* [~LedgerApp](#module_ledger.LedgerApp)
    * [new LedgerApp(transport, interactiveTimeout, nonInteractiveTimeout)](#new_module_ledger.LedgerApp_new)
    * [.getVersion()](#module_ledger.LedgerApp+getVersion)
    * [.publicKeySecp256k1(hdPath)](#module_ledger.LedgerApp+publicKeySecp256k1)
    * [.signSecp256k1(signBytes, hdPath)](#module_ledger.LedgerApp+signSecp256k1)
    * [.showAddress(hrp, hdPath)](#module_ledger.LedgerApp+showAddress)
    * [.getPublicKey(hdPath)](#module_ledger.LedgerApp+getPublicKey)
    * [.sign(signBytes, hdPath)](#module_ledger.LedgerApp+sign)

<a name="new_module_ledger.LedgerApp_new"></a>

#### new LedgerApp(transport, interactiveTimeout, nonInteractiveTimeout)
<p>Constructs a new LedgerApp.</p>


| Param | Type | Description |
| --- | --- | --- |
| transport | <code>Transport</code> | <p>Ledger Transport, a subclass of ledgerjs Transport.</p> |
| interactiveTimeout | <code>Number</code> | <p>The interactive (user input) timeout in ms. Default 45s.</p> |
| nonInteractiveTimeout | <code>Number</code> | <p>The non-interactive timeout in ms. Default 3s.</p> |

<a name="module_ledger.LedgerApp+getVersion"></a>

#### ledgerApp.getVersion()
<p>Gets the version of the Ledger app that is currently open on the device.</p>

**Kind**: instance method of [<code>LedgerApp</code>](#module_ledger.LedgerApp)  
**Throws**:

- <p>Will throw Error if a transport error occurs, or if the firmware app is not open.</p>

<a name="module_ledger.LedgerApp+publicKeySecp256k1"></a>

#### ledgerApp.publicKeySecp256k1(hdPath)
<p>Gets the public key from the Ledger app that is currently open on the device.</p>

**Kind**: instance method of [<code>LedgerApp</code>](#module_ledger.LedgerApp)  
**Throws**:

- <p>Will throw Error if a transport error occurs, or if the firmware app is not open.</p>


| Param | Type | Description |
| --- | --- | --- |
| hdPath | <code>array</code> | <p>The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]</p> |

<a name="module_ledger.LedgerApp+signSecp256k1"></a>

#### ledgerApp.signSecp256k1(signBytes, hdPath)
<p>Sends a transaction sign doc to the Ledger app to be signed.</p>

**Kind**: instance method of [<code>LedgerApp</code>](#module_ledger.LedgerApp)  
**Throws**:

- <p>Will throw Error if a transport error occurs, or if the firmware app is not open.</p>


| Param | Type | Description |
| --- | --- | --- |
| signBytes | <code>Buffer</code> | <p>The TX sign doc bytes to sign</p> |
| hdPath | <code>array</code> | <p>The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]</p> |

<a name="module_ledger.LedgerApp+showAddress"></a>

#### ledgerApp.showAddress(hrp, hdPath)
<p>Shows the user's address for the given HD path on the device display.</p>

**Kind**: instance method of [<code>LedgerApp</code>](#module_ledger.LedgerApp)  
**Throws**:

- <p>Will throw Error if a transport error occurs, or if the firmware app is not open.</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| hrp | <code>string</code> | <code>&quot;bnb&quot;</code> | <p>The bech32 human-readable prefix</p> |
| hdPath | <code>array</code> |  | <p>The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]</p> |

<a name="module_ledger.LedgerApp+getPublicKey"></a>

#### ledgerApp.getPublicKey(hdPath)
<p>Gets the public key from the Ledger app that is currently open on the device.</p>

**Kind**: instance method of [<code>LedgerApp</code>](#module_ledger.LedgerApp)  
**Throws**:

- <p>Will throw Error if a transport error occurs, or if the firmware app is not open.</p>


| Param | Type | Description |
| --- | --- | --- |
| hdPath | <code>array</code> | <p>The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]</p> |

<a name="module_ledger.LedgerApp+sign"></a>

#### ledgerApp.sign(signBytes, hdPath)
<p>Sends a transaction sign doc to the Ledger app to be signed.</p>

**Kind**: instance method of [<code>LedgerApp</code>](#module_ledger.LedgerApp)  
**Throws**:

- <p>Will throw Error if a transport error occurs, or if the firmware app is not open.</p>


| Param | Type | Description |
| --- | --- | --- |
| signBytes | <code>Buffer</code> | <p>The TX sign doc bytes to sign</p> |
| hdPath | <code>array</code> | <p>The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]</p> |

<a name="module_utils"></a>

## utils

* [utils](#module_utils)
    * _static_
        * [.ab2str](#module_utils.ab2str) ⇒ <code>arrayBuffer</code>
        * [.str2ab](#module_utils.str2ab) ⇒ <code>Array.&lt;number&gt;</code>
        * [.hexstring2ab](#module_utils.hexstring2ab) ⇒ <code>string</code>
        * [.ab2hexstring](#module_utils.ab2hexstring) ⇒ <code>string</code>
        * [.str2hexstring](#module_utils.str2hexstring) ⇒ <code>string</code>
        * [.hexstring2str](#module_utils.hexstring2str) ⇒ <code>string</code>
        * [.int2hex](#module_utils.int2hex) ⇒ <code>string</code>
        * [.num2hexstring](#module_utils.num2hexstring) ⇒ <code>string</code>
        * [.num2VarInt](#module_utils.num2VarInt) ⇒ <code>string</code>
        * [.hexXor](#module_utils.hexXor) ⇒ <code>Uint8Array</code>
        * [.reverseArray](#module_utils.reverseArray) ⇒ <code>string</code>
        * [.isHex](#module_utils.isHex)
        * [.ensureHex](#module_utils.ensureHex) ⇒ <code>string</code>
        * [.sha256ripemd160](#module_utils.sha256ripemd160) ⇒ <code>string</code>
        * [.sha256](#module_utils.sha256) ⇒ <code>string</code>
        * [.sha3](#module_utils.sha3) ⇒ <code>string</code>
        * [.calculateRandomNumberHash](#module_utils.calculateRandomNumberHash) ⇒ <code>string</code>
    * _inner_
        * [~ab2str(buf)](#module_utils..ab2str) ⇒ <code>string</code>
        * [~isHex(str)](#module_utils..isHex) ⇒ <code>boolean</code>

<a name="module_utils.ab2str"></a>

### utils.ab2str ⇒ <code>arrayBuffer</code>
**Kind**: static property of [<code>utils</code>](#module_utils)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | <p>ASCII string</p> |

<a name="module_utils.str2ab"></a>

### utils.str2ab ⇒ <code>Array.&lt;number&gt;</code>
**Kind**: static property of [<code>utils</code>](#module_utils)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | <p>HEX string</p> |

<a name="module_utils.hexstring2ab"></a>

### utils.hexstring2ab ⇒ <code>string</code>
**Kind**: static property of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - <p>HEX string</p>  

| Param | Type |
| --- | --- |
| arr | <code>arrayBuffer</code> | 

<a name="module_utils.ab2hexstring"></a>

### utils.ab2hexstring ⇒ <code>string</code>
**Kind**: static property of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - <p>HEX string</p>  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | <p>ASCII string</p> |

<a name="module_utils.str2hexstring"></a>

### utils.str2hexstring ⇒ <code>string</code>
**Kind**: static property of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - <p>ASCII string</p>  

| Param | Type | Description |
| --- | --- | --- |
| hexstring | <code>string</code> | <p>HEX string</p> |

<a name="module_utils.hexstring2str"></a>

### utils.hexstring2str ⇒ <code>string</code>
<p>convert an integer to big endian hex and add leading zeros</p>

**Kind**: static property of [<code>utils</code>](#module_utils)  

| Param | Type |
| --- | --- |
| num | <code>Number</code> | 

<a name="module_utils.int2hex"></a>

### utils.int2hex ⇒ <code>string</code>
<p>Converts a number to a big endian hexstring of a suitable size, optionally little endian</p>

**Kind**: static property of [<code>utils</code>](#module_utils)  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Number</code> |  |
| size | <code>Number</code> | <p>The required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1.</p> |
| littleEndian | <code>Boolean</code> | <p>Encode the hex in little endian form</p> |

<a name="module_utils.num2hexstring"></a>

### utils.num2hexstring ⇒ <code>string</code>
<p>Converts a number to a variable length Int. Used for array length header</p>

**Kind**: static property of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - <p>hexstring of the variable Int.</p>  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Number</code> | <p>The number</p> |

<a name="module_utils.num2VarInt"></a>

### utils.num2VarInt ⇒ <code>string</code>
<p>XORs two hexstrings</p>

**Kind**: static property of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - <p>XOR output as a HEX string</p>  

| Param | Type | Description |
| --- | --- | --- |
| str1 | <code>string</code> | <p>HEX string</p> |
| str2 | <code>string</code> | <p>HEX string</p> |

<a name="module_utils.hexXor"></a>

### utils.hexXor ⇒ <code>Uint8Array</code>
<p>Reverses an array. Accepts arrayBuffer.</p>

**Kind**: static property of [<code>utils</code>](#module_utils)  

| Param | Type |
| --- | --- |
| arr | <code>Array</code> | 

<a name="module_utils.reverseArray"></a>

### utils.reverseArray ⇒ <code>string</code>
<p>Reverses a HEX string, treating 2 chars as a byte.</p>

**Kind**: static property of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - <p>HEX string reversed in 2s.</p>  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | <p>HEX string</p> |

**Example**  
```js
reverseHex('abcdef') = 'efcdab'
```
<a name="module_utils.isHex"></a>

### utils.isHex
<p>Throws an error if input is not hexstring.</p>

**Kind**: static property of [<code>utils</code>](#module_utils)  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="module_utils.ensureHex"></a>

### utils.ensureHex ⇒ <code>string</code>
<p>Computes a SHA256 followed by a RIPEMD160.</p>

**Kind**: static property of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - <p>hash output</p>  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | <p>message to hash</p> |

<a name="module_utils.sha256ripemd160"></a>

### utils.sha256ripemd160 ⇒ <code>string</code>
<p>Computes a single SHA256 digest.</p>

**Kind**: static property of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - <p>hash output</p>  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | <p>message to hash</p> |

<a name="module_utils.sha256"></a>

### utils.sha256 ⇒ <code>string</code>
<p>Computes a single SHA3 (Keccak) digest.</p>

**Kind**: static property of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - <p>hash output</p>  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | <p>message to hash</p> |

<a name="module_utils.sha3"></a>

### utils.sha3 ⇒ <code>string</code>
<p>Computes sha256 of random number and timestamp</p>

**Kind**: static property of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - <p>sha256 result</p>  

| Param | Type |
| --- | --- |
| randomNumber | <code>String</code> | 
| timestamp | <code>Number</code> | 

<a name="module_utils.calculateRandomNumberHash"></a>

### utils.calculateRandomNumberHash ⇒ <code>string</code>
<p>Computes swapID</p>

**Kind**: static property of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - <p>sha256 result</p>  

| Param | Type |
| --- | --- |
| randomNumberHash | <code>String</code> | 
| sender | <code>String</code> | 
| senderOtherChain | <code>String</code> | 

<a name="module_utils..ab2str"></a>

### utils~ab2str(buf) ⇒ <code>string</code>
**Kind**: inner method of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - <p>ASCII string</p>  

| Param | Type |
| --- | --- |
| buf | <code>arrayBuffer</code> | 

<a name="module_utils..isHex"></a>

### utils~isHex(str) ⇒ <code>boolean</code>
<p>Checks if input is a hexstring. Empty string is considered a hexstring.</p>

**Kind**: inner method of [<code>utils</code>](#module_utils)  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

**Example**  
```js
isHex('0101') = true
isHex('') = true
isHex('0x01') = false
```
<a name="BncClient"></a>

## BncClient
<p>The Binance Chain client.</p>

**Kind**: global class  

* [BncClient](#BncClient)
    * [new BncClient(server, useAsyncBroadcast, source)](#new_BncClient_new)
    * [.initChain()](#BncClient+initChain) ⇒ <code>Promise</code>
    * [.chooseNetwork(network)](#BncClient+chooseNetwork)
    * [.setPrivateKey(privateKey, localOnly)](#BncClient+setPrivateKey) ⇒ <code>Promise</code>
    * [.setAccountNumber(accountNumber)](#BncClient+setAccountNumber)
    * [.useAsyncBroadcast(useAsyncBroadcast)](#BncClient+useAsyncBroadcast) ⇒ [<code>BncClient</code>](#BncClient)
    * [.setSigningDelegate(delegate)](#BncClient+setSigningDelegate) ⇒ [<code>BncClient</code>](#BncClient)
    * [.setBroadcastDelegate(delegate)](#BncClient+setBroadcastDelegate) ⇒ [<code>BncClient</code>](#BncClient)
    * [.useDefaultSigningDelegate()](#BncClient+useDefaultSigningDelegate) ⇒ [<code>BncClient</code>](#BncClient)
    * [.useDefaultBroadcastDelegate()](#BncClient+useDefaultBroadcastDelegate) ⇒ [<code>BncClient</code>](#BncClient)
    * [.useLedgerSigningDelegate(ledgerApp, preSignCb, postSignCb, errCb)](#BncClient+useLedgerSigningDelegate) ⇒ [<code>BncClient</code>](#BncClient)
    * [.transfer(fromAddress, toAddress, amount, asset, memo, sequence)](#BncClient+transfer) ⇒ <code>Promise</code>
    * [.multiSend(fromAddress, outputs, memo, sequence)](#BncClient+multiSend) ⇒ <code>Promise</code>
    * [.cancelOrder(fromAddress, symbol, refid, sequence)](#BncClient+cancelOrder) ⇒ <code>Promise</code>
    * [.placeOrder(address, symbol, side, price, quantity, sequence, timeinforce)](#BncClient+placeOrder) ⇒ <code>Promise</code>
    * [.list(address, proposalId, baseAsset, quoteAsset, initPrice, sequence)](#BncClient+list) ⇒ <code>Promise</code>
    * [.setAccountFlags(address, flags, sequence)](#BncClient+setAccountFlags) ⇒ <code>Promise</code>
    * [._prepareTransaction(msg, stdSignMsg, address, sequence, memo)](#BncClient+_prepareTransaction) ⇒ [<code>Transaction</code>](#Transaction)
    * [.sendTransaction(tx, sync)](#BncClient+sendTransaction) ⇒ <code>Promise</code>
    * [.sendRawTransaction(signedBz, sync)](#BncClient+sendRawTransaction) ⇒ <code>Promise</code>
    * [._sendTransaction(msg, stdSignMsg, address, sequence, memo, sync)](#BncClient+_sendTransaction) ⇒ <code>Promise</code>
    * [.getAccount(address)](#BncClient+getAccount) ⇒ <code>Promise</code>
    * [.getBalance(address)](#BncClient+getBalance) ⇒ <code>Promise</code>
    * [.getMarkets(limit, offset)](#BncClient+getMarkets) ⇒ <code>Promise</code>
    * [.getTransactions(address, offset)](#BncClient+getTransactions) ⇒ <code>Promise</code>
    * [.getTx(hash)](#BncClient+getTx) ⇒ <code>Promise</code>
    * [.getDepth(symbol)](#BncClient+getDepth) ⇒ <code>Promise</code>
    * [.getOpenOrders(address, symbol)](#BncClient+getOpenOrders) ⇒ <code>Promise</code>
    * [.getSwapByID(swapID:)](#BncClient+getSwapByID) ⇒ <code>Promise</code>
    * [.getSwapByCreator(creator:, offset, limit,)](#BncClient+getSwapByCreator) ⇒ <code>Promise</code>
    * [.getSwapByRecipient(recipient:, offset, limit,)](#BncClient+getSwapByRecipient) ⇒ <code>Promise</code>
    * [.createAccount()](#BncClient+createAccount) ⇒ <code>object</code>
    * [.createAccountWithKeystore(password)](#BncClient+createAccountWithKeystore)
    * [.createAccountWithMneomnic()](#BncClient+createAccountWithMneomnic) ⇒ <code>object</code>
    * [.recoverAccountFromKeystore(keystore, password)](#BncClient+recoverAccountFromKeystore)
    * [.recoverAccountFromMnemonic(mneomnic)](#BncClient+recoverAccountFromMnemonic)
    * [.recoverAccountFromPrivateKey(privateKey)](#BncClient+recoverAccountFromPrivateKey)
    * [.checkAddress(address, prefix)](#BncClient+checkAddress) ⇒ <code>Boolean</code>
    * [.getClientKeyAddress()](#BncClient+getClientKeyAddress) ⇒ <code>String</code>

<a name="new_BncClient_new"></a>

### new BncClient(server, useAsyncBroadcast, source)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| server | <code>String</code> |  | <p>Binance Chain public url</p> |
| useAsyncBroadcast | <code>Boolean</code> | <code>false</code> | <p>use async broadcast mode, faster but less guarantees (default off)</p> |
| source | <code>Number</code> | <code>0</code> | <p>where does this transaction come from (default 0)</p> |

<a name="BncClient+initChain"></a>

### bncClient.initChain() ⇒ <code>Promise</code>
<p>Initialize the client with the chain's ID. Asynchronous.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
<a name="BncClient+chooseNetwork"></a>

### bncClient.chooseNetwork(network)
<p>Sets the client network (testnet or mainnet).</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  

| Param | Type | Description |
| --- | --- | --- |
| network | <code>String</code> | <p>Indicate testnet or mainnet</p> |

<a name="BncClient+setPrivateKey"></a>

### bncClient.setPrivateKey(privateKey, localOnly) ⇒ <code>Promise</code>
<p>Sets the client's private key for calls made by this client. Asynchronous.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| privateKey | <code>string</code> |  | <p>the private key hexstring</p> |
| localOnly | <code>boolean</code> | <code>false</code> | <p>set this to true if you will supply an account_number yourself via <code>setAccountNumber</code>. Warning: You must do that if you set this to true!</p> |

<a name="BncClient+setAccountNumber"></a>

### bncClient.setAccountNumber(accountNumber)
<p>Sets the client's account number.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  

| Param | Type |
| --- | --- |
| accountNumber | <code>number</code> | 

<a name="BncClient+useAsyncBroadcast"></a>

### bncClient.useAsyncBroadcast(useAsyncBroadcast) ⇒ [<code>BncClient</code>](#BncClient)
<p>Use async broadcast mode. Broadcasts faster with less guarantees (default off)</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: [<code>BncClient</code>](#BncClient) - <p>this instance (for chaining)</p>  

| Param | Type | Default |
| --- | --- | --- |
| useAsyncBroadcast | <code>Boolean</code> | <code>true</code> | 

<a name="BncClient+setSigningDelegate"></a>

### bncClient.setSigningDelegate(delegate) ⇒ [<code>BncClient</code>](#BncClient)
<p>Sets the signing delegate (for wallet integrations).</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: [<code>BncClient</code>](#BncClient) - <p>this instance (for chaining)</p>  

| Param | Type |
| --- | --- |
| delegate | <code>function</code> | 

<a name="BncClient+setBroadcastDelegate"></a>

### bncClient.setBroadcastDelegate(delegate) ⇒ [<code>BncClient</code>](#BncClient)
<p>Sets the broadcast delegate (for wallet integrations).</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: [<code>BncClient</code>](#BncClient) - <p>this instance (for chaining)</p>  

| Param | Type |
| --- | --- |
| delegate | <code>function</code> | 

<a name="BncClient+useDefaultSigningDelegate"></a>

### bncClient.useDefaultSigningDelegate() ⇒ [<code>BncClient</code>](#BncClient)
<p>Applies the default signing delegate.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: [<code>BncClient</code>](#BncClient) - <p>this instance (for chaining)</p>  
<a name="BncClient+useDefaultBroadcastDelegate"></a>

### bncClient.useDefaultBroadcastDelegate() ⇒ [<code>BncClient</code>](#BncClient)
<p>Applies the default broadcast delegate.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: [<code>BncClient</code>](#BncClient) - <p>this instance (for chaining)</p>  
<a name="BncClient+useLedgerSigningDelegate"></a>

### bncClient.useLedgerSigningDelegate(ledgerApp, preSignCb, postSignCb, errCb) ⇒ [<code>BncClient</code>](#BncClient)
<p>Applies the Ledger signing delegate.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: [<code>BncClient</code>](#BncClient) - <p>this instance (for chaining)</p>  

| Param | Type |
| --- | --- |
| ledgerApp | <code>function</code> | 
| preSignCb | <code>function</code> | 
| postSignCb | <code>function</code> | 
| errCb | <code>function</code> | 

<a name="BncClient+transfer"></a>

### bncClient.transfer(fromAddress, toAddress, amount, asset, memo, sequence) ⇒ <code>Promise</code>
<p>Transfer tokens from one address to another.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with response (success or fail)</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fromAddress | <code>String</code> |  |  |
| toAddress | <code>String</code> |  |  |
| amount | <code>Number</code> |  |  |
| asset | <code>String</code> |  |  |
| memo | <code>String</code> |  | <p>optional memo</p> |
| sequence | <code>Number</code> | <code></code> | <p>optional sequence</p> |

<a name="BncClient+multiSend"></a>

### bncClient.multiSend(fromAddress, outputs, memo, sequence) ⇒ <code>Promise</code>
<p>Create and sign a multi send tx</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with response (success or fail)</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fromAddress | <code>String</code> |  |  |
| outputs | <code>Array</code> |  |  |
| memo | <code>String</code> |  | <p>optional memo</p> |
| sequence | <code>Number</code> | <code></code> | <p>optional sequence</p> |

**Example**  
```js
const outputs = [
{
  "to": "tbnb1p4kpnj5qz5spsaf0d2555h6ctngse0me5q57qe",
  "coins": [{
    "denom": "BNB",
    "amount": 10
  },{
    "denom": "BTC",
    "amount": 10
  }]
},
{
  "to": "tbnb1scjj8chhhp7lngdeflltzex22yaf9ep59ls4gk",
  "coins": [{
    "denom": "BTC",
    "amount": 10
  },{
    "denom": "BNB",
    "amount": 10
  }]
}]
```
<a name="BncClient+cancelOrder"></a>

### bncClient.cancelOrder(fromAddress, symbol, refid, sequence) ⇒ <code>Promise</code>
<p>Cancel an order.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with response (success or fail)</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fromAddress | <code>String</code> |  |  |
| symbol | <code>String</code> |  | <p>the market pair</p> |
| refid | <code>String</code> |  | <p>the order ID of the order to cancel</p> |
| sequence | <code>Number</code> | <code></code> | <p>optional sequence</p> |

<a name="BncClient+placeOrder"></a>

### bncClient.placeOrder(address, symbol, side, price, quantity, sequence, timeinforce) ⇒ <code>Promise</code>
<p>Place an order.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with response (success or fail)</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>String</code> |  |  |
| symbol | <code>String</code> |  | <p>the market pair</p> |
| side | <code>Number</code> |  | <p>(1-Buy, 2-Sell)</p> |
| price | <code>Number</code> |  |  |
| quantity | <code>Number</code> |  |  |
| sequence | <code>Number</code> | <code></code> | <p>optional sequence</p> |
| timeinforce | <code>Number</code> | <code>1</code> | <p>(1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel))</p> |

<a name="BncClient+list"></a>

### bncClient.list(address, proposalId, baseAsset, quoteAsset, initPrice, sequence) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with response (success or fail)</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>String</code> |  |  |
| proposalId | <code>Number</code> |  |  |
| baseAsset | <code>String</code> |  |  |
| quoteAsset | <code>String</code> |  |  |
| initPrice | <code>Number</code> |  |  |
| sequence | <code>Number</code> | <code></code> | <p>optional sequence</p> |

<a name="BncClient+setAccountFlags"></a>

### bncClient.setAccountFlags(address, flags, sequence) ⇒ <code>Promise</code>
<p>Set account flags</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with response (success or fail)</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>String</code> |  |  |
| flags | <code>Number</code> |  | <p>new value of account flags</p> |
| sequence | <code>Number</code> | <code></code> | <p>optional sequence</p> |

<a name="BncClient+_prepareTransaction"></a>

### bncClient.\_prepareTransaction(msg, stdSignMsg, address, sequence, memo) ⇒ [<code>Transaction</code>](#Transaction)
<p>Prepare a serialized raw transaction for sending to the blockchain.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: [<code>Transaction</code>](#Transaction) - <p>signed transaction</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| msg | <code>Object</code> |  | <p>the msg object</p> |
| stdSignMsg | <code>Object</code> |  | <p>the sign doc object used to generate a signature</p> |
| address | <code>String</code> |  |  |
| sequence | <code>Number</code> | <code></code> | <p>optional sequence</p> |
| memo | <code>String</code> |  | <p>optional memo</p> |

<a name="BncClient+sendTransaction"></a>

### bncClient.sendTransaction(tx, sync) ⇒ <code>Promise</code>
<p>Broadcast a transaction to the blockchain.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with response (success or fail)</p>  

| Param | Type | Description |
| --- | --- | --- |
| tx | <code>signedTx</code> | <p>signed Transaction object</p> |
| sync | <code>Boolean</code> | <p>use synchronous mode, optional</p> |

<a name="BncClient+sendRawTransaction"></a>

### bncClient.sendRawTransaction(signedBz, sync) ⇒ <code>Promise</code>
<p>Broadcast a raw transaction to the blockchain.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with response (success or fail)</p>  

| Param | Type | Description |
| --- | --- | --- |
| signedBz | <code>String</code> | <p>signed and serialized raw transaction</p> |
| sync | <code>Boolean</code> | <p>use synchronous mode, optional</p> |

<a name="BncClient+_sendTransaction"></a>

### bncClient.\_sendTransaction(msg, stdSignMsg, address, sequence, memo, sync) ⇒ <code>Promise</code>
<p>Broadcast a raw transaction to the blockchain.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with response (success or fail)</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| msg | <code>Object</code> |  | <p>the msg object</p> |
| stdSignMsg | <code>Object</code> |  | <p>the sign doc object used to generate a signature</p> |
| address | <code>String</code> |  |  |
| sequence | <code>Number</code> | <code></code> | <p>optional sequence</p> |
| memo | <code>String</code> |  | <p>optional memo</p> |
| sync | <code>Boolean</code> |  | <p>use synchronous mode, optional</p> |

<a name="BncClient+getAccount"></a>

### bncClient.getAccount(address) ⇒ <code>Promise</code>
<p>get account</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with http response</p>  

| Param | Type |
| --- | --- |
| address | <code>String</code> | 

<a name="BncClient+getBalance"></a>

### bncClient.getBalance(address) ⇒ <code>Promise</code>
<p>get balances</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with http response</p>  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>String</code> | <p>optional address</p> |

<a name="BncClient+getMarkets"></a>

### bncClient.getMarkets(limit, offset) ⇒ <code>Promise</code>
<p>get markets</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with http response</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| limit | <code>Number</code> | <code>1000</code> | <p>max 1000 is default</p> |
| offset | <code>Number</code> | <code>0</code> | <p>from beggining, default 0</p> |

<a name="BncClient+getTransactions"></a>

### bncClient.getTransactions(address, offset) ⇒ <code>Promise</code>
<p>get transactions for an account</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with http response</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>String</code> |  | <p>optional address</p> |
| offset | <code>Number</code> | <code>0</code> | <p>from beggining, default 0</p> |

<a name="BncClient+getTx"></a>

### bncClient.getTx(hash) ⇒ <code>Promise</code>
<p>get transaction</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with http response</p>  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>String</code> | <p>the transaction hash</p> |

<a name="BncClient+getDepth"></a>

### bncClient.getDepth(symbol) ⇒ <code>Promise</code>
<p>get depth for a given market</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with http response</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| symbol | <code>String</code> | <code>BNB_BUSD-BD1</code> | <p>the market pair</p> |

<a name="BncClient+getOpenOrders"></a>

### bncClient.getOpenOrders(address, symbol) ⇒ <code>Promise</code>
<p>get open orders for an address</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>resolves with http response</p>  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>String</code> | <p>binance address</p> |
| symbol | <code>String</code> | <p>binance BEP2 symbol</p> |

<a name="BncClient+getSwapByID"></a>

### bncClient.getSwapByID(swapID:) ⇒ <code>Promise</code>
<p>get atomic swap</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>AtomicSwap</p>  

| Param | Type | Description |
| --- | --- | --- |
| swapID: | <code>String</code> | <p>ID of an existing swap</p> |

<a name="BncClient+getSwapByCreator"></a>

### bncClient.getSwapByCreator(creator:, offset, limit,) ⇒ <code>Promise</code>
<p>query atomic swap list by creator address</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>Array of AtomicSwap</p>  

| Param | Type | Description |
| --- | --- | --- |
| creator: | <code>String</code> | <p>swap creator address</p> |
| offset | <code>Number</code> | <p>from beginning, default 0</p> |
| limit, | <code>Number</code> | <p>max 1000 is default</p> |

<a name="BncClient+getSwapByRecipient"></a>

### bncClient.getSwapByRecipient(recipient:, offset, limit,) ⇒ <code>Promise</code>
<p>query atomic swap list by recipient address</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>Promise</code> - <p>Array of AtomicSwap</p>  

| Param | Type | Description |
| --- | --- | --- |
| recipient: | <code>String</code> | <p>the recipient address of the swap</p> |
| offset | <code>Number</code> | <p>from beginning, default 0</p> |
| limit, | <code>Number</code> | <p>max 1000 is default</p> |

<a name="BncClient+createAccount"></a>

### bncClient.createAccount() ⇒ <code>object</code>
<p>Creates a private key and returns it and its address.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>object</code> - <p>the private key and address in an object.
{
address,
privateKey
}</p>  
<a name="BncClient+createAccountWithKeystore"></a>

### bncClient.createAccountWithKeystore(password)
<p>Creates an account keystore object, and returns the private key and address.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>String</code> | <p>{ privateKey, address, keystore }</p> |

<a name="BncClient+createAccountWithMneomnic"></a>

### bncClient.createAccountWithMneomnic() ⇒ <code>object</code>
<p>Creates an account from mnemonic seed phrase.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
**Returns**: <code>object</code> - <p>{
privateKey,
address,
mnemonic
}</p>  
<a name="BncClient+recoverAccountFromKeystore"></a>

### bncClient.recoverAccountFromKeystore(keystore, password)
<p>Recovers an account from a keystore object.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  

| Param | Type | Description |
| --- | --- | --- |
| keystore | <code>object</code> | <p>object.</p> |
| password | <code>string</code> | <p>password. { privateKey, address }</p> |

<a name="BncClient+recoverAccountFromMnemonic"></a>

### bncClient.recoverAccountFromMnemonic(mneomnic)
<p>Recovers an account from a mnemonic seed phrase.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  

| Param | Type | Description |
| --- | --- | --- |
| mneomnic | <code>string</code> | <p>{ privateKey, address }</p> |

<a name="BncClient+recoverAccountFromPrivateKey"></a>

### bncClient.recoverAccountFromPrivateKey(privateKey)
<p>Recovers an account using private key.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>String</code> | <p>{ privateKey, address }</p> |

<a name="BncClient+checkAddress"></a>

### bncClient.checkAddress(address, prefix) ⇒ <code>Boolean</code>
<p>Validates an address.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  

| Param | Type |
| --- | --- |
| address | <code>String</code> | 
| prefix | <code>String</code> | 

<a name="BncClient+getClientKeyAddress"></a>

### bncClient.getClientKeyAddress() ⇒ <code>String</code>
<p>Returns the address for the current account if setPrivateKey has been called on this client.</p>

**Kind**: instance method of [<code>BncClient</code>](#BncClient)  
<a name="RpcClient"></a>

## RpcClient
<p>The Binance Chain Node rpc client</p>

**Kind**: global class  

* [RpcClient](#RpcClient)
    * [new RpcClient(uriString, netWork)](#new_RpcClient_new)
    * [.broadcastDelegate(signedTx)](#RpcClient+broadcastDelegate) ⇒ <code>Promise</code>
    * [.getTokenInfo(symbol)](#RpcClient+getTokenInfo) ⇒ <code>Object</code>
    * [.listAllTokens(offset, limit)](#RpcClient+listAllTokens) ⇒ <code>Array</code>
    * [.getAccount(address)](#RpcClient+getAccount) ⇒ <code>Object</code>
    * [.getBalances(balances)](#RpcClient+getBalances)
    * [.getBalance(address, symbol)](#RpcClient+getBalance) ⇒ <code>Object</code>
    * [.getOpenOrders(address, symbol)](#RpcClient+getOpenOrders) ⇒ <code>Object</code>
    * [.getTradingPairs(offset, limit)](#RpcClient+getTradingPairs) ⇒ <code>Array</code>
    * [.getDepth(tradePair)](#RpcClient+getDepth) ⇒ <code>Array</code>

<a name="new_RpcClient_new"></a>

### new RpcClient(uriString, netWork)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| uriString | <code>String</code> | <code>localhost:27146</code> | <p>dataseed address</p> |
| netWork | <code>String</code> |  | <p>Binance Chain network</p> |

<a name="RpcClient+broadcastDelegate"></a>

### rpcClient.broadcastDelegate(signedTx) ⇒ <code>Promise</code>
<p>The RPC broadcast delegate broadcasts a transaction via RPC. This is intended for optional use as BncClient's broadcast delegate.</p>

**Kind**: instance method of [<code>RpcClient</code>](#RpcClient)  

| Param | Type | Description |
| --- | --- | --- |
| signedTx | [<code>Transaction</code>](#Transaction) | <p>the signed transaction</p> |

<a name="RpcClient+getTokenInfo"></a>

### rpcClient.getTokenInfo(symbol) ⇒ <code>Object</code>
**Kind**: instance method of [<code>RpcClient</code>](#RpcClient)  
**Returns**: <code>Object</code> - <p>token detail info</p>  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>String</code> | <p>required</p> |

<a name="RpcClient+listAllTokens"></a>

### rpcClient.listAllTokens(offset, limit) ⇒ <code>Array</code>
<p>get tokens by offset and limit</p>

**Kind**: instance method of [<code>RpcClient</code>](#RpcClient)  
**Returns**: <code>Array</code> - <p>token list</p>  

| Param | Type |
| --- | --- |
| offset | <code>Number</code> | 
| limit | <code>Number</code> | 

<a name="RpcClient+getAccount"></a>

### rpcClient.getAccount(address) ⇒ <code>Object</code>
**Kind**: instance method of [<code>RpcClient</code>](#RpcClient)  
**Returns**: <code>Object</code> - <p>Account info</p>  

| Param | Type |
| --- | --- |
| address | <code>String</code> | 

<a name="RpcClient+getBalances"></a>

### rpcClient.getBalances(balances)
**Kind**: instance method of [<code>RpcClient</code>](#RpcClient)  

| Param | Type |
| --- | --- |
| balances | <code>Array</code> | 

<a name="RpcClient+getBalance"></a>

### rpcClient.getBalance(address, symbol) ⇒ <code>Object</code>
<p>get balance by symbol and address</p>

**Kind**: instance method of [<code>RpcClient</code>](#RpcClient)  

| Param | Type |
| --- | --- |
| address | <code>String</code> | 
| symbol | <code>String</code> | 

<a name="RpcClient+getOpenOrders"></a>

### rpcClient.getOpenOrders(address, symbol) ⇒ <code>Object</code>
**Kind**: instance method of [<code>RpcClient</code>](#RpcClient)  

| Param | Type |
| --- | --- |
| address | <code>String</code> | 
| symbol | <code>String</code> | 

<a name="RpcClient+getTradingPairs"></a>

### rpcClient.getTradingPairs(offset, limit) ⇒ <code>Array</code>
**Kind**: instance method of [<code>RpcClient</code>](#RpcClient)  

| Param | Type |
| --- | --- |
| offset | <code>Number</code> | 
| limit | <code>Number</code> | 

<a name="RpcClient+getDepth"></a>

### rpcClient.getDepth(tradePair) ⇒ <code>Array</code>
**Kind**: instance method of [<code>RpcClient</code>](#RpcClient)  

| Param | Type |
| --- | --- |
| tradePair | <code>String</code> | 

<a name="Transaction"></a>

## Transaction
<p>Creates a new transaction object.</p>

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| raw | <code>Buffer</code> | <p>The raw vstruct encoded transaction</p> |


* [Transaction](#Transaction)
    * [new Transaction(type)](#new_Transaction_new)
    * [.getSignBytes(concrete)](#Transaction+getSignBytes) ⇒ <code>Buffer</code>
    * [.addSignature(pubKey, signature)](#Transaction+addSignature) ⇒ [<code>Transaction</code>](#Transaction)
    * [.sign(privateKey, concrete)](#Transaction+sign) ⇒ [<code>Transaction</code>](#Transaction)
    * [.serialize()](#Transaction+serialize)
    * [._serializePubKey(unencodedPubKey)](#Transaction+_serializePubKey) ⇒ <code>Buffer</code>

<a name="new_Transaction_new"></a>

### new Transaction(type)

| Param | Type | Description |
| --- | --- | --- |
| data.account_number | <code>Number</code> | <p>account number</p> |
| data.chain_id | <code>String</code> | <p>bnbChain Id</p> |
| data.memo | <code>String</code> | <p>transaction memo</p> |
| type | <code>String</code> | <p>transaction type</p> |
| data.msg | <code>Msg</code> | <p>object data of tx type</p> |
| data.sequence | <code>Number</code> | <p>transaction counts</p> |
| data.source | <code>Number</code> | <p>where does this transaction come from</p> |

**Example**  
```js
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
```
<a name="Transaction+getSignBytes"></a>

### transaction.getSignBytes(concrete) ⇒ <code>Buffer</code>
<p>generate the sign bytes for a transaction, given a msg</p>

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  

| Param | Type | Description |
| --- | --- | --- |
| concrete | <code>SignMsg</code> | <p>msg object</p> |

<a name="Transaction+addSignature"></a>

### transaction.addSignature(pubKey, signature) ⇒ [<code>Transaction</code>](#Transaction)
<p>attaches a signature to the transaction</p>

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  

| Param | Type |
| --- | --- |
| pubKey | <code>Elliptic.PublicKey</code> | 
| signature | <code>Buffer</code> | 

<a name="Transaction+sign"></a>

### transaction.sign(privateKey, concrete) ⇒ [<code>Transaction</code>](#Transaction)
<p>sign transaction with a given private key and msg</p>

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | <p>private key hex string</p> |
| concrete | <code>SignMsg</code> | <p>msg object</p> |

<a name="Transaction+serialize"></a>

### transaction.serialize()
<p>encode signed transaction to hex which is compatible with amino</p>

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  
<a name="Transaction+_serializePubKey"></a>

### transaction.\_serializePubKey(unencodedPubKey) ⇒ <code>Buffer</code>
<p>serializes a public key in a 33-byte compressed format.</p>

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  

| Param | Type |
| --- | --- |
| unencodedPubKey | <code>Elliptic.PublicKey</code> | 

<a name="DefaultSigningDelegate"></a>

## DefaultSigningDelegate
<p>The default broadcast delegate which immediately broadcasts a transaction.</p>

**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| signedTx | [<code>Transaction</code>](#Transaction) | <p>the signed transaction</p> |

<a name="DefaultBroadcastDelegate"></a>

## DefaultBroadcastDelegate ⇒ <code>function</code>
<p>The Ledger signing delegate.</p>

**Kind**: global variable  

| Param | Type |
| --- | --- |
| ledgerApp | <code>LedgerApp</code> | 
| function | <code>preSignCb</code> | 
| function | <code>postSignCb</code> | 
| function | <code>errCb</code> | 

<a name="LedgerSigningDelegate"></a>

## LedgerSigningDelegate
<p>validate the input number.</p>

**Kind**: global variable  

| Param | Type |
| --- | --- |
| outputs | <code>Array</code> | 

<a name="checkNumber"></a>

## checkNumber
<p>basic validation of coins</p>

**Kind**: global variable  

| Param | Type |
| --- | --- |
| coins | <code>Array</code> | 

<a name="DefaultSigningDelegate"></a>

## DefaultSigningDelegate(tx, signMsg) ⇒ [<code>Transaction</code>](#Transaction)
<p>The default signing delegate which uses the local private key.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tx | [<code>Transaction</code>](#Transaction) | <p>the transaction</p> |
| signMsg | <code>Object</code> | <p>the canonical sign bytes for the msg</p> |

<a name="calInputCoins"></a>

## calInputCoins(inputs, coins)
<p>sum corresponding input coin</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| inputs | <code>Array</code> | 
| coins | <code>Array</code> | 

<a name="checkNumber"></a>

## checkNumber(value)
<p>validate the input number.</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| value | <code>Number</code> | 

