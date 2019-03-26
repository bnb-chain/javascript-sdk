import BncClient from "../src"
import * as crypto from "../src/crypto"
import { Account } from "../src/account"
=======
import Transaction from "../src/tx"

/* make sure the address from the mnemonic has balances, or the case will failed */
const mnemonic = "offer caution gift cross surge pretty orange during eye soldier popular holiday mention east eight office fashion ill parrot vault rent devote earth cousin"

const keystore = {"version":1,"id":"dfb09873-f16f-48c6-a6b8-bb5a705c47a7","address":"bnc1dxj068zgk007fchefj9n8tq06pcuce5ypqm5zk","crypto":{"ciphertext":"33b7439a8d64d73357dc91f88a6b3a45e7303717664d17daf8e8dc1cc708fa4b","cipherparams":{"iv":"88c726d70cd0437bfdb2312dc60103fc"},"cipher":"aes-256-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"ad10ef544417d4a25914dec3d908882686dd9d793b5c484b76fd5aa575cf54b9","c":262144,"prf":"hmac-sha256"},"mac":"f7cc301d18c97c71741492b8029544952ad5567a733971deb49fd3eb03ee696e"}}

const targetAddress = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"

const getClient = async (useAwaitSetPrivateKey = true) => {
  const client = new BncClient("https://testnet-dex.binance.org")
  await client.initChain()
  const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
  if (useAwaitSetPrivateKey) {
    await client.setPrivateKey(privateKey)
  } else {
    client.setPrivateKey(privateKey) // test without `await`
  }
  // use default delegates (signing, broadcast)
  client.useDefaultSigningDelegate()
  client.useDefaultBroadcastDelegate()
  return client
}

const wait = ms => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, ms)
  })
}

describe("BncClient test", async () => {

  it("create account", async () => {
    const res = Account.createAccount()
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("create account with keystore", async () => {
    const res = Account.createAccountWithKeystore("12345678")
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
    expect(res.keystore).toBeTruthy()
  })

  it("create account with mneomnic", async () => {
    const res = Account.createAccountWithMneomnic()
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
    expect(res.mnemonic).toBeTruthy()
  })

  it("recover account from keystore", async () => {
    const res = Account.recoverAccountFromKeystore(keystore, "12345qwert!S")
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("recover account from mneomnic", async () => {
    const res = Account.recoverAccountFromMneomnic(mnemonic)
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("recover account from privatekey", async () => {
    const pk = crypto.generatePrivateKey()
    const res = Account.recoverAccountFromPrivateKey(pk)
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("get balance", async () => {
    const client = await getClient(false)
    const res = await client.getBalance(targetAddress)
    expect(res.length).toBeGreaterThanOrEqual(0)
  })

  it("works with a custom signing delegate", async () => {
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)
    const account = await client._httpClient.request("get", `/api/v1/account/${addr}`)
    const sequence = account.result && account.result.sequence

    client.setSigningDelegate((tx, signMsg) => {
      expect(tx instanceof Transaction).toBeTruthy()
      expect(!tx.signatures.length).toBeTruthy()
      expect(signMsg.inputs.length).toBeTruthy()
      return tx
    })

    try {
      await client.transfer(addr, targetAddress, 0.00000001, "BNB", "hello world", sequence)
    } catch (err) {
      // will throw because a signature was not added by the signing delegate.
    }
  })

  it("works with a custom broadcast delegate", async () => {
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)
    const account = await client._httpClient.request("get", `/api/v1/account/${addr}`)
    const sequence = account.result && account.result.sequence

    client.setBroadcastDelegate(signedTx => {
      expect(signedTx instanceof Transaction).toBeTruthy()
      expect(signedTx.signatures.length).toBeTruthy()
      return "broadcastDelegateResult"
    })

    const res = await client.transfer(addr, targetAddress, 0.00000001, "BNB", "hello world", sequence)
    expect(res).toBe("broadcastDelegateResult")
  })

  it("transfer placeOrder cancelOrder", async () => {
    jest.setTimeout(50000)

    const symbol = "BNB_USDT.B-B7C"
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)
    const accCode = crypto.decodeAddress(addr)
    const account = await client._httpClient.request("get", `/api/v1/account/${addr}`)
    const sequence = account.result && account.result.sequence

    const res = await client.transfer(addr, targetAddress, 0.00000001, "BNB", "hello world", sequence)
    expect(res.status).toBe(200)

    await wait(3000)

    // acc needs .004 BNB to lock
    const res1 = await client.placeOrder(addr, symbol, 2, 40, 0.0001, sequence + 1)
    expect(res1.status).toBe(200)

    await wait(5000)

    const orderId = `${accCode.toString("hex")}-${sequence + 2}`.toUpperCase()
    const res2 = await client.cancelOrder(addr, symbol, orderId, sequence + 2)
    expect(res2.status).toBe(200)
  })

  it("transfer placeOrder cancelOrder (no await on set privkey)", async () => {
    jest.setTimeout(25000)

    const symbol = "BNB_USDT.B-B7C"
    const client = await getClient(false)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)

    // acc needs .004 BNB to lock
    // IOC - auto cancels
    const res1 = await client.placeOrder(addr, symbol, 2, 40, 0.0001, null, 3)
    expect(res1.status).toBe(200)
  })

  it("get account", async () => {
    const client = await getClient(false)
    const res = await client.getAccount(targetAddress)
    if (res.status === 200) {
      expect(res.status).toBe(200)
    } else {
      expect(res.status).toBe(204)
    }
  })

  it("get balance no arg", async () => {
    const client = await getClient(false)
    const balances = await client.getBalance()
    expect(balances.length).toBeGreaterThan(0)
  })
})
