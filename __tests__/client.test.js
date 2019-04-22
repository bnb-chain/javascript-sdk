import BncClient from "../src"
import { checkNumber } from "../src/client"
import * as crypto from "../src/crypto"
import Transaction from "../src/tx"

/* make sure the address from the mnemonic has balances, or the case will failed */
const mnemonic = "offer caution gift cross surge pretty orange during eye soldier popular holiday mention east eight office fashion ill parrot vault rent devote earth cousin"

const keystore = {"version":1,"id":"73a811d0-5e31-4a0e-9b3a-a2a457ccbd7b","crypto":{"ciphertext":"3b","cipherparams":{"iv":"56d59d999578a0364c59934128dd215d"},"cipher":"aes-256-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"781849b3477252928cfbe5d62180a755dce1e5b2569b02f6f14e7f46a0740687","c":262144,"prf":"hmac-sha256"},"mac":"6a967b9dad5062eac3dbc9db4e30a8f2efa60f60403aa9ea0345e50cdfb5e9d86343f5808b7e2f51b062f7c7f24189723acd4a94568e6a72bb63e6345e988c0f"}}

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

describe("checkNumber", async () => {
  it("ensures that the number is positive", async () => {
    expect(() => checkNumber(-100, "-100")).toThrowError("-100 should be a positive number")
  })

  it("ensures that the number is less than 2^63", async () => {
    expect(() => checkNumber(Math.pow(2,63), "2^63")).toThrowError("2^63 should be less than 2^63")
    expect(() => checkNumber(Math.pow(2,63) + 1, "2^63")).toThrowError("2^63 should be less than 2^63")
  })
})

describe("BncClient test", async () => {

  it("create account", async () => {
    const client = await getClient(false)
    const res = client.createAccount()
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("create account with keystore", async () => {
    const client = await getClient(false)
    const res = client.createAccountWithKeystore("12345678")
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
    expect(res.keystore).toBeTruthy()
  })

  it("create account with mneomnic", async () => {
    const client = await getClient(false)
    const res = client.createAccountWithMneomnic()
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
    expect(res.mnemonic).toBeTruthy()
  })

  it("recover account from keystore", async () => {
    const client = await getClient(false)
    const res = client.recoverAccountFromKeystore(keystore, "12345qwert!S")
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("recover account from mneomnic", async () => {
    const client = await getClient(false)
    const res = client.recoverAccountFromMneomnic(mnemonic)
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("recover account from privatekey", async () => {
    const client = await getClient(false)
    const pk = crypto.generatePrivateKey()
    const res = client.recoverAccountFromPrivateKey(pk)
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

  it("transfer placeOrder cancelOrder only", async () => {
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

  it("choose network", async () => {
    const client = await getClient(false)
    client.chooseNetwork("testnet")
    const res = client.createAccountWithKeystore("12345678")
    expect(res.address.includes("tbnb")).toBeTruthy()

    client.chooseNetwork("mainnet")
    const res1 = client.createAccountWithKeystore("12345678")
    expect(res1.address.includes("bnb")).toBeTruthy()
  })

  it("get markets works", async () => {
    const client = await getClient(false)
    const { result: markets, status } = await client.getMarkets(150)
    expect(status).toBe(200)
    expect(markets.length).toBeGreaterThan(0)
    expect(markets[0]).toHaveProperty("base_asset_symbol")
    expect(markets[0]).toHaveProperty("quote_asset_symbol")
    expect(markets[0]).toHaveProperty("list_price")
    expect(markets[0]).toHaveProperty("tick_size")
    expect(markets[0]).toHaveProperty("lot_size")
  })

  it("check number when transfer", async () => {
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)

    const account = await client._httpClient.request("get", `/api/v1/account/${addr}`)
    const sequence = account.result && account.result.sequence

    try{
      await client.transfer(addr, targetAddress, -1, "BNB", "hello world", sequence)
    } catch(err) {
      expect(err.message).toBe("amount should be a positive number")
    }

    try{
      await client.transfer(addr, targetAddress, Math.pow(2, 63), "BNB", "hello world", sequence)
    } catch(err) {
      expect(err.message).toBe("amount should be less than 2^63")
    }
  })

  it("check number when place order", async () => {
    const symbol = "BNB_USDT.B-B7C"
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)

    try{
      await client.placeOrder(addr, symbol, 2, -40, 0.0001, 1)
    } catch(err) {
      expect(err.message).toBe("price should be a positive number")
    }

    try{
      await client.placeOrder(addr, symbol, 2, Math.pow(2,63), 2, 1)
    } catch(err) {
      expect(err.message).toBe("price should be less than 2^63")
    }
  })
})
