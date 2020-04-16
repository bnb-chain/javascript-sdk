import { checkNumber } from "../src/utils/"
import * as crypto from "../src/crypto"
import Transaction from "../src/tx"
import { getClient, mnemonic, keystores, targetAddress, wait } from "./utils"

const waitSeconds = 0

describe("client", () => {
  beforeEach(() => {
    jest.setTimeout(10000)
  })

  it("ensures that the number is positive", async () => {
    expect(() => checkNumber(-100, "-100")).toThrowError(
      "-100 should be a positive number"
    )
  })

  it("ensures that the number is less than 2^63", async () => {
    expect(() => checkNumber(Math.pow(2, 63), "2^63")).toThrowError(
      "2^63 should be less than 2^63"
    )
    expect(() => checkNumber(Math.pow(2, 63) + 1, "2^63")).toThrowError(
      "2^63 should be less than 2^63"
    )
  })

  it("create account", async () => {
    const client = await getClient(false)
    const res = client.createAccount()
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("create account with keystore", async () => {
    const client = await getClient(false, true)
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
    await wait(waitSeconds)
    const client = await getClient(false, true)
    const res = client.recoverAccountFromKeystore(keystores.new, "12345qwert!S")
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("recover account from legacy (sha256) keystore", async () => {
    const client = await getClient(false, true)
    const res = client.recoverAccountFromKeystore(
      keystores.legacy,
      "12345qwert!S"
    )
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("recover account from bad mac keystore", async () => {
    const client = await getClient(false, true)
    expect(() => {
      client.recoverAccountFromKeystore(keystores.badMac, "12345qwert!S")
    }).toThrowError()
  })

  it("recover account from mneomnic", async () => {
    await wait(waitSeconds)
    const client = await getClient(false)
    const res = client.recoverAccountFromMneomnic(mnemonic)
    await 1500
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("recover account from privatekey", async () => {
    await wait(waitSeconds)
    const client = await getClient(false)
    const pk = crypto.generatePrivateKey()
    const res = client.recoverAccountFromPrivateKey(pk)
    await 1500
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("get balance", async () => {
    await wait(waitSeconds)
    const client = await getClient(false)
    const res = await client.getBalance(targetAddress)
    expect(res.length).toBeGreaterThanOrEqual(0)
  })

  it("get swaps", async () => {
    await wait(waitSeconds)
    const client = await getClient(false)
    const swapID =
      "4dd95fadfb6c064dcb99234301bf22978ade9ad49ca7a4c708305c8fea6549d8"
    let res = await client.getSwapByID(swapID)
    expect(res.status).toBe(200)

    res = await client.getSwapByCreator(
      "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd",
      10,
      0
    )
    expect(res.status).toBe(200)

    res = await client.getSwapByRecipient(
      "tbnb1prrujx8kkukrcrppklggadhuvegfnx8pemsq77",
      10,
      0
    )
    expect(res.status).toBe(200)
  })

  it("get account", async () => {
    await wait(waitSeconds)
    const client = await getClient(false)
    const res = await client.getAccount(targetAddress)
    if (res.status === 200) {
      expect(res.status).toBe(200)
    } else {
      expect(res.status).toBe(204)
    }
  })

  it("get balance no arg", async () => {
    await wait(waitSeconds)
    const client = await getClient(false)
    const balances = await client.getBalance()
    expect(balances.length).toBeGreaterThan(0)
  })

  it("choose network", async () => {
    await wait(waitSeconds)
    const client = await getClient(false)
    client.chooseNetwork("testnet")
    const res = client.createAccountWithKeystore("12345678")
    expect(res.address.includes("tbnb")).toBeTruthy()

    client.chooseNetwork("mainnet")
    const res1 = client.createAccountWithKeystore("12345678")
    expect(res1.address.includes("bnb")).toBeTruthy()
  })

  it("get markets works", async () => {
    wait(waitSeconds)
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

  it("get transactions works", async () => {
    wait(waitSeconds)
    const client = await getClient(false)
    const { result: transactions, status } = await client.getTransactions(
      targetAddress
    )
    expect(status).toBe(200)
    expect(transactions).toHaveProperty("tx")
    expect(transactions).toHaveProperty("total")
  })

  it("get tx works", async () => {
    wait(waitSeconds)
    const testHash =
      "F1C85CF924D3246EE519CE44F96F8F0FF028E509E3B3EE32A25A805EEFB21A4F"
    const client = await getClient(false)
    const { result: tx, status } = await client.getTx(testHash)
    expect(status).toBe(200)
    expect(tx).toHaveProperty("code")
    expect(tx).toHaveProperty("data")
    expect(tx).toHaveProperty("hash")
    expect(tx).toHaveProperty("height")
    expect(tx).toHaveProperty("log")
    expect(tx).toHaveProperty("ok")
  })

  it("get open orders works", async () => {
    wait(waitSeconds)
    const client = await getClient(false)
    const { result: orders, status } = await client.getOpenOrders(targetAddress)
    expect(status).toBe(200)
    expect(orders).toHaveProperty("order")
    expect(orders).toHaveProperty("total")
  })

  it("get depth works", async () => {
    wait(waitSeconds)
    const symbol = "BNB_USDT.B-B7C"
    const client = await getClient(false)
    const { result: depth, status } = await client.getDepth(symbol)
    expect(status).toBe(200)
    expect(depth).toHaveProperty("bids")
    expect(depth).toHaveProperty("asks")
    expect(depth).toHaveProperty("height")
  })

  it("set account flags", async () => {
    wait(waitSeconds)
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)
    const res = await client.setAccountFlags(addr, 0x00)
    expect(res.status).toBe(200)
    expect(res.result[0].code).toBe(0)
  })

  it("works with a custom signing delegate", async () => {
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)
    const account = await client._httpClient.request(
      "get",
      `/api/v1/account/${addr}`
    )
    const sequence = account.result && account.result.sequence

    client.setSigningDelegate((tx, signMsg) => {
      expect(tx instanceof Transaction).toBeTruthy()
      expect(!tx.signatures.length).toBeTruthy()
      expect(signMsg.inputs.length).toBeTruthy()
      return tx
    })

    await wait(waitSeconds)
    try {
      await client.transfer(
        addr,
        targetAddress,
        0.00000001,
        "BNB",
        "hello world",
        sequence
      )
    } catch (err) {
      // will throw because a signature was not added by the signing delegate.
    }
  })

  it("works with a custom broadcast delegate", async () => {
    await wait(waitSeconds)
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)
    const account = await client._httpClient.request(
      "get",
      `/api/v1/account/${addr}`
    )
    const sequence = account.result && account.result.sequence

    client.setBroadcastDelegate((signedTx) => {
      expect(signedTx instanceof Transaction).toBeTruthy()
      expect(signedTx.signatures.length).toBe(0)
      return "broadcastDelegateResult"
    })

    const res = await client.transfer(
      addr,
      targetAddress,
      0.00000001,
      "BNB",
      "hello world",
      sequence
    )
    expect(res).toBe("broadcastDelegateResult")
  })
})
