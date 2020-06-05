import { getClient } from "./utils"

describe("token management", () => {
  beforeEach(() => {
    jest.setTimeout(50000)
  })

  it("transfer from bc to bsc", async () => {
    const client = await getClient(true)
    const toAddress = "0xc1c87c37be3Ef20273A4E8982293EEb6E08C620C"
    const from = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"
    const result = await client.bridge.transferOut({
      toAddress,
      fromAddress: from,
      amount: { denom: "BNB", amount: 100 },
      expireTime: 100000,
    })
  })
})
