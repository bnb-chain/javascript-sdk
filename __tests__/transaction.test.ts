import Transaction from "../src/tx"
import {
  CancelOrderMsg,
  NewOrderMsg,
  NewOrder,
  StdSignMsg,
  SignInputOutput,
  SendMsg,
  IssueTokenMsg,
  MintTokenMsg,
  FreezeTokenMsg,
  UnFreezeTokenMsg,
  BurnTokenMsg,
  TimeLockMsg,
  TimeReLockMsg,
  TimeUnlockMsg,
  TransferOutMsg,
  StakeMigrationMsg,
} from "../src/types"

import { getClient, privateKey, address, targetAddress } from "./utils"

const buildAndSendTx = async (msg, url?: string) => {
  const client = await getClient(true, false, url)

  const account = await client._httpClient.request(
    "get",
    `/api/v1/account/${address}`
  )

  const sequence = account.result && account.result.sequence
  const accountNumber = account.result && account.result.account_number

  const node = await client._httpClient.request("get", `/api/v1/node-info`)

  const data: StdSignMsg = {
    chainId: node.result.node_info.network,
    accountNumber: accountNumber,
    sequence: sequence,
    baseMsg: msg,
    memo: "",
    source: 1,
  }

  const tx = new Transaction(data)
  const txBytes = tx.sign(privateKey).serialize()
  const res = await client.sendRawTransaction(txBytes)
  expect(res.status).toBe(200)
}

