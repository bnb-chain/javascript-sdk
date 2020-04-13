import { rpc as rpcClient } from "../src"

const NETWORK = "testnet"
const getClient = (type) => {
  let uri = "https://data-seed-pre-0-s3.binance.org"
  if (type === "wss") {
    uri = "wss://data-seed-pre-0-s3.binance.org"
  }
  return new rpcClient(uri, NETWORK)
}

const address = "tbnb1cyl8v7mzh9s9gx5q9e5q0jpq7njlfpy53f2nrn"
const symbol = "BNB"
const tradePair = "BNB_USDT.B-B7C"

describe("rpc", () => {
  beforeEach(() => {
    jest.setTimeout(50000)
  })

  it("rest status", async () => {
    const client = getClient("https")
    const res = await client.status()
    expect(res).toBeTruthy()
    expect(res.node_info.network).toBe("Binance-Chain-Nile")
  })

  it("wss status", async () => {
    const client = getClient("wss")
    const res = await client.status()
    expect(res).toBeTruthy()
    expect(res.node_info.network).toBe("Binance-Chain-Nile")
    client.close()
  })

  it("rest net_info", async () => {
    const client = getClient("https")
    const res = await client.netInfo()
    expect(res).toBeTruthy()
    expect(res.peers.length).toBeGreaterThanOrEqual(0)
  })

  it("wss net_info", async () => {
    const client = getClient("wss")
    const res = await client.netInfo()
    expect(res).toBeTruthy()
    expect(res.peers.length).toBeGreaterThanOrEqual(0)
    client.close()
  })

  it("rest getTokenInfo", async () => {
    const client = getClient("https")
    const symbol = "MINT-04F" // mint is true
    const res = await client.getTokenInfo(symbol)
    expect(res.symbol).toBe(symbol)
  })

  it("wss getTokenInfo", async () => {
    const client = getClient("wss")
    const symbol = "BNB" // mint is false
    const res = await client.getTokenInfo(symbol)
    expect(res.symbol).toBe(symbol)
    client.close()
  })

  it("rest listAllTokens", async () => {
    const client = getClient("https")
    const res = await client.listAllTokens(0, 15)
    expect(res).toBeTruthy()
    expect(res.length).toBe(15)
  })

  it("wss listAllTokens", async () => {
    const client = getClient("https")
    const res = await client.listAllTokens(2, 2)
    expect(res).toBeTruthy()
    expect(res.length).toBe(2)
    client.close()
  })

  it("rest txSearch", async () => {
    const client = getClient("https")
    const params = {
      query: "tx.height=8669273",
      prove: true,
      page: 1,
      perPage: 10,
    }

    const result = await client.txSearch(params)
    expect(result.txs).toBeTruthy()
  })

  it("wss txSearch", async () => {
    const client = getClient("https")
    const params = {
      query: "tx.height=8669273",
      prove: true,
      page: 1,
      perPage: 10,
    }

    const result = await client.txSearch(params)
    expect(result.txs).toBeTruthy()
    client.close()
  })

  it("https txHash", async () => {
    const client = getClient("https")
    const params = {
      hash: Buffer.from(
        "41EB40A5E21D4946BECD922426EDE4789A07384D446A90C499F93344B3B2659B",
        "hex"
      ),
      prove: true,
    }
    const result = await client.tx(params)
    expect(result.tx_result).toBeTruthy()
    client.close()
  })

  it("rest getAccount", async () => {
    const client = getClient("https")
    const result = await client.getAccount(address)
    expect(result.base.address).toBe(address)
  })

  it("wss getAccount", async () => {
    const client = getClient("https")
    const result = await client.getAccount(address)
    expect(result.base.address).toBe(address)
    client.close()
  })

  it("rest getBalances", async () => {
    const client = getClient("https")
    const result = await client.getBalances(address)
    expect(result).toBeTruthy()
    expect(result.length).toBeGreaterThanOrEqual(0)
  })

  it("only rest getBalance", async () => {
    const client = getClient("https")
    const result = await client.getBalance(address, symbol)
    if (result) {
      expect(
        result.free + result.locked + result.frozen
      ).toBeGreaterThanOrEqual(0)
    }
  })

  it("rest getOpenOrders", async () => {
    const client = getClient("https")
    const result = await client.getOpenOrders(address, tradePair)
    expect(result).toBeTruthy()
    expect(result.length).toBeGreaterThanOrEqual(0)
  })

  it("wss getOpenOrders", async () => {
    const client = getClient("https")
    const result = await client.getOpenOrders(address, tradePair)
    expect(result).toBeTruthy()
    expect(result.length).toBeGreaterThanOrEqual(0)
    client.close()
  })

  it("rest getTradingPairs", async () => {
    const client = getClient("https")
    const result = await client.getTradingPairs(0, 2)
    expect(result).toBeTruthy()
    expect(result.length).toBe(2)
  })

  it("wss getTradingPairs", async () => {
    const client = getClient("https")
    const result = await client.getTradingPairs(1, 2)
    expect(result).toBeTruthy()
    expect(result.length).toBe(2)
    client.close()
  })

  it("rest getDepth", async () => {
    const client = getClient("https")
    const result = await client.getDepth(tradePair)
    expect(result).toBeTruthy()
    expect(result.height).toBeTruthy()
    expect(result.levels.length).toBeGreaterThanOrEqual(0)
  })

  it("wss getDepth", async () => {
    const client = getClient("https")
    const result = await client.getDepth(tradePair)
    expect(result).toBeTruthy()
    expect(result.height).toBeTruthy()
    expect(result.levels.length).toBeGreaterThanOrEqual(0)
    client.close()
  })

  it("subscribe", async () => {
    const client = getClient("wss")
    await new Promise((resolve) => {
      client.subscribe({ query: "tm.event = 'CompleteProposal'" }, (events) => {
        resolve(events)
        expect(events).toBeTruthy()
        expect(events.step).toBe("RoundStepPropose")
      })
    })
  })

  it("getTxByHash", async () => {
    const client = getClient("https")
    const hashStr =
      "2029ED36444DFE12E6A235CFE8B1C81B7F31014D23790E382056B395EC1171FE"
    const result = await client.getTxByHash(hashStr, true)
    expect(result).toBeTruthy()
    expect(result.height).toBeTruthy()
    expect(result.hash).toBe(hashStr)
  })
})
