import { voteOption } from "../src/client/gov/"
import * as crypto from "../src/crypto"
import { calculateRandomNumberHash } from "../src/utils"

import { getClient } from "./utils"

describe("token management", () => {
  beforeEach(() => {
    jest.setTimeout(50000)
  })

  it("issue token", async () => {
    const client = await getClient(true)
    const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const symbol = "MINT"
    const tokenName = "test issue token"
    const totalSupply = 8888
    try {
      const res = await client.tokens.issue(
        addr,
        tokenName,
        symbol,
        totalSupply,
        true
      )
      expect(res.status).toBe(200)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
      }
      throw err
    }
  })

  it("time lock token", async () => {
    const client = await getClient(true)
    const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const description = "timelock token test"
    const amount = [
      {
        denom: "BNB",
        amount: 100000,
      },
    ]
    const timeLock = Math.floor(Date.now() / 1000) + 100
    const res = await client.tokens.timeLock(
      addr,
      description,
      amount,
      timeLock
    )

    expect(res.status).toBe(200)
  })

  it("timeRelock token", async () => {
    const client = await getClient(true)
    const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const description = "timerelock token test"
    const amount = [
      {
        denom: "BNB",
        amount: 150000,
      },
    ]
    const id = 2248
    const timeLock = Math.floor(Date.now() / 1000) + 200
    try {
      const res = await client.tokens.timeRelock(
        addr,
        id,
        description,
        amount,
        timeLock
      )
      expect(res.status).toBe(200)
    } catch (err) {
      if (err.message.includes("Time lock does not exist")) {
        expect(1).toBeTruthy()
      }
      throw err
    }
  })

  it("timeUnlock token", async () => {
    const client = await getClient(true)
    const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const id = 2248
    const res = await client.tokens.timeUnlock(addr, id)
    expect(res.status).toBe(200)
  })

  it("htlt", async () => {
    const client = await getClient(true)
    const from = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const recipient = "tbnb1prrujx8kkukrcrppklggadhuvegfnx8pemsq77"
    const randomNumber =
      "e8eae926261ab77d018202434791a335249b470246a7b02e28c3b2fb6ffad8f3"
    const timestamp = Math.floor(Date.now() / 1000)
    const randomNumberHash = calculateRandomNumberHash(randomNumber, timestamp)
    const amount = [
      {
        denom: "BNB",
        amount: 100000,
      },
    ]
    const expectedIncome = "100000:BNB"
    const res = await client.swap.HTLT(
      from,
      recipient,
      "",
      "",
      randomNumberHash,
      timestamp,
      amount,
      expectedIncome,
      400,
      false
    )
    expect(res.status).toBe(200)
  })

  it("deposit HTLT", async () => {
    const client = await getClient(true)
    const from = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const swapID =
      "61daf59e977c5f718f5aaedeaf69ccbea1c376db5274a84bca88848696164ffe"
    const amount = [
      {
        denom: "BNB",
        amount: 100000,
      },
    ]
    const res = await client.swap.depositHTLT(from, swapID, amount)
    expect(res.status).toBe(200)
  })

  it("claim HTLT", async () => {
    const client = await getClient(true)
    const from = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const swapID =
      "61daf59e977c5f718f5aaedeaf69ccbea1c376db5274a84bca88848696164ffe"
    const randomNumber =
      "e8eae926261ab77d018202434791a335249b470246a7b02e28c3b2fb6ffad8f3"
    const res = await client.swap.claimHTLT(from, swapID, randomNumber)
    expect(res.status).toBe(200)
  })

  it("refund HTLT", async () => {
    const client = await getClient(true)
    const from = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const swapID =
      "61daf59e977c5f718f5aaedeaf69ccbea1c376db5274a84bca88848696164ffe"
    const res = await client.swap.refundHTLT(from, swapID)
    expect(res.status).toBe(200)
  })

  it("freezeToken", async () => {
    const client = await getClient(true)
    const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const symbol = "XZJ-D9A"
    const amount = 10000

    const { status } = await client.tokens.freeze(addr, symbol, amount)
    expect(status).toBe(200)
  })

  it("unfreezeToken", async () => {
    const client = await getClient(true)
    const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const symbol = "XZJ-D9A"
    const amount = 100
    try {
      const { status } = await client.tokens.unfreeze(addr, symbol, amount)
      expect(status).toBe(200)
    } catch (err) {
      expect(err.message).toBe("do not have enough token to unfreeze")
    }
  })

  it("burnToken", async () => {
    const client = await getClient(true)
    const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const symbol = "XZJ-D9A"
    const amount = 10000
    const { status } = await client.tokens.burn(addr, symbol, amount)
    expect(status).toBe(200)
  })

  it("mintToken", async () => {
    const client = await getClient(true)
    const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const symbol = "MINT-04F"
    const amount = 10000000
    const res = await client.tokens.mint(addr, symbol, amount)
    expect(res.status).toBe(200)
  })

  it("submitListProposal", async () => {
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)
    const date = new Date()
    const params = {
      title: "list MINT-200",
      description: "list MINT-200",
      baseAsset: "MINT-200",
      quoteAsset: "BNB",
      initPrice: 1,
      address: addr,
      initialDeposit: 2000,
      expireTime: date.setHours(date.getHours() + 1),
      votingPeriod: 300,
    }

    const res = await client.gov.submitListProposal(params)
    expect(res.status).toBe(200)
    expect(res.result[0].code).toBe(0)
  })

  it("depositProposal", async () => {
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)
    const coins = [
      {
        denom: "BNB",
        amount: 1000,
      },
    ]
    const res = await client.gov.deposit(494, addr, coins)
    expect(res.status).toBe(200)
    expect(res.result[0].code).toBe(0)
  })

  it("voteProposal", async () => {
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)
    const res = await client.gov.vote(494, addr, voteOption.OptionYes)
    expect(res.status).toBe(200)
    expect(res.result[0].code).toBe(0)
  })

  it("list MINT", async () => {
    const client = await getClient(true)
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)
    try {
      const res = await client.list(addr, 620, "MINT-200", "BNB", 1)
      expect(res.status).toBe(200)
      expect(res.result[0].code).toBe(0)
    } catch (err) {
      expect(err.message).toBe("trading pair exists")
    }
  })

  it("issue minitoken", async () => {
    const client = await getClient(true)
    const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const symbol = "TMINI"
    const tokenName = "test issue mini token"
    const totalSupply = 8888
    const tokenUri = "https://google.com"
    try {
      const res = await client.tokens.issueMiniToken(
        addr,
        tokenName,
        symbol,
        totalSupply,
        true,
        tokenUri
      )
      expect(res.status).toBe(200)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
      }
      throw err
    }
  })

  it("issue tinyToken", async () => {
    const client = await getClient(true)
    const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const symbol = "TTMI"
    const tokenName = "test issue mini token"
    const totalSupply = 111
    const tokenUri = "https://google.com"
    try {
      const res = await client.tokens.issueTinyToken(
        addr,
        tokenName,
        symbol,
        totalSupply,
        true,
        tokenUri
      )
      expect(res.status).toBe(200)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
      }
      throw err
    }
  })
})
