import * as decoder  from "../src/decoder/"
import * as encoder from "../src/encoder/"
import { Token, TokenOfList } from "../src/decoder/types"
// import { UVarInt } from '../src/encoder/varint'
// import { string, bytes, varint } from "protocol-buffers-encodings"

class Msg {
  constructor(opts){
    opts = opts || {}
    this.string = opts.address || ''
    this.buf = opts.buf || Buffer.alloc(0)
    this.price = opts.price || 0
    this.bool = opts.timeinforce || false
    this.quantity = opts.quantity || 0
    // this.coin = []
  }
}

Msg.prototype.msgType = 'NewOrderMsg'

describe("decoder", () => {

  it("decode type", ()=>{
    const opt = {
      "address": "tbnb1l6vgk5yyxcalm06gdsg55ay4pjkfueazkvwh58",
      "buf": Buffer.from('1213'),
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

  it("decode array", ()=>{
    const msg =  [{
        "denom": "BTC12åå",
        "amount": 50
      }, {
        "denom": "BTC",
        "amount": 50
      }]

    // const tokenInfo = new Token()
    // const result =  [{
    //   "denom": "",
    //   "amount": 0
    // }]
    const result = [new TokenOfList()]

    // let bytes = encoder.marshalBinary(msg)
    // console.log(bytes)
    // // bytes = Buffer.from('gAEKQwoVYmluYW5jZSBjb2luIG9mIGhlIHlpEgcwMDAtQTNBGgMwMDAggMivoCUqFJFls/MUrDG8xFq1v6hOUulTb8jPMAEKOQoLVHJpcGxlIFplcm8SBzAwMC1FRjYaAzAwMCCAwMrzhKMCKhQkCDzhQrFGR3Fv94D3gJsIxw6wpg==', 'base64')
    // bytes = Buffer.from(bytes, 'hex')
    const bytes = Buffer.from('80010a430a1562696e616e636520636f696e206f6620686520796912073030302d4133411a033030302080c8afa0252a149165b3f314ac31bcc45ab5bfa84e52e9536fc8cf30010a390a0b547269706c65205a65726f12073030302d4546361a033030302080c0caf384a3022a1424083ce142b14647716ff780f7809b08c70eb0a6', 'hex')
    // console.log(bytes)
    const { val } = decoder.unMarshalBinaryLengthPrefixed(bytes, result)
    console.log(val)
  })
})