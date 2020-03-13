import { getClient, address, targetAddress, wait } from "./utils"
import * as crypto from "../src/crypto"

describe("dex", () => {
  beforeEach(() => {
    jest.setTimeout(50000)
  })

  it("transfer placeOrder cancelOrder only", async () => {
    const symbol = "BNB_USDT.B-B7C"
    const client = await getClient(true)
    const addr = address
    const accCode = crypto.decodeAddress(addr)
    const account = await client._httpClient.request(
      "get",
      `/api/v1/account/${addr}`
    )

    const sequence = account.result && account.result.sequence
    const res = await client.transfer(
      addr,
      targetAddress,
      0.00000001,
      "BNB",
      "hello world",
      sequence
    )
    expect(res.status).toBe(200)

    await wait(3000)

    // acc needs .004 BNB to lock
    const res1 = await client.placeOrder(
      addr,
      symbol,
      2,
      40,
      0.0001,
      sequence + 1
    )
    expect(res1.status).toBe(200)

    await wait(5000)

    const orderId = `${accCode.toString("hex")}-${sequence + 2}`.toUpperCase()
    const res2 = await client.cancelOrder(addr, symbol, orderId, sequence + 2)

    expect(res2.status).toBe(200)
  })

  it("transfer with presicion", async () => {
    jest.setTimeout(30000)

    const coin = "BNB"
    let amount = 2.00177011
    const client = await getClient(false)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)
    const account = await client._httpClient.request(
      "get",
      `/api/v1/account/${addr}`
    )
    const sequence = account.result && account.result.sequence
    const res = await client.transfer(
      addr,
      targetAddress,
      amount,
      coin,
      "hello world",
      sequence
    )
    expect(res.status).toBe(200)

    try {
      const hash = res.result[0].hash
      const res2 = await client._httpClient.get(
        `/api/v1/tx/${hash}?format=json`
      )
      const sendAmount =
        res2.result.tx.value.msg[0].value.inputs[0].coins[0].amount
      expect(sendAmount).toBe(200177011)
    } catch (err) {
      //
    }
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

  it("check number when transfer", async () => {
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)

    const account = await client._httpClient.request(
      "get",
      `/api/v1/account/${addr}`
    )
    const sequence = account.result && account.result.sequence

    try {
      await client.transfer(
        addr,
        targetAddress,
        -1,
        "BNB",
        "hello world",
        sequence
      )
    } catch (err) {
      expect(err.message).toBe("amount should be a positive number")
    }

    try {
      await client.transfer(
        addr,
        targetAddress,
        Math.pow(2, 63),
        "BNB",
        "hello world",
        sequence
      )
    } catch (err) {
      expect(err.message).toBe("amount should be less than 2^63")
    }
  })

  it("check number when place order", async () => {
    const symbol = "BNB_USDT.B-B7C"
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)

    try {
      await client.placeOrder(addr, symbol, 2, -40, 0.0001, 1)
    } catch (err) {
      expect(err.message).toBe("price should be a positive number")
    }

    try {
      await client.placeOrder(addr, symbol, 2, Math.pow(2, 63), 2, 1)
    } catch (err) {
      expect(err.message).toBe("price should be less than 2^63")
    }
  })

  it("multiSend", async () => {
    const client = await getClient(true)
    const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const transfers = [
      {
        to: "tbnb1p4kpnj5qz5spsaf0d2555h6ctngse0me5q57qe",
        coins: [
          {
            denom: "BNB",
            amount: 0.01
          },
          {
            denom: "USDT.B-B7C",
            amount: 0.01
          }
        ]
      },
      {
        to: "tbnb1scjj8chhhp7lngdeflltzex22yaf9ep59ls4gk",
        coins: [
          {
            denom: "USDT.B-B7C",
            amount: 0.02
          },
          {
            denom: "BNB",
            amount: 0.3
          }
        ]
      }
    ]

    const { status } = await client.multiSend(addr, transfers)
    expect(status).toBe(200)
  })
})
