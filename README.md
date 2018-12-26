# bnc-web-lib
Binance Chain JavaScript API

# Usage
> yarn add @binance/bnc-web-lib -S --registry https://npm-registry.fdgahl.cn

# API

## crypto

generate privatekey, address, keystore, mneonic

```js
const privateKey = crypto.generatePrivateKey();

const address = crypto.getAddressFromPrivateKey(privateKey);

const keyStore = crypto.generateKeyStore(privateKey, password);

const mneonic = crypto.getMnemonicFromPrivateKey(privateKey);
                crypto.generateMnemonic();//24
```

recover privatekey, address from keystore, mneonic

```js
const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);

const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);

const address = crypto.getAddressFromPrivateKey(privateKey);
```

## amino (js-amino)

[Read go-amino](https://github.com/tendermint/go-amino)

serialize object to hex string which compatible with go-amino

```js
amino.marshalBinary(data)

amino.marshalBinaryBare(data);
```

## BncClient
- every tx has a specified type and encode prefix

- supported type and prefix:

  |type|name|prefix|
  |:---|:---|:---
  |MsgSend|transfer|2A2C87FA|
  |NewOrderMsg|placeOrder|CE6DC043|
  |CancelOrderMsg|cancelOrder|166E681B|

  

## API 

### initial client
```js
  const client = new BncClient('https://xxx.api.com/');
  client.initChain();
```

### createAccount 

```js
  client.createAccount()
```

### Parameters
 
> None

### Returns
- Object - The account object with the following structure:

   - address - **String**: The account address.

   - privateKey - **String**: The accounts private key. This should never be shared or stored unencrypted in localstorage! Also make sure to null the memory after usage.

### createAccountWithKeystore 

```js
  client.createAccountWithKeystore([password])
```

### Parameters
 
- password - **String**(Required)

### Returns
- Object - The account object with the following structure:

   - address - **String**: The account address.

   - privateKey - **String**: The accounts private key. This should never be shared or stored unencrypted in localstorage!    Also make sure to null the memory after usage.

   - keystore - **Object**: The encrypted keystore JSON

### createAccountWithMneomnic 

```js
  client.createAccountWithMneomnic()
```

### Parameters
 
> None

### Returns
- Object - The account object with the following structure:

   - address - **String**: The account address.

   - privateKey - **String**: The accounts private key. This should never be shared or stored unencrypted in localstorage!    Also make sure to null the memory after usage.

   - mneomnic - **String**:  mnemonic sentence -- a group of easy to remember words. 

### recoverAccountFromKeystore 

```js
  client.recoverAccountFromKeystore(keystore, password)
```

### Parameters
 
- keystore - **Object**: Keystore JSON object.
- password - **String**: The password used for encryption

### Returns
- Object - The account object with the following structure:

   - address - **String**: The account address.

   - privateKey - **String**: The accounts private key. This should never be shared or stored unencrypted in localstorage!    Also make sure to null the memory after usage.

### recoverAccountFromMneomnic 

```js
  client.recoverAccountFromMneomnic(mnemonic)
```

### Parameters
 
- mnemonic - **String**: mnemonic sentence.

### Returns
- Object - The account object with the following structure:

   - address - **String**: The account address.

   - privateKey - **String**: The accounts private key. This should never be shared or stored unencrypted in localstorage!    Also make sure to null the memory after usage.

### recoverAccountFromPrivateKey 

```js
  client.recoverAccountFromPrivateKey(privateKey)
```

### Parameters
 
- privateKey - **String**: The accounts private key

### Returns
- Object - The account object with the following structure:

   - address - **String**: The account address.

   - privateKey - **String**: The accounts private key. This should never be shared or stored unencrypted in localstorage!    Also make sure to null the memory after usage.

## Test Cases

go to [test folder](./__tests__)
  