describe("Transaction", () => {
  beforeEach(() => {
    jest.setTimeout(50000)
  })

  it("build newOrder tx and broadcast", async () => {
    try {
      const client = await getClient(true)

      const account = await client._httpClient.request(
        "get",
        `/api/v1/account/${address}`
      )

      const sequence = account.result && account.result.sequence

      const newOrder: NewOrder = {
        id: `BA36F0FAD74D8F41045463E4774F328F4AF779E5-${sequence! + 1}`,
        symbol: "BNB_USDT.B-B7C",
        ordertype: 2,
        side: 2,
        price: 12,
        quantity: 100,
        timeinforce: 1,
      }

      const newOrderMsg: NewOrderMsg = new NewOrderMsg(newOrder, address)
      await buildAndSendTx(newOrderMsg)
    } catch (error) {
      expect(error.message).toBe("do not have enough token to lock")
    }
  })

  //
  it("build cancelOrder tx and broadcast", async () => {
    try {
      const symbol = "BNB_BTC.B-918"
      const orderId = `BA36F0FAD74D8F41045463E4774F328F4AF779E5-2556`
      const cancelOrderMsg: CancelOrderMsg = new CancelOrderMsg(
        address,
        symbol,
        orderId
      )

      await buildAndSendTx(cancelOrderMsg)
    } catch (err) {
      if (err.message.includes("Failed to find order")) {
        expect(1).toBeTruthy()
        return
      }
      throw err
    }
  })

  it("build transfer tx and broadcast", async () => {
    const client = await getClient(true)

    const account = await client._httpClient.request(
      "get",
      `/api/v1/account/${address}`
    )
    const sequence = account.result && account.result.sequence
    const accountNumber = account.result && account.result.account_number
    const outputs: SignInputOutput[] = [
      {
        address: targetAddress,
        coins: [
          {
            denom: "BNB",
            amount: 1,
          },
        ],
      },
      {
        address: address,
        coins: [
          {
            denom: "BNB",
            amount: 1,
          },
        ],
      },
    ]
    const sendMsg = new SendMsg(address, outputs)
    const data: StdSignMsg = {
      chainId: "Binance-Chain-Ganges",
      accountNumber: accountNumber,
      sequence: sequence,
      baseMsg: sendMsg,
      memo: "123",
      source: 1,
    }

    const tx = new Transaction(data)
    const txBytes = tx.sign(privateKey).serialize()
    const res = await client.sendRawTransaction(txBytes)
    expect(res.status).toBe(200)
  })

  it("build issue token tx and broadcast", async () => {
    try {
      const issueMsg: IssueTokenMsg = new IssueTokenMsg(
        {
          symbol: "NTX",
          name: "New Issue Transaction",
          total_supply: 100000,
          mintable: true,
        },
        address
      )
      await buildAndSendTx(issueMsg)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
        return
      }
      throw err
    }
  })

  it("build mint token tx and broadcast", async () => {
    try {
      const issueMsg = new MintTokenMsg({
        address,
        sybmol: "DSD-24B",
        amount: 10,
      })
      await buildAndSendTx(issueMsg)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
        return
      }
      throw err
    }
  })

  it("build freeze token tx and broadcast", async () => {
    try {
      const freezeMsg = new FreezeTokenMsg({
        address,
        sybmol: "DSD-24B",
        amount: 10,
      })
      await buildAndSendTx(freezeMsg)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
        return
      }
      throw err
    }
  })

  it("build unfreeze token tx and broadcast", async () => {
    try {
      const unFreezeMsg = new UnFreezeTokenMsg({
        address,
        sybmol: "DSD-24B",
        amount: 10,
      })
      await buildAndSendTx(unFreezeMsg)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
        return
      }
      if (err.message.includes("do not have enough token to unfreez")) {
        expect(1).toBeTruthy()
        return
      }
      throw err
    }
  })

  it("build burntoken tx and broadcast", async () => {
    try {
      const burnTokenMsg = new BurnTokenMsg({
        address,
        sybmol: "DSD-24B",
        amount: 10,
      })
      await buildAndSendTx(burnTokenMsg)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
        return
      }
      throw err
    }
  })

  it("build timelock tx and broadcast", async () => {
    try {
      const timelockMsg = new TimeLockMsg({
        address,
        description: "timelock token test",
        amount: [
          {
            denom: "BNB",
            amount: 100000,
          },
        ],
        lock_time: Math.floor(Date.now() / 1000) + 100,
      })
      await buildAndSendTx(timelockMsg)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
        return
      }
      throw err
    }
  })

  it("build timeRelock tx and broadcast", async () => {
    try {
      const timerelockMsg = new TimeReLockMsg({
        address,
        time_lock_id: 2248,
        description: "timelock token test",
        amount: [
          {
            denom: "BNB",
            amount: 150000,
          },
        ],
        lock_time: Math.floor(Date.now() / 1000) + 100,
      })
      await buildAndSendTx(timerelockMsg)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
        return
      } else if (err.message.includes("Time lock does not exis")) {
        expect(1).toBeTruthy()
        return
      }
      throw err
    }
  })

  it("build timeunlock tx and broadcast", async () => {
    try {
      const timeUnlockMsg = new TimeUnlockMsg({
        address,
        time_lock_id: 2248,
      })
      await buildAndSendTx(timeUnlockMsg)
    } catch (err) {
      if (err.message.includes("insufficient fund")) {
        expect(1).toBeTruthy()
        return
      } else if (err.message.includes("Time lock does not exis")) {
        expect(1).toBeTruthy()
        return
      }
      throw err
    }
  })

  it("transfer from bc to bsc new", async () => {
    try {
      const toAddress = "0xFBC7c1f58DAb89a8eE702DB1CBB49363db42E497"
      const from = "tbnb1zzt7zg7j40cq0yy4ef2dx3nsns8csp4pgc4vd5"
      const transferOutMsg = new TransferOutMsg({
        from,
        to: toAddress,
        expire_time: Math.ceil(new Date().getTime() / 1000) + 60,
        amount: { denom: "BNB", amount: 0.1 },
      })

      await buildAndSendTx(
        transferOutMsg,
        "https://testnet-dex-atlantic.binance.org"
      )
    } catch (err) {
      console.error(err)
    }
  })

  it("stake migration", async () => {
    try {
      const transferOutMsg = new StakeMigrationMsg({
        validator_src_addr: "bva1pnww8kx30sz4xfcqvn8wjhrn796nf4dq77hcpa",
        validator_dst_addr: "0xAf581B49EA5B09d69D86A8eD801EF0cEdA33Ae34",
        delegator_addr: "0x4cE57E06a5408396ef94a887Dc00625D96343e69",
        refund_addr: "tbnb1wu4vw68fccdc3e9zppqy66t8l60azd66w7flka",
        amount: { denom: "BNB", amount: 100000000 },
      })

      console.log({ transferOutMsg })

      await buildAndSendTx(
        transferOutMsg,
        "https://testnet-dex-atlantic.binance.org"
      )
    } catch (err) {
      console.error(err)
    }
  })
})
