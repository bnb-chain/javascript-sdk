import { checkNumber } from "../src/utils/validateHelper"
import * as crypto from "../src/crypto"
import Transaction from "../src/tx"
import { voteOption } from "../src/gov/"
import { calculateRandomNumberHash, calculateSwapID } from "../src/utils/index"
import { getClient, mnemonic, keystores, targetAddress } from "./utils"

const wait = ms => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve()
    }, ms)
  })
}

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

beforeEach(() => {
  jest.setTimeout(50000)
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
  jest.setTimeout(50000)
  const client = await getClient(false)
  const res = client.recoverAccountFromMneomnic(mnemonic)
  await 1500
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})

it("recover account from privatekey", async () => {
  jest.setTimeout(50000)
  const client = await getClient(false)
  const pk = crypto.generatePrivateKey()
  const res = client.recoverAccountFromPrivateKey(pk)
  await 1500
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})

it("get balance", async () => {
  const client = await getClient(false)
  const res = await client.getBalance(targetAddress)
  expect(res.length).toBeGreaterThanOrEqual(0)
})

it("get swaps", async () => {
  const client = await getClient(false)
  const swapID =
    "4dd95fadfb6c064dcb99234301bf22978ade9ad49ca7a4c708305c8fea6549d8"
  let res = await client.getSwapByID(swapID)
  expect(res.status).toBe(200)
  console.log(res)

  res = await client.getSwapByCreator(
    "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd",
    10,
    0
  )
  expect(res.status).toBe(200)
  console.log(res)

  res = await client.getSwapByRecipient(
    "tbnb1prrujx8kkukrcrppklggadhuvegfnx8pemsq77",
    10,
    0
  )
  expect(res.status).toBe(200)
  console.log(res)
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
  const client = await getClient(true)
  const addr = crypto.getAddressFromPrivateKey(client.privateKey)
  const account = await client._httpClient.request(
    "get",
    `/api/v1/account/${addr}`
  )
  const sequence = account.result && account.result.sequence

  client.setBroadcastDelegate(signedTx => {
    expect(signedTx instanceof Transaction).toBeTruthy()
    expect(signedTx.signatures.length).toBeTruthy()
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

it("transfer placeOrder cancelOrder only", async () => {
  jest.setTimeout(50000)

  const symbol = "BNB_USDT.B-B7C"
  const client = await getClient(true)
  const addr = crypto.getAddressFromPrivateKey(client.privateKey)
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
  console.log(res1)
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
    const res2 = await client._httpClient.get(`/api/v1/tx/${hash}?format=json`)
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

it("get transactions works", async () => {
  const client = await getClient(false)
  const { result: transactions, status } = await client.getTransactions(
    targetAddress
  )
  expect(status).toBe(200)
  expect(transactions).toHaveProperty("tx")
  expect(transactions).toHaveProperty("total")
})

it("get tx works", async () => {
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
  const client = await getClient(false)
  const { result: orders, status } = await client.getOpenOrders(targetAddress)
  expect(status).toBe(200)
  expect(orders).toHaveProperty("order")
  expect(orders).toHaveProperty("total")
})

it("get depth works", async () => {
  const symbol = "BNB_USDT.B-B7C"
  const client = await getClient(false)
  const { result: depth, status } = await client.getDepth(symbol)
  expect(status).toBe(200)
  expect(depth).toHaveProperty("bids")
  expect(depth).toHaveProperty("asks")
  expect(depth).toHaveProperty("height")
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

it("issue token", async () => {
  const client = await getClient(true)
  const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
  const symbol = "MINT"
  const tokenName = "test issue token"
  const totalSupply = 21000000

  const res = await client.tokens.issue(
    addr,
    tokenName,
    symbol,
    totalSupply,
    true
  )
  console.log(res)
  expect(res.status).toBe(200)
})

it("time lock token", async () => {
  const client = await getClient(true)
  const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
  const description = "timelock token test"
  const amount = [
    {
      denom: "BNB",
      amount: 100000
    }
  ]
  const timeLock = Math.floor(Date.now() / 1000) + 100
  const res = await client.tokens.timeLock(addr, description, amount, timeLock)
  console.log(res)
  expect(res.status).toBe(200)
})

it("time relock token", async () => {
  const client = await getClient(true)
  const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
  const description = "timerelock token test"
  const amount = [
    {
      denom: "BNB",
      amount: 150000
    }
  ]
  const id = 2248
  const timeLock = Math.floor(Date.now() / 1000) + 200
  const res = await client.tokens.timeRelock(
    addr,
    id,
    description,
    amount,
    timeLock
  )
  console.log(res)
  expect(res.status).toBe(200)
})

it("time unlock token", async () => {
  const client = await getClient(true)
  const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
  const id = 2248
  const res = await client.tokens.timeUnlock(addr, id)
  console.log(res)
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
      amount: 100000
    }
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
  console.log(res)
  console.log(calculateSwapID(randomNumberHash, from, ""))
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
      amount: 100000
    }
  ]
  const res = await client.swap.depositHTLT(from, swapID, amount)
  console.log(res)
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
  console.log(res)
  expect(res.status).toBe(200)
})

it("refund HTLT", async () => {
  const client = await getClient(true)
  const from = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
  const swapID =
    "61daf59e977c5f718f5aaedeaf69ccbea1c376db5274a84bca88848696164ffe"
  const res = await client.swap.refundHTLT(from, swapID)
  console.log(res)
  expect(res.status).toBe(200)
})

it("freeze token", async () => {
  const client = await getClient(true)
  const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
  const symbol = "XZJ-D9A"
  const amount = 10000

  const { status } = await client.tokens.freeze(addr, symbol, amount)
  expect(status).toBe(200)
})

it("unfreeze token", async () => {
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

it("burn token", async () => {
  const client = await getClient(true)
  const addr = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
  const symbol = "XZJ-D9A"
  const amount = 10000
  const { status } = await client.tokens.burn(addr, symbol, amount)
  expect(status).toBe(200)
})

it("mint token", async () => {
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
    votingPeriod: 300
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
      amount: 1000
    }
  ]
  const res = await client.gov.deposit(494, addr, coins)
  console.log(res)
  expect(res.status).toBe(200)
  expect(res.result[0].code).toBe(0)
})

it("voteProposal", async () => {
  const client = await getClient(true)
  const addr = crypto.getAddressFromPrivateKey(client.privateKey)
  const res = await client.gov.vote(494, addr, voteOption.OptionYes)
  console.log(res)
  expect(res.status).toBe(200)
  expect(res.result[0].code).toBe(0)
})

it("list MINT", async () => {
  const client = await getClient(true)
  const addr = crypto.getAddressFromPrivateKey(client.privateKey)
  try {
    const res = await client.list(addr, 620, "MINT-200", "BNB", 1)
    console.log(res)
    expect(res.status).toBe(200)
    expect(res.result[0].code).toBe(0)
  } catch (err) {
    expect(err.message).toBe("trading pair exists")
  }
})

it("set account flags", async () => {
  const client = await getClient(true)
  const addr = crypto.getAddressFromPrivateKey(client.privateKey)
  const res = await client.setAccountFlags(addr, 0x01)
  expect(res.status).toBe(200)
  expect(res.result[0].code).toBe(0)
})
