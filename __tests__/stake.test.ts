import { getClient, address } from "./utils"

describe("stake management", () => {
  beforeEach(() => {
    jest.setTimeout(50000)
  })

  it("bsc delegate", async () => {
    const client = await getClient(true)
    const validatorAddress = "bva10npy5809y303f227g4leqw7vs3s6ep5ul26sq2"

    try {
      const res = await client.stake.bscDelegate({
        delegateAddress: address,
        validatorAddress,
        amount: 10,
      })
      expect(res.status).toBe(200)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
      }
      throw err
    }
  })

  it("bsc undelegate", async () => {
    const client = await getClient(true)
    const validatorAddress = "bva10npy5809y303f227g4leqw7vs3s6ep5ul26sq2"

    try {
      const res = await client.stake.bscUndelegate({
        delegateAddress: address,
        validatorAddress,
        amount: 10,
      })
      expect(res.status).toBe(200)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
      }
      throw err
    }
  })

  it("bsc redelegate", async () => {
    const client = await getClient(true)
    const validatorSrcAddress = "bva10npy5809y303f227g4leqw7vs3s6ep5ul26sq2"
    const validatorDstAddress = "bva1pcd6muhehuz6fy05wfhq9sd5fww6ggdap3adxg"
    try {
      const res = await client.stake.bscReDelegate({
        delegateAddress: address,
        validatorSrcAddress,
        validatorDstAddress,
        amount: 10,
      })
      expect(res.status).toBe(200)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
      }
      throw err
    }
  })
})
