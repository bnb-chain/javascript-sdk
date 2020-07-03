# API Examples

## client

### Example of a wallet-to-wallet transfer

```js
const { BncClient } = require("@binance-chain/javascript-sdk")
const axios = require("axios")

const asset = "BNB" // asset string
const amount = 1.123 // amount float
const addressTo = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd" // addressTo string
const message = "A note to you" // memo string
const api = "https://testnet-dex.binance.org/" /// api string

let privKey = "DEADBEEF" // privkey hexstring (keep this safe)

const bnbClient = new BncClient(api)
const httpClient = axios.create({ baseURL: api })

bnbClient.chooseNetwork("testnet") // or this can be "mainnet"
bnbClient.setPrivateKey(privKey)
bnbClient.initChain()

const addressFrom = bnbClient.getClientKeyAddress() // sender address string (e.g. bnb1...)
const sequenceURL = `${api}api/v1/account/${addressFrom}/sequence`

httpClient
  .get(sequenceURL)
  .then((res) => {
    const sequence = res.data.sequence || 0
    return bnbClient.transfer(
      addressFrom,
      addressTo,
      amount,
      asset,
      message,
      sequence
    )
  })
  .then((result) => {
    console.log(result)
    if (result.status === 200) {
      console.log("success", result.result[0].hash)
    } else {
      console.error("error", result)
    }
  })
  .catch((error) => {
    console.error("error", error)
  })
```

### Example of token issuance

```js
const { BncClient, crypto, utils } = require("@binance-chain/javascript-sdk")

// Token params
const tokenName = "Your Token Name"
const tokenSymb = "SYMBOL"
const tokenSupp = 1000000 // one million tokens
const tokenMint = false // mintable token?

// Account params
const tokenAddr = "** PUT THE ISSUER ADDRESS HERE **"
const mnemonic = "** PUT THE ISSUER MNEMONIC HERE **"
const privKey = crypto.getPrivateKeyFromMnemonic(mnemonic)

const api = "https://testnet-dex.binance.org/" // api string; remove "testnet-" for mainnet
const net = "testnet" // or this can be "mainnet"

const bnbClient = new BncClient(api)
bnbClient.chooseNetwork(net)

async function main() {
  await bnbClient.setPrivateKey(privKey)
  await bnbClient.initChain()
  await bnbClient.tokens.issue(
    tokenAddr,
    tokenName,
    tokenSymb,
    tokenSupp,
    tokenMint
  )
}
main()
```

### RPC example (getAccount)

```js
const { rpc } = require("@binance-chain/javascript-sdk")
new rpc("https://dataseed1.binance.org:443")
  .getAccount("bnb1qfmufc2q30cgw82ykjlpfeyauhcf5mad6p5y8t")
  .then((x) => console.log("", JSON.stringify(x)))
//  -> {"base":{"address":"bnb1qfmufc2q30cgw82ykjlpfeyauhcf5mad6p5y8t","coins":[{"denom":"BNB","amount":2843667357},{"denom":"MTV-4C6","amount":7711000000000}],"public_key":{"type":"Buffer","data":[235,90,233,135,33,3,21,36,100,69,241,5,162,40,77,204,210,190,159,234,66,242,232,59,133,159,82,159,122,185,65,28,191,55,53,132,61,135]},"account_number":221399,"sequence":7383},"name":"","locked":[{"denom":"BNB","amount":2473269620},{"denom":"MTV-4C6","amount":6645000000000}],"frozen":[]}
```

## crypto

Generate privatekey, address, keystore and mnemonics:

```js
// keystore
const keyStore = crypto.generateKeyStore(privateKey, password)

// generate key entropy
const privateKey = crypto.generatePrivateKey()

// addresses
const address = crypto.getAddressFromPublicKey(publicKey)
// or
const address = crypto.getAddressFromPrivateKey(privateKey)

// mnemonic
const mnemonic = crypto.generateMnemonic() // => 24 words
console.log("valid mnemonic?", crypto.validateMnemonic(mnemonic))
```

Recover private keys, addresses from keystore and mnemonics:

```js
// recover from keystore
const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password)

// recover from mnemonic
const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)

// get an address
const address = crypto.getAddressFromPrivateKey(privateKey)
```

## amino (js-amino)

[go-amino on GitHub](https://github.com/tendermint/go-amino)

Serialize an object to hex string compatible with go-amino:

```js
amino.marshalBinary(data)

amino.marshalBinaryBare(data)
```

## Ledger

The following code is an example of what you can do with the Ledger support:

```js
const { ledger } = require("@binance-chain/javascript-sdk")
ledger(async () => {
  // check environment (web, node)
  console.log("node?", await ledger.transports.node.isSupported()) // => true if node
  console.log("web?", await ledger.transports.u2f.isSupported()) // => true if web
  console.log("bluetooth?", await ledger.transports.wble.isSupported()) // => true if web

  // use the node transport
  const timeout = 5000
  const transport = await ledger.transports.node.create(timeout)
  const app = new ledger.app(transport)

  // do some things! (firmware app must be open now)

  // get version
  try {
    const version = await app.getVersion()
    console.log("version", version)
  } catch ({ message, statusCode }) {
    console.error("version error", message, statusCode)
  }

  // we can provide the hd path (app checks first two parts are same as below)
  const hdPath = [44, 714, 0, 0, 0]

  // get public key
  let pk
  try {
    pk = (await app.getPublicKey(hdPath)).pk
    console.log("public key", pk)
  } catch ({ message, statusCode }) {
    console.error("pk error", message, statusCode)
  }

  // get address from pubkey
  const address = sdk.crypto.getAddressFromPublicKey(pk)
  console.log("address", address)

  // txMsg can be a string, as it is passed to Buffer.from(txMsg) - default encoding is `utf8`
  const txMsg = `{"account_number":1,"chain_id":"bnbchain","data":null,"memo":"memo","msgs":["msg"],"sequence":1,"source":1}`

  // sign a tx
  try {
    const address = await app.showAddress()
    const signature = (await app.sign(txMsg, hdPath)).signature
    console.log("signature", signature)
  } catch ({ message, statusCode }) {
    console.error("sign error", message, statusCode)
  }
})()
```
