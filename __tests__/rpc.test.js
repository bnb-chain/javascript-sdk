import rpcClient from "../src/rpc/client"


const getClient = (type)=>{
  let uri = "https://data-seed-pre-0-s1.binance.org"
  if(type === "wss"){
    uri = "wss://data-seed-pre-0-s1.binance.org"
  }
  return new rpcClient(uri)
}

const address = "tbnb1cyl8v7mzh9s9gx5q9e5q0jpq7njlfpy53f2nrn"
const tradePair = "BNB_USDT.B-B7C"

describe("rpcClient test", async () => {

  beforeEach(() => {
    jest.setTimeout(200000)
  })

  it("rest status", async () => {
    const client = getClient("https")
    const res = await client.status()
    expect(res).toBeTruthy()
    expect(res.node_info.network).toBe('Binance-Chain-Nile')
  })

  it("wss status", async ()=>{
    const client = getClient("wss")
    const res = await client.status()
    expect(res).toBeTruthy()
    expect(res.node_info.network).toBe('Binance-Chain-Nile')
    client.close()
  })

  it("rest net_info", async () => {
    const client = getClient("https")
    const res = await client.netInfo()
    console.log(res)
    expect(res).toBeTruthy()
    expect(res.peers.length).toBeGreaterThanOrEqual(0)
  })

  it("wss net_info", async ()=>{
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
    const res = await client.listAllTokens(1, 2)
    expect(res).toBeTruthy()
    expect(res.length).toBe(2)
  })

  it("wss listAllTokens", async () => {
    const client = getClient("https")
    const res = await client.listAllTokens(1, 2)
    expect(res).toBeTruthy()
    expect(res.length).toBe(2)
    client.close()
  })

  it("rest txSearch", async ()=>{
    const client = getClient("https")
    const params = {
      query: "tx.height=8669273",
      prove: true,
      page: 1,
      perPage: 10
    }

    const result = await client.txSearch(params)
    expect(result.txs).toBeTruthy()
  })

  it("wss txSearch", async ()=>{
    const client = getClient("https")
    const params = {
      query: "tx.height=8669273",
      prove: true,
      page: 1,
      perPage: 10
    }

    const result = await client.txSearch(params)
    expect(result.txs).toBeTruthy()
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

  it("rest getOpenOrders", async ()=>{
    const client = getClient("https")
    const result = await client.getOpenOrders(address, tradePair)
    expect(result).toBeTruthy()
    expect(result.length).toBe(2)
  })

  it("wss getOpenOrders", async ()=>{
    const client = getClient("https")
    const result = await client.getOpenOrders(address, tradePair)
    expect(result).toBeTruthy()
    expect(result.length).toBe(2)
    client.close()
  })

  it("rest getTradingPairs", async ()=>{
    const client = getClient("https")
    const result = await client.getTradingPairs(1, 2)
    expect(result).toBeTruthy()
    expect(result.length).toBe(2)
  })

  it("wss getTradingPairs", async ()=>{
    const client = getClient("https")
    const result = await client.getTradingPairs(1, 2)
    expect(result).toBeTruthy()
    expect(result.length).toBe(2)
    client.close()
  })
    
  it("rest getDepth", async ()=>{
    const client = getClient("https")
    const result = await client.getDepth(tradePair)
    expect(result).toBeTruthy()
    expect(result.height).toBeTruthy()
    expect(result.levels.length).toBeGreaterThanOrEqual(0)
  })

  it("wss getDepth", async ()=>{
    const client = getClient("https")
    const result = await client.getDepth(tradePair)
    expect(result).toBeTruthy()
    expect(result.height).toBeTruthy()
    expect(result.levels.length).toBeGreaterThanOrEqual(0)
    client.close()
  })

})