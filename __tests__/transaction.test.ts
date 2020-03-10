import { TxAminoPrefix, StdSignMsg, Msg } from "../src/types/stdTx"
// import { NewOrderMsg } from "../src/types/msg"
import { NewOrderMsg, NewOrder } from "../src/types/newOrder"
import Transaction from "../src/tx"
import * as crypto from "../src/crypto"

const mnemonic =
  "offer caution gift cross surge pretty orange during eye soldier popular holiday mention east eight office fashion ill parrot vault rent devote earth cousin"

describe("Transaction", () => {
  it("build placeOrder tx", () => {
    const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
    const address = crypto.getAddressFromPrivateKey(privateKey)

    const newOrder: NewOrder = {
      id: "BA36F0FAD74D8F41045463E4774F328F4AF779E5-2554",
      symbol: "BNB_BTC.B-918",
      ordertype: 2,
      side: 2,
      price: 2200400,
      quantity: 100000000,
      timeinforce: 1
    }

    const newOrderMsg: NewOrderMsg = new NewOrderMsg(newOrder, address)

    const data: StdSignMsg = {
      chainId: "Binance-Chain-Nile",
      accountNumber: 32550,
      sequence: 2553,
      msg: newOrderMsg,
      memo: "",
      source: 1
    }

    const tx = new Transaction(data)
    const txBytes = tx.sign(privateKey).serialize()
    console.log(txBytes)
  })
})
