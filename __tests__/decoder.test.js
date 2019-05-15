import * as decoder  from "../src/decoder/"
import * as encoder from "../src/encoder/"

class Msg {
  constructor(opts){
    opts = opts || {}
    this.string = opts.address || ""
    this.buf = opts.buf || Buffer.alloc(0)
    this.price = opts.price || 0
    this.bool = opts.timeinforce || false
    this.quantity = opts.quantity || 0
    // this.coin = []
  }
}

Msg.prototype.msgType = "NewOrderMsg"

describe("decoder", () => {

  it("decode type", ()=>{
    const opt = {
      "address": "tbnb1l6vgk5yyxcalm06gdsg55ay4pjkfueazkvwh58",
      "buf": Buffer.from("1213"),
      "price": 100000000,
      "timeinforce": true,
      "quantity": 0,
      "coins": [{
        "denom": "BNB",
        "amount": 1000000000
      }],
      "msgType": "NewOrderMsg"
    }

    const msgObj = new Msg(opt)
    
    console.log(msgObj)
    const result = new Msg()

    let bytes = encoder.marshalBinary(msgObj)
    bytes = Buffer.from(bytes, "hex")
    decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    expect(JSON.stringify(result)).toBe(JSON.stringify(msgObj))
  })
})