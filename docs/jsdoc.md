## Modules

<dl>
<dt><a href="#module_client">client</a></dt>
<dd></dd>
<dt><a href="#module_crypto">crypto</a></dt>
<dd></dd>
<dt><a href="#module_amino">amino</a></dt>
<dd></dd>
<dt><a href="#module_ledger">ledger</a></dt>
<dd></dd>
<dt><a href="#module_utils">utils</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#Transaction">Transaction</a></dt>
<dd><p>Creates a new transaction object.</p>
</dd>
</dl>

<a name="module_client"></a>

## client

* [client](#module_client)
    * [.BncClient](#module_client.BncClient)
        * [new exports.BncClient(server)](#new_module_client.BncClient_new)
        * [.transfer(fromAddress, toAddress, amount, asset, memo, sequence)](#module_client.BncClient+transfer)
        * [.placeOrder(address, symbol, side, price, quantity, sequence, timeinforce)](#module_client.BncClient+placeOrder)
        * [._sendTransaction(concrete, stdSignMsg, address, sequence, memo, sync)](#module_client.BncClient+_sendTransaction) ⇒ <code>Object</code>
        * [.getBalance(address)](#module_client.BncClient+getBalance)
        * [.getAccount(address)](#module_client.BncClient+getAccount)
        * [.createAccount()](#module_client.BncClient+createAccount) ⇒ <code>Object</code>
        * [.createAccountWithKeystore(password)](#module_client.BncClient+createAccountWithKeystore)
        * [.createAccountWithMneomnic()](#module_client.BncClient+createAccountWithMneomnic) ⇒ <code>Object</code>
        * [.recoverAccountFromKeystore(keystore, password)](#module_client.BncClient+recoverAccountFromKeystore)
        * [.recoverAccountFromMneomnic(mneomnic)](#module_client.BncClient+recoverAccountFromMneomnic)
        * [.recoverAccountFromPrivateKey(privateKey)](#module_client.BncClient+recoverAccountFromPrivateKey)
        * [.checkAddress(address)](#module_client.BncClient+checkAddress) ⇒ <code>Boolean</code>
    * [.DefaultSigningDelegate](#module_client.DefaultSigningDelegate) ⇒ [<code>Transaction</code>](#Transaction)
    * [.LedgerSigningDelegate](#module_client.LedgerSigningDelegate) ⇒ <code>function</code>

<a name="module_client.BncClient"></a>

### client.BncClient
The Binance Chain client.

**Kind**: static class of [<code>client</code>](#module_client)  

* [.BncClient](#module_client.BncClient)
    * [new exports.BncClient(server)](#new_module_client.BncClient_new)
    * [.transfer(fromAddress, toAddress, amount, asset, memo, sequence)](#module_client.BncClient+transfer)
    * [.placeOrder(address, symbol, side, price, quantity, sequence, timeinforce)](#module_client.BncClient+placeOrder)
    * [._sendTransaction(concrete, stdSignMsg, address, sequence, memo, sync)](#module_client.BncClient+_sendTransaction) ⇒ <code>Object</code>
    * [.getBalance(address)](#module_client.BncClient+getBalance)
    * [.getAccount(address)](#module_client.BncClient+getAccount)
    * [.createAccount()](#module_client.BncClient+createAccount) ⇒ <code>Object</code>
    * [.createAccountWithKeystore(password)](#module_client.BncClient+createAccountWithKeystore)
    * [.createAccountWithMneomnic()](#module_client.BncClient+createAccountWithMneomnic) ⇒ <code>Object</code>
    * [.recoverAccountFromKeystore(keystore, password)](#module_client.BncClient+recoverAccountFromKeystore)
    * [.recoverAccountFromMneomnic(mneomnic)](#module_client.BncClient+recoverAccountFromMneomnic)
    * [.recoverAccountFromPrivateKey(privateKey)](#module_client.BncClient+recoverAccountFromPrivateKey)
    * [.checkAddress(address)](#module_client.BncClient+checkAddress) ⇒ <code>Boolean</code>

<a name="new_module_client.BncClient_new"></a>

#### new exports.BncClient(server)

| Param | Type | Description |
| --- | --- | --- |
| server | <code>string</code> | Binance Chain public url |

<a name="module_client.BncClient+transfer"></a>

#### bncClient.transfer(fromAddress, toAddress, amount, asset, memo, sequence)
**Kind**: instance method of [<code>BncClient</code>](#module_client.BncClient)  

| Param | Type |
| --- | --- |
| fromAddress | <code>String</code> | 
| toAddress | <code>String</code> | 
| amount | <code>Number</code> | 
| asset | <code>String</code> | 
| memo | <code>String</code> | 
| sequence | <code>Number</code> | 

<a name="module_client.BncClient+placeOrder"></a>

#### bncClient.placeOrder(address, symbol, side, price, quantity, sequence, timeinforce)
placeOrder

**Kind**: instance method of [<code>BncClient</code>](#module_client.BncClient)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>String</code> |  |  |
| symbol | <code>String</code> |  |  |
| side | <code>String</code> |  |  |
| price | <code>Number</code> |  |  |
| quantity | <code>Number</code> |  |  |
| sequence | <code>Number</code> |  |  |
| timeinforce | <code>Number</code> | <code>1</code> | (1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel)) |

<a name="module_client.BncClient+_sendTransaction"></a>

#### bncClient.\_sendTransaction(concrete, stdSignMsg, address, sequence, memo, sync) ⇒ <code>Object</code>
send single transaction to binance chain

**Kind**: instance method of [<code>BncClient</code>](#module_client.BncClient)  
**Returns**: <code>Object</code> - response (success or fail)  

| Param | Type | Description |
| --- | --- | --- |
| concrete | <code>Object</code> | msg type |
| stdSignMsg | <code>Object</code> |  |
| address | <code>String</code> |  |
| sequence | <code>Number</code> |  |
| memo | <code>String</code> |  |
| sync | <code>Boolean</code> |  |

<a name="module_client.BncClient+getBalance"></a>

#### bncClient.getBalance(address)
get balance

**Kind**: instance method of [<code>BncClient</code>](#module_client.BncClient)  

| Param | Type |
| --- | --- |
| address | <code>String</code> | 

<a name="module_client.BncClient+getAccount"></a>

#### bncClient.getAccount(address)
get account

**Kind**: instance method of [<code>BncClient</code>](#module_client.BncClient)  

| Param | Type |
| --- | --- |
| address | <code>String</code> | 

<a name="module_client.BncClient+createAccount"></a>

#### bncClient.createAccount() ⇒ <code>Object</code>
**Kind**: instance method of [<code>BncClient</code>](#module_client.BncClient)  
**Returns**: <code>Object</code> - {
 address,
 privateKey
}  
<a name="module_client.BncClient+createAccountWithKeystore"></a>

#### bncClient.createAccountWithKeystore(password)
**Kind**: instance method of [<code>BncClient</code>](#module_client.BncClient)  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>String</code> | {  privateKey,  address,  keystore } |

<a name="module_client.BncClient+createAccountWithMneomnic"></a>

#### bncClient.createAccountWithMneomnic() ⇒ <code>Object</code>
**Kind**: instance method of [<code>BncClient</code>](#module_client.BncClient)  
**Returns**: <code>Object</code> - {
 privateKey,
 address,
 mnemonic
}  
<a name="module_client.BncClient+recoverAccountFromKeystore"></a>

#### bncClient.recoverAccountFromKeystore(keystore, password)
**Kind**: instance method of [<code>BncClient</code>](#module_client.BncClient)  

| Param | Type | Description |
| --- | --- | --- |
| keystore | <code>String</code> |  |
| password | <code>String</code> | { privateKey, address } |

<a name="module_client.BncClient+recoverAccountFromMneomnic"></a>

#### bncClient.recoverAccountFromMneomnic(mneomnic)
**Kind**: instance method of [<code>BncClient</code>](#module_client.BncClient)  

| Param | Type | Description |
| --- | --- | --- |
| mneomnic | <code>String</code> | { privateKey, address } |

<a name="module_client.BncClient+recoverAccountFromPrivateKey"></a>

#### bncClient.recoverAccountFromPrivateKey(privateKey)
**Kind**: instance method of [<code>BncClient</code>](#module_client.BncClient)  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>String</code> | { privateKey, address } |

<a name="module_client.BncClient+checkAddress"></a>

#### bncClient.checkAddress(address) ⇒ <code>Boolean</code>
**Kind**: instance method of [<code>BncClient</code>](#module_client.BncClient)  

| Param | Type |
| --- | --- |
| address | <code>String</code> | 

<a name="module_client.DefaultSigningDelegate"></a>

### client.DefaultSigningDelegate ⇒ [<code>Transaction</code>](#Transaction)
The default signing delegate which uses the local private key.

**Kind**: static constant of [<code>client</code>](#module_client)  

| Param | Type | Description |
| --- | --- | --- |
| tx | [<code>Transaction</code>](#Transaction) | the transaction |
| signMsg | <code>Object</code> | the canonical sign bytes for the msg |

<a name="module_client.LedgerSigningDelegate"></a>

### client.LedgerSigningDelegate ⇒ <code>function</code>
The Ledger signing delegate.

**Kind**: static constant of [<code>client</code>](#module_client)  

| Param | Type |
| --- | --- |
| ledgerApp | <code>LedgerApp</code> | 
| function | <code>preSignCb</code> | 
| function | <code>postSignCb</code> | 
| function | <code>errCb</code> | 

<a name="module_crypto"></a>

## crypto

* [crypto](#module_crypto)
    * [.decodeAddress](#module_crypto.decodeAddress)
    * [.checkAddress](#module_crypto.checkAddress)
    * [.encodeAddress](#module_crypto.encodeAddress)
    * [.generatePrivateKey](#module_crypto.generatePrivateKey) ⇒ <code>string</code>
    * [.generateRandomArray](#module_crypto.generateRandomArray) ⇒ <code>ArrayBuffer</code>
    * [.getPublicKey](#module_crypto.getPublicKey) ⇒ <code>Elliptic.PublicKey</code>
    * [.getPublicKeyFromPrivateKey](#module_crypto.getPublicKeyFromPrivateKey) ⇒ <code>string</code>
    * [.generatePubKey](#module_crypto.generatePubKey) ⇒ <code>Elliptic.PublicKey</code>
    * [.getAddressFromPublicKey](#module_crypto.getAddressFromPublicKey)
    * [.getAddressFromPrivateKey](#module_crypto.getAddressFromPrivateKey)
    * [.generateSignature](#module_crypto.generateSignature) ⇒ <code>Buffer</code>
    * [.verifySignature](#module_crypto.verifySignature) ⇒ <code>Buffer</code>
    * [.generateKeyStore](#module_crypto.generateKeyStore)
    * [.getPrivateKeyFromKeyStore](#module_crypto.getPrivateKeyFromKeyStore)
    * [.getMnemonicFromPrivateKey](#module_crypto.getMnemonicFromPrivateKey)
    * [.generateMnemonic](#module_crypto.generateMnemonic)
    * [.getPrivateKeyFromMnemonic](#module_crypto.getPrivateKeyFromMnemonic)

<a name="module_crypto.decodeAddress"></a>

### crypto.decodeAddress
Decodes an address in bech32 format.

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | the bech32 address to decode |

<a name="module_crypto.checkAddress"></a>

### crypto.checkAddress
checek address whether is valid

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | the bech32 address to decode |

<a name="module_crypto.encodeAddress"></a>

### crypto.encodeAddress
Encodes an address from input data bytes.

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | the public key to encode |
| prefix | <code>\*</code> | the address prefix |
| type | <code>\*</code> | the output type (default: hex) |

<a name="module_crypto.generatePrivateKey"></a>

### crypto.generatePrivateKey ⇒ <code>string</code>
Generates a random private key

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  
<a name="module_crypto.generateRandomArray"></a>

### crypto.generateRandomArray ⇒ <code>ArrayBuffer</code>
Generates an arrayBuffer filled with random bits.

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| length | <code>number</code> | Length of buffer. |

<a name="module_crypto.getPublicKey"></a>

### crypto.getPublicKey ⇒ <code>Elliptic.PublicKey</code>
**Kind**: static constant of [<code>crypto</code>](#module_crypto)  
**Returns**: <code>Elliptic.PublicKey</code> - public key  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | Encoded public key |

<a name="module_crypto.getPublicKeyFromPrivateKey"></a>

### crypto.getPublicKeyFromPrivateKey ⇒ <code>string</code>
Calculates the public key from a given private key.

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| privateKeyHex | <code>string</code> | the private key hexstring |

<a name="module_crypto.generatePubKey"></a>

### crypto.generatePubKey ⇒ <code>Elliptic.PublicKey</code>
PubKey performs the point-scalar multiplication from the privKey on the
generator point to get the pubkey.

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  
**Returns**: <code>Elliptic.PublicKey</code> - PubKey  

| Param | Type |
| --- | --- |
| privateKey | <code>Buffer</code> | 

<a name="module_crypto.getAddressFromPublicKey"></a>

### crypto.getAddressFromPublicKey
Gets an address from a public key hex.

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| publicKeyHex | <code>string</code> | the public key hexstring |

<a name="module_crypto.getAddressFromPrivateKey"></a>

### crypto.getAddressFromPrivateKey
Gets an address from a private key.

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| privateKeyHex | <code>string</code> | the private key hexstring |

<a name="module_crypto.generateSignature"></a>

### crypto.generateSignature ⇒ <code>Buffer</code>
Generates a signature (64 byte <r,s>) for a transaction based on given private key.

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  
**Returns**: <code>Buffer</code> - Signature. Does not include tx.  

| Param | Type | Description |
| --- | --- | --- |
| signBytesHex | <code>string</code> | Unsigned transaction sign bytes hexstring. |
| privateKey | <code>string</code> \| <code>Buffer</code> | The private key. |

<a name="module_crypto.verifySignature"></a>

### crypto.verifySignature ⇒ <code>Buffer</code>
Verifies a signature (64 byte <r,s>) given the sign bytes and public key.

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  
**Returns**: <code>Buffer</code> - Signature. Does not include tx.  

| Param | Type | Description |
| --- | --- | --- |
| sigHex | <code>string</code> | The signature hexstring. |
| signBytesHex | <code>string</code> | Unsigned transaction sign bytes hexstring. |
| publicKeyHex | <code>string</code> | The public key. |

<a name="module_crypto.generateKeyStore"></a>

### crypto.generateKeyStore
Generates a keystore file based on given private key and password.

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | Private Key. |
| password | <code>string</code> | Password. |

<a name="module_crypto.getPrivateKeyFromKeyStore"></a>

### crypto.getPrivateKeyFromKeyStore
Generates privatekey based on keystore and password

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| keystore | <code>string</code> | keystore file json format. |
| password | <code>string</code> | Password. |

<a name="module_crypto.getMnemonicFromPrivateKey"></a>

### crypto.getMnemonicFromPrivateKey
Gets Mnemonic from a private key.

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | the private key hexstring |

<a name="module_crypto.generateMnemonic"></a>

### crypto.generateMnemonic
Generate Mnemonic (length=== 15)

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  
<a name="module_crypto.getPrivateKeyFromMnemonic"></a>

### crypto.getPrivateKeyFromMnemonic
Get privatekey from mnemonic.

**Kind**: static constant of [<code>crypto</code>](#module_crypto)  

| Type |
| --- |
| <code>mnemonic</code> | 

<a name="module_amino"></a>

## amino

* [amino](#module_amino)
    * [.encodeNumber](#module_amino.encodeNumber)
    * [.encodeBool](#module_amino.encodeBool)
    * [.encodeString](#module_amino.encodeString)
    * [.encodeTime](#module_amino.encodeTime)
    * [.convertObjectToSignBytes](#module_amino.convertObjectToSignBytes) ⇒ <code>Buffer</code>
    * [.marshalBinary](#module_amino.marshalBinary)
    * [.marshalBinaryBare](#module_amino.marshalBinaryBare)
    * [.encodeBinary](#module_amino.encodeBinary) ⇒ <code>Buffer</code>
    * [.encodeBinaryByteArray](#module_amino.encodeBinaryByteArray) ⇒ <code>Buffer</code>
    * [.encodeObjectBinary](#module_amino.encodeObjectBinary) ⇒ <code>Buffer</code>
    * [.encodeArrayBinary](#module_amino.encodeArrayBinary) ⇒ <code>Buffer</code>

<a name="module_amino.encodeNumber"></a>

### amino.encodeNumber
encode number

**Kind**: static constant of [<code>amino</code>](#module_amino)  

| Param |
| --- |
| num | 

<a name="module_amino.encodeBool"></a>

### amino.encodeBool
encode bool

**Kind**: static constant of [<code>amino</code>](#module_amino)  

| Param |
| --- |
| b | 

<a name="module_amino.encodeString"></a>

### amino.encodeString
encode string

**Kind**: static constant of [<code>amino</code>](#module_amino)  

| Param |
| --- |
| str | 

<a name="module_amino.encodeTime"></a>

### amino.encodeTime
encode time

**Kind**: static constant of [<code>amino</code>](#module_amino)  

| Param |
| --- |
| value | 

<a name="module_amino.convertObjectToSignBytes"></a>

### amino.convertObjectToSignBytes ⇒ <code>Buffer</code>
**Kind**: static constant of [<code>amino</code>](#module_amino)  
**Returns**: <code>Buffer</code> - bytes  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | - |

<a name="module_amino.marshalBinary"></a>

### amino.marshalBinary
js amino MarshalBinary

**Kind**: static constant of [<code>amino</code>](#module_amino)  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="module_amino.marshalBinaryBare"></a>

### amino.marshalBinaryBare
js amino MarshalBinaryBare

**Kind**: static constant of [<code>amino</code>](#module_amino)  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="module_amino.encodeBinary"></a>

### amino.encodeBinary ⇒ <code>Buffer</code>
This is the main entrypoint for encoding all types in binary form.

**Kind**: static constant of [<code>amino</code>](#module_amino)  
**Returns**: <code>Buffer</code> - binary of object.  

| Param | Type | Description |
| --- | --- | --- |
| js | <code>\*</code> | data type (not null, not undefined) |
| field | <code>number</code> | index of object |
| isByteLenPrefix | <code>bool</code> |  |

<a name="module_amino.encodeBinaryByteArray"></a>

### amino.encodeBinaryByteArray ⇒ <code>Buffer</code>
prefixed with bytes length

**Kind**: static constant of [<code>amino</code>](#module_amino)  
**Returns**: <code>Buffer</code> - with bytes length prefixed  

| Param | Type |
| --- | --- |
| bytes | <code>Buffer</code> | 

<a name="module_amino.encodeObjectBinary"></a>

### amino.encodeObjectBinary ⇒ <code>Buffer</code>
**Kind**: static constant of [<code>amino</code>](#module_amino)  
**Returns**: <code>Buffer</code> - with bytes length prefixed  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="module_amino.encodeArrayBinary"></a>

### amino.encodeArrayBinary ⇒ <code>Buffer</code>
**Kind**: static constant of [<code>amino</code>](#module_amino)  
**Returns**: <code>Buffer</code> - bytes of array  

| Param | Type | Description |
| --- | --- | --- |
| fieldNum | <code>number</code> | object field index |
| arr | <code>Array</code> |  |
| isByteLenPrefix | <code>bool</code> |  |

<a name="module_ledger"></a>

## ledger

* [ledger](#module_ledger)
    * [.LedgerApp](#module_ledger.LedgerApp)
        * [new LedgerApp(transport, interactiveTimeout, nonInteractiveTimeout)](#new_module_ledger.LedgerApp_new)
        * [.getVersion()](#module_ledger.LedgerApp+getVersion)
        * [.publicKeySecp256k1(hdPath)](#module_ledger.LedgerApp+publicKeySecp256k1)
        * [.signSecp256k1(signBytes, hdPath)](#module_ledger.LedgerApp+signSecp256k1)
        * [.getPublicKey(hdPath)](#module_ledger.LedgerApp+getPublicKey)
        * [.sign(signBytes, hdPath)](#module_ledger.LedgerApp+sign)

<a name="module_ledger.LedgerApp"></a>

### ledger.LedgerApp
Ledger app interface.

**Kind**: static class of [<code>ledger</code>](#module_ledger)  

* [.LedgerApp](#module_ledger.LedgerApp)
    * [new LedgerApp(transport, interactiveTimeout, nonInteractiveTimeout)](#new_module_ledger.LedgerApp_new)
    * [.getVersion()](#module_ledger.LedgerApp+getVersion)
    * [.publicKeySecp256k1(hdPath)](#module_ledger.LedgerApp+publicKeySecp256k1)
    * [.signSecp256k1(signBytes, hdPath)](#module_ledger.LedgerApp+signSecp256k1)
    * [.getPublicKey(hdPath)](#module_ledger.LedgerApp+getPublicKey)
    * [.sign(signBytes, hdPath)](#module_ledger.LedgerApp+sign)

<a name="new_module_ledger.LedgerApp_new"></a>

#### new LedgerApp(transport, interactiveTimeout, nonInteractiveTimeout)
Constructs a new LedgerApp.


| Param | Type | Description |
| --- | --- | --- |
| transport | <code>Transport</code> | Ledger Transport, a subclass of ledgerjs Transport. |
| interactiveTimeout | <code>number</code> | The interactive (user input) timeout in ms. Default 45s. |
| nonInteractiveTimeout | <code>number</code> | The non-interactive timeout in ms. Default 3s. |

<a name="module_ledger.LedgerApp+getVersion"></a>

#### ledgerApp.getVersion()
Gets the version of the Ledger app that is currently open on the device.

**Kind**: instance method of [<code>LedgerApp</code>](#module_ledger.LedgerApp)  
**Throws**:

- Will throw Error if a transport error occurs, or if the firmware app is not open.

<a name="module_ledger.LedgerApp+publicKeySecp256k1"></a>

#### ledgerApp.publicKeySecp256k1(hdPath)
Gets the public key from the Ledger app that is currently open on the device.

**Kind**: instance method of [<code>LedgerApp</code>](#module_ledger.LedgerApp)  
**Throws**:

- Will throw Error if a transport error occurs, or if the firmware app is not open.


| Param | Type | Description |
| --- | --- | --- |
| hdPath | <code>array</code> | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

<a name="module_ledger.LedgerApp+signSecp256k1"></a>

#### ledgerApp.signSecp256k1(signBytes, hdPath)
Sends a transaction sign doc to the Ledger app to be signed.

**Kind**: instance method of [<code>LedgerApp</code>](#module_ledger.LedgerApp)  
**Throws**:

- Will throw Error if a transport error occurs, or if the firmware app is not open.


| Param | Type | Description |
| --- | --- | --- |
| signBytes | <code>Buffer</code> | The TX sign doc bytes to sign |
| hdPath | <code>array</code> | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

<a name="module_ledger.LedgerApp+getPublicKey"></a>

#### ledgerApp.getPublicKey(hdPath)
Gets the public key from the Ledger app that is currently open on the device.

**Kind**: instance method of [<code>LedgerApp</code>](#module_ledger.LedgerApp)  
**Throws**:

- Will throw Error if a transport error occurs, or if the firmware app is not open.


| Param | Type | Description |
| --- | --- | --- |
| hdPath | <code>array</code> | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

<a name="module_ledger.LedgerApp+sign"></a>

#### ledgerApp.sign(signBytes, hdPath)
Sends a transaction sign doc to the Ledger app to be signed.

**Kind**: instance method of [<code>LedgerApp</code>](#module_ledger.LedgerApp)  
**Throws**:

- Will throw Error if a transport error occurs, or if the firmware app is not open.


| Param | Type | Description |
| --- | --- | --- |
| signBytes | <code>Buffer</code> | The TX sign doc bytes to sign |
| hdPath | <code>array</code> | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

<a name="module_utils"></a>

## utils

* [utils](#module_utils)
    * [.ab2str](#module_utils.ab2str) ⇒ <code>string</code>
    * [.str2ab](#module_utils.str2ab) ⇒ <code>arrayBuffer</code>
    * [.hexstring2ab](#module_utils.hexstring2ab) ⇒ <code>Array.&lt;number&gt;</code>
    * [.ab2hexstring](#module_utils.ab2hexstring) ⇒ <code>string</code>
    * [.str2hexstring](#module_utils.str2hexstring) ⇒ <code>string</code>
    * [.hexstring2str](#module_utils.hexstring2str) ⇒ <code>string</code>
    * [.int2hex](#module_utils.int2hex) ⇒ <code>string</code>
    * [.num2hexstring](#module_utils.num2hexstring) ⇒ <code>string</code>
    * [.num2VarInt](#module_utils.num2VarInt) ⇒ <code>string</code>
    * [.hexXor](#module_utils.hexXor) ⇒ <code>string</code>
    * [.reverseArray](#module_utils.reverseArray) ⇒ <code>Uint8Array</code>
    * [.reverseHex](#module_utils.reverseHex) ⇒ <code>string</code>
    * [.isHex](#module_utils.isHex) ⇒ <code>boolean</code>
    * [.ensureHex](#module_utils.ensureHex)
    * [.sha256ripemd160](#module_utils.sha256ripemd160) ⇒ <code>string</code>
    * [.sha256](#module_utils.sha256) ⇒ <code>string</code>

<a name="module_utils.ab2str"></a>

### utils.ab2str ⇒ <code>string</code>
**Kind**: static constant of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - ASCII string  

| Param | Type |
| --- | --- |
| buf | <code>arrayBuffer</code> | 

<a name="module_utils.str2ab"></a>

### utils.str2ab ⇒ <code>arrayBuffer</code>
**Kind**: static constant of [<code>utils</code>](#module_utils)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | ASCII string |

<a name="module_utils.hexstring2ab"></a>

### utils.hexstring2ab ⇒ <code>Array.&lt;number&gt;</code>
**Kind**: static constant of [<code>utils</code>](#module_utils)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | HEX string |

<a name="module_utils.ab2hexstring"></a>

### utils.ab2hexstring ⇒ <code>string</code>
**Kind**: static constant of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - HEX string  

| Param | Type |
| --- | --- |
| arr | <code>arrayBuffer</code> | 

<a name="module_utils.str2hexstring"></a>

### utils.str2hexstring ⇒ <code>string</code>
**Kind**: static constant of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - HEX string  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | ASCII string |

<a name="module_utils.hexstring2str"></a>

### utils.hexstring2str ⇒ <code>string</code>
**Kind**: static constant of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - ASCII string  

| Param | Type | Description |
| --- | --- | --- |
| hexstring | <code>string</code> | HEX string |

<a name="module_utils.int2hex"></a>

### utils.int2hex ⇒ <code>string</code>
convert an integer to big endian hex and add leading zeros

**Kind**: static constant of [<code>utils</code>](#module_utils)  

| Param | Type |
| --- | --- |
| num | <code>number</code> | 

<a name="module_utils.num2hexstring"></a>

### utils.num2hexstring ⇒ <code>string</code>
Converts a number to a big endian hexstring of a suitable size, optionally little endian

**Kind**: static constant of [<code>utils</code>](#module_utils)  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> |  |
| size | <code>number</code> | The required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1. |
| littleEndian | <code>boolean</code> | Encode the hex in little endian form |

<a name="module_utils.num2VarInt"></a>

### utils.num2VarInt ⇒ <code>string</code>
Converts a number to a variable length Int. Used for array length header

**Kind**: static constant of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - hexstring of the variable Int.  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | The number |

<a name="module_utils.hexXor"></a>

### utils.hexXor ⇒ <code>string</code>
XORs two hexstrings

**Kind**: static constant of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - XOR output as a HEX string  

| Param | Type | Description |
| --- | --- | --- |
| str1 | <code>string</code> | HEX string |
| str2 | <code>string</code> | HEX string |

<a name="module_utils.reverseArray"></a>

### utils.reverseArray ⇒ <code>Uint8Array</code>
Reverses an array. Accepts arrayBuffer.

**Kind**: static constant of [<code>utils</code>](#module_utils)  

| Param | Type |
| --- | --- |
| arr | <code>Array</code> | 

<a name="module_utils.reverseHex"></a>

### utils.reverseHex ⇒ <code>string</code>
Reverses a HEX string, treating 2 chars as a byte.

**Kind**: static constant of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - HEX string reversed in 2s.  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | HEX string |

**Example**  
```js
reverseHex('abcdef') = 'efcdab'
```
<a name="module_utils.isHex"></a>

### utils.isHex ⇒ <code>boolean</code>
Checks if input is a hexstring. Empty string is considered a hexstring.

**Kind**: static constant of [<code>utils</code>](#module_utils)  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

**Example**  
```js
isHex('0101') = true
isHex('') = true
isHex('0x01') = false
```
<a name="module_utils.ensureHex"></a>

### utils.ensureHex
Throws an error if input is not hexstring.

**Kind**: static constant of [<code>utils</code>](#module_utils)  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="module_utils.sha256ripemd160"></a>

### utils.sha256ripemd160 ⇒ <code>string</code>
Performs a SHA256 followed by a RIPEMD160.

**Kind**: static constant of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - hash output  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | String to hash |

<a name="module_utils.sha256"></a>

### utils.sha256 ⇒ <code>string</code>
Performs a single SHA256.

**Kind**: static constant of [<code>utils</code>](#module_utils)  
**Returns**: <code>string</code> - hash output  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | String to hash |

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

