import { getClient } from "./utils"

describe("bridge", () => {
  beforeEach(() => {
    jest.setTimeout(50000)
  })

  it("transfer from bc to bsc1", async () => {
    const client = await getClient(
      true,
      false,
      "https://testnet-kongo.defibit.io/"
    )
    const toAddress = "0xc1c87c37be3Ef20273A4E8982293EEb6E08C620C"
    const from = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const result = await client.bridge.transferFromBcToBsc({
      toAddress,
      fromAddress: from,
      amount: 9,
      symbol: "BNB",
      expireTime: 1597543193,
    })
    expect(result.status).toBe(200)
  })
})
