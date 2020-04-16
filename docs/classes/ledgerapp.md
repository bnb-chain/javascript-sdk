[@binance-chain/javascript-sdk](../README.md) › [LedgerApp](ledgerapp.md)

# Class: LedgerApp

Ledger app interface.

**`static`** 

## Hierarchy

* **LedgerApp**

## Index

### Constructors

* [constructor](ledgerapp.md#constructor)

### Methods

* [getPublicKey](ledgerapp.md#getpublickey)
* [getVersion](ledgerapp.md#getversion)
* [publicKeySecp256k1](ledgerapp.md#publickeysecp256k1)
* [showAddress](ledgerapp.md#showaddress)
* [sign](ledgerapp.md#sign)
* [signSecp256k1](ledgerapp.md#signsecp256k1)

## Constructors

###  constructor

\+ **new LedgerApp**(`transport`: Transport, `interactiveTimeout`: number, `nonInteractiveTimeout`: number): *[LedgerApp](ledgerapp.md)*

*Defined in [ledger/ledger-app.ts:93](https://github.com/binance-chain/javascript-sdk/blob/6d6dd38/src/ledger/ledger-app.ts#L93)*

Constructs a new LedgerApp.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`transport` | Transport | - | Ledger Transport, a subclass of ledgerjs Transport. |
`interactiveTimeout` | number | DEFAULT_LEDGER_INTERACTIVE_TIMEOUT | The interactive (user input) timeout in ms. Default 45s. |
`nonInteractiveTimeout` | number | DEFAULT_LEDGER_NONINTERACTIVE_TIMEOUT | The non-interactive timeout in ms. Default 3s.  |

**Returns:** *[LedgerApp](ledgerapp.md)*

## Methods

###  getPublicKey

▸ **getPublicKey**(`hdPath`: number[]): *Promise‹PublicKey›*

*Defined in [ledger/ledger-app.ts:619](https://github.com/binance-chain/javascript-sdk/blob/6d6dd38/src/ledger/ledger-app.ts#L619)*

Gets the public key from the Ledger app that is currently open on the device.

**`throws`** Will throw Error if a transport error occurs, or if the firmware app is not open.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hdPath` | number[] | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

**Returns:** *Promise‹PublicKey›*

___

###  getVersion

▸ **getVersion**(): *Promise‹Version›*

*Defined in [ledger/ledger-app.ts:249](https://github.com/binance-chain/javascript-sdk/blob/6d6dd38/src/ledger/ledger-app.ts#L249)*

Gets the version of the Ledger app that is currently open on the device.

**`throws`** Will throw Error if a transport error occurs, or if the firmware app is not open.

**Returns:** *Promise‹Version›*

___

###  publicKeySecp256k1

▸ **publicKeySecp256k1**(`hdPath`: number[]): *Promise‹PublicKey›*

*Defined in [ledger/ledger-app.ts:316](https://github.com/binance-chain/javascript-sdk/blob/6d6dd38/src/ledger/ledger-app.ts#L316)*

Gets the public key from the Ledger app that is currently open on the device.

**`throws`** Will throw Error if a transport error occurs, or if the firmware app is not open.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`hdPath` | number[] | [44, 714, 0, 0, 0] | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

**Returns:** *Promise‹PublicKey›*

___

###  showAddress

▸ **showAddress**(`hrp`: string, `hdPath`: number[]): *Promise‹ReturnResponse›*

*Defined in [ledger/ledger-app.ts:581](https://github.com/binance-chain/javascript-sdk/blob/6d6dd38/src/ledger/ledger-app.ts#L581)*

Shows the user's address for the given HD path on the device display.

**`throws`** Will throw Error if a transport error occurs, or if the firmware app is not open.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`hrp` | string | "bnb" | The bech32 human-readable prefix |
`hdPath` | number[] | [44, 714, 0, 0, 0] | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

**Returns:** *Promise‹ReturnResponse›*

___

###  sign

▸ **sign**(`signBytes`: Buffer, `hdPath`: number[]): *Promise‹SignedSignature›*

*Defined in [ledger/ledger-app.ts:629](https://github.com/binance-chain/javascript-sdk/blob/6d6dd38/src/ledger/ledger-app.ts#L629)*

Sends a transaction sign doc to the Ledger app to be signed.

**`throws`** Will throw Error if a transport error occurs, or if the firmware app is not open.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`signBytes` | Buffer | The TX sign doc bytes to sign |
`hdPath` | number[] | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

**Returns:** *Promise‹SignedSignature›*

___

###  signSecp256k1

▸ **signSecp256k1**(`signBytes`: Buffer, `hdPath`: number[]): *Promise‹SignedSignature›*

*Defined in [ledger/ledger-app.ts:446](https://github.com/binance-chain/javascript-sdk/blob/6d6dd38/src/ledger/ledger-app.ts#L446)*

Sends a transaction sign doc to the Ledger app to be signed.

**`throws`** Will throw Error if a transport error occurs, or if the firmware app is not open.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`signBytes` | Buffer | - | The TX sign doc bytes to sign |
`hdPath` | number[] | [44, 714, 0, 0, 0] | The HD path to use to get the public key. Default is [44, 714, 0, 0, 0] |

**Returns:** *Promise‹SignedSignature›*
