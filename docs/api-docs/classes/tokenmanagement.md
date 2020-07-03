
# Class: TokenManagement

issue or view tokens

## Hierarchy

* **TokenManagement**

## Index

### Constructors

* [constructor](tokenmanagement.md#constructor)

### Methods

* [burn](tokenmanagement.md#burn)
* [freeze](tokenmanagement.md#freeze)
* [issue](tokenmanagement.md#issue)
* [issueMiniToken](tokenmanagement.md#issueminitoken)
* [issueTinyToken](tokenmanagement.md#issuetinytoken)
* [mint](tokenmanagement.md#mint)
* [setTokenUri](tokenmanagement.md#settokenuri)
* [timeLock](tokenmanagement.md#timelock)
* [timeRelock](tokenmanagement.md#timerelock)
* [timeUnlock](tokenmanagement.md#timeunlock)
* [unfreeze](tokenmanagement.md#unfreeze)

## Constructors

###  constructor

\+ **new TokenManagement**(`bncClient`: [BncClient](bncclient.md)): *[TokenManagement](tokenmanagement.md)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bncClient` | [BncClient](bncclient.md) |   |

**Returns:** *[TokenManagement](tokenmanagement.md)*

## Methods

###  burn

▸ **burn**(`fromAddress`: string, `symbol`: string, `amount`: BigSource): *Promise‹object›*

burn some amount of token

**Parameters:**

Name | Type |
------ | ------ |
`fromAddress` | string |
`symbol` | string |
`amount` | BigSource |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  freeze

▸ **freeze**(`fromAddress`: string, `symbol`: string, `amount`: BigSource): *Promise‹object›*

freeze some amount of token

**Parameters:**

Name | Type |
------ | ------ |
`fromAddress` | string |
`symbol` | string |
`amount` | BigSource |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  issue

▸ **issue**(`senderAddress`: string, `tokenName`: string, `symbol`: string, `totalSupply`: number, `mintable`: boolean): *Promise‹object›*

create a new asset on Binance Chain

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`senderAddress` | string | - |
`tokenName` | string | - |
`symbol` | string | - |
`totalSupply` | number | 0 |
`mintable` | boolean | false |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  issueMiniToken

▸ **issueMiniToken**(`senderAddress`: string, `tokenName`: string, `symbol`: string, `totalSupply`: number, `mintable`: boolean, `tokenUri?`: undefined | string): *Promise‹object›*

issue a new mini-token, total supply should be less than 1M

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`senderAddress` | string | - |
`tokenName` | string | - |
`symbol` | string | - |
`totalSupply` | number | 0 |
`mintable` | boolean | false |
`tokenUri?` | undefined &#124; string | - |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  issueTinyToken

▸ **issueTinyToken**(`senderAddress`: string, `tokenName`: string, `symbol`: string, `totalSupply`: number, `mintable`: boolean, `tokenUri?`: undefined | string): *Promise‹object›*

issue a new tiny-token, total supply should be less than 10K

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`senderAddress` | string | - |
`tokenName` | string | - |
`symbol` | string | - |
`totalSupply` | number | 0 |
`mintable` | boolean | false |
`tokenUri?` | undefined &#124; string | - |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  mint

▸ **mint**(`fromAddress`: string, `symbol`: string, `amount`: BigSource): *Promise‹object›*

mint tokens for an existing token

**Parameters:**

Name | Type |
------ | ------ |
`fromAddress` | string |
`symbol` | string |
`amount` | BigSource |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  setTokenUri

▸ **setTokenUri**(`__namedParameters`: object): *Promise‹object›*

set token URI of mini-token

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`fromAddress` | string |
`symbol` | string |
`tokenUri` | string |

**Returns:** *Promise‹object›*

___

###  timeLock

▸ **timeLock**(`fromAddress`: string, `description`: string, `amount`: Coin[], `lockTime`: number): *Promise‹object›*

lock token for a while

**Parameters:**

Name | Type |
------ | ------ |
`fromAddress` | string |
`description` | string |
`amount` | Coin[] |
`lockTime` | number |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  timeRelock

▸ **timeRelock**(`fromAddress`: string, `id`: number, `description`: string, `amount`: Coin[], `lockTime`: number): *Promise‹object›*

lock more token or increase locked period

**Parameters:**

Name | Type |
------ | ------ |
`fromAddress` | string |
`id` | number |
`description` | string |
`amount` | Coin[] |
`lockTime` | number |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  timeUnlock

▸ **timeUnlock**(`fromAddress`: string, `id`: number): *Promise‹object›*

unlock locked tokens

**Parameters:**

Name | Type |
------ | ------ |
`fromAddress` | string |
`id` | number |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  unfreeze

▸ **unfreeze**(`fromAddress`: string, `symbol`: string, `amount`: BigSource): *Promise‹object›*

unfreeze some amount of token

**Parameters:**

Name | Type |
------ | ------ |
`fromAddress` | string |
`symbol` | string |
`amount` | BigSource |

**Returns:** *Promise‹object›*

resolves with response (success or fail)
