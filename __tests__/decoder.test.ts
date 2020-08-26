import * as amino from "../src/amino"
import { unMarshalBinaryLengthPrefixed } from "../src/amino"
import { AminoPrefix, StdTx, SendMsg } from "../src/types/"

class Msg {
  constructor(opts) {
    opts = opts || {}
    this.string = opts.address || ""
    this.buf = opts.buf || Buffer.alloc(0)
    this.price = opts.price || 0
    this.bool = opts.timeinforce || false
    this.quantity = opts.quantity || 0
    this.coin = []
  }
}

Msg.prototype.msgType = AminoPrefix.NewOrderMsg

describe("decoder", () => {
  it("decode type", () => {
    const opt = {
      address: "tbnb1l6vgk5yyxcalm06gdsg55ay4pjkfueazkvwh58",
      buf: Buffer.from("1213"),
      price: 100000000,
      timeinforce: true,
      quantity: 0,
      coins: [
        {
          denom: "BNB",
          amount: 1000000000,
        },
      ],
      aminoPrefix: AminoPrefix.NewOrderMsg,
    }

    const msgObj = new Msg(opt)

    const result = new Msg()

    let bytes = amino.marshalBinary(msgObj)
    bytes = Buffer.from(bytes, "hex")
    amino.unMarshalBinaryLengthPrefixed(bytes, result)
    expect(JSON.stringify(result)).toBe(JSON.stringify(msgObj))
  })
})
