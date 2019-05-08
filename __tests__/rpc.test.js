const debug = require("debug")("Binance Chain:rpc")
import rpcClient from "../src/rpc/rpcClient"

let client = new rpcClient("https://data-seed-pre-0-s1.binance.org")

describe("rpcClient test", async () => {

  beforeEach(() => {
    jest.setTimeout(20000)
  })

  it("https status", async () => {
    const res = await client.status()
    expect(res).toBeTruthy()
  })

  it("https net_info", async () => {
    const res = await client.netInfo()
    console.log(res)
    expect(res).toBeTruthy()
  })

  it("https getTokenInfo", async () => {
    const res = await client.getTokenInfo('BNB')
    console.log(res)
    expect(res).toBeTruthy()
  })




})