import rpcClient from "../src/rpc/client"


const getClient = (type)=>{
  let uri = 'https://data-seed-pre-0-s1.binance.org'
  if(type === 'wss'){
    uri = 'wss://data-seed-pre-0-s1.binance.org'
  }
  return new rpcClient(uri)
}

describe("rpcClient test", async () => {

  beforeEach(() => {
    jest.setTimeout(20000)
  })

  it("rest status", async () => {
    const client = getClient('https')
    const res = await client.status()
    expect(res).toBeTruthy()
  })

  it("wss status", async ()=>{
    const client = getClient('wss')
    const res = await client.status()
    expect(res).toBeTruthy()
    client.close()
  })

  it("rest net_info", async () => {
    const client = getClient('https')
    const res = await client.netInfo()
    expect(res).toBeTruthy()
  })

  it("wss net_info", async ()=>{
    const client = getClient('wss')
    const res = await client.netInfo()
    expect(res).toBeTruthy()
    client.close()
  })

  it("rest getTokenInfo", async () => {
    const client = getClient('https')
    const symbol = "MINT-04F" // mint is true
    // const symbol = "BNB" // mint is false
    const res = await client.getTokenInfo(symbol)
    expect(res.symbol).toBe(symbol)
  })

  it("wss getTokenInfo", async () => {
    const client = getClient('wss')
    // const symbol = "MINT-04F" // mint is true
    const symbol = "BNB" // mint is false
    const res = await client.getTokenInfo(symbol)
    console.log(res)
    expect(res.symbol).toBe(symbol)
  })

  it("rest listAllTokens", async () => {
    const client = getClient('https')
    const res = await client.listAllTokens(1, 2)
    console.log(res)
  })

  it("rest txSearch", async ()=>{
    const client = getClient('https')
    const params = {
      query: "tx.height=8669273",
      prove: true,
      page: 1,
      perPage: 10
    }
    const result = await client.txSearch(params)
    expect(result.txs).toBeTruthy()
  })

  it('rest getAccount', async ()=>{
    const client = getClient('https')
    const result = await client.getAccount('tbnb1l6vgk5yyxcalm06gdsg55ay4pjkfueazkvwh58')
    console.log(result)
  })

  it('rest getOpenOrder', async ()=>{
    const client = getClient('https')
    const result = await client.getOpenOrders('tbnb1cyl8v7mzh9s9gx5q9e5q0jpq7njlfpy53f2nrn', 'BNB_USDT.B-B7C')
  })

  it('rest getTradingPairs', async ()=>{
    const client = getClient('https')
    const result = await client.getOpenOrders(1, 4)
  })
    
  it('rest getDepth', async ()=>{
    const client = getClient('https')
    const result = await client.getDepth('BNB_USDT.B-B7C')
  })

})