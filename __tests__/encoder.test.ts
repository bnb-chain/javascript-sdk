import { amino } from "../src/"
import { AminoPrefix } from "../src/types/"

describe("encoder", () => {
  it("encode time", () => {
    let encodedTime = amino.encodeTime("1973-11-29T21:33:09.123456789Z")
    expect(encodedTime.toString('hex')).toBe("0915cd5b07000000001515cd5b07")
  })

  it("encode number", () => {
    let encodedNumber = amino.encodeNumber(100000)
    encodedNumber = encodedNumber.toString("hex")
    expect(encodedNumber).toBe("a08d06")
  })

  it("encode negtive number", () => {
    expect(() => {
      amino.encodeNumber(-100000)
    }).toThrow()
  })

  it("encode big number", () => {
    let encodedNumber = amino.encodeNumber(Math.pow(10, 18))
    encodedNumber = encodedNumber.toString("hex")
    expect(encodedNumber).toBe("808090bbbad6adf00d")
  })

  it("UVarInt", () => {
    let encodedNumber = amino.UVarInt.encode(17)
    encodedNumber = encodedNumber.toString("hex")
    expect(encodedNumber).toBe("11")
  })

  it("encode bool", () => {
    let encodedTrue = amino.encodeBool(true)
    encodedTrue = encodedTrue.toString("hex")
    expect(encodedTrue).toBe("01")

    let encodedFalse = amino.encodeBool(false)
    encodedFalse = encodedFalse.toString("hex")
    expect(encodedFalse).toBe("00")
  })

  it("encode string", () => {
    const str = "You are beautiful"
    let encodedString = amino.encodeString(str)
    expect(encodedString.toString("hex")).toBe("11596f75206172652062656175746966756c")
  })

  it("convertObjectToSignBytes", () => {
    // unsorted, expect convertObjectToSignBytes to sort it
    const jsonObj = {
      sender: 2,
      symbol: 3,
      zlast: [
        { z: "z", a: "z" },
        { z: "a", a: "z" }
      ],
      address: 1
    }
    const str = amino.convertObjectToSignBytes(jsonObj)
    expect(str.toString()).toBe(
      '{"address":1,"sender":2,"symbol":3,"zlast":[{"a":"z","z":"z"},{"a":"z","z":"a"}]}'
    )
  })

  it("marshalBinary", () => {
    const stdTx = {
      msg: [
        {
          sender: Buffer.from([
            182,
            86,
            29,
            204,
            16,
            65,
            48,
            5,
            154,
            124,
            8,
            244,
            140,
            100,
            97,
            12,
            31,
            111,
            144,
            100
          ]),
          id: "B6561DCC104130059A7C08F48C64610C1F6F9064-11",
          symbol: "BTC-5C4_BNB",
          ordertype: 2,
          side: 1,
          price: 100000000,
          quantity: 1200000000,
          timeinforce: 1
          aminoPrefix: AminoPrefix.NewOrderMsg
        }
      ],
      signatures: [
        {
          pub_key: Buffer.from([
            235,
            90,
            233,
            135,
            33,
            3,
            186,
            245,
            61,
            20,
            36,
            248,
            234,
            131,
            208,
            58,
            130,
            246,
            209,
            87,
            181,
            64,
            28,
            78,
            165,
            127,
            251,
            131,
            23,
            135,
            46,
            21,
            161,
            159,
            201,
            183,
            173,
            123
          ]),
          signature: Buffer.from([
            231,
            154,
            102,
            6,
            210,
            140,
            240,
            123,
            156,
            198,
            245,
            102,
            181,
            36,
            165,
            40,
            43,
            19,
            190,
            204,
            195,
            22,
            35,
            118,
            199,
            159,
            57,
            38,
            32,
            201,
            90,
            68,
            123,
            25,
            246,
            78,
            118,
            30,
            34,
            167,
            163,
            188,
            49,
            26,
            120,
            14,
            125,
            159,
            221,
            82,
            30,
            47,
            126,
            222,
            194,
            83,
            8,
            197,
            186,
            198,
            170,
            28,
            10,
            49
          ]),
          account_number: 1,
          sequence: 10
        }
      ],
      memo: "",
      aminoPrefix: AminoPrefix.StdTx
    }

    const bytes = amino.marshalBinary(stdTx)
    expect(bytes).toBe(
      "db01f0625dee0a65ce6dc0430a14b6561dcc104130059a7c08f48c64610c1f6f9064122b423635363144434331303431333030353941374330384634384336343631304331463646393036342d31311a0b4254432d3543345f424e42200228013080c2d72f3880989abc044001126e0a26eb5ae9872103baf53d1424f8ea83d03a82f6d157b5401c4ea57ffb8317872e15a19fc9b7ad7b1240e79a6606d28cf07b9cc6f566b524a5282b13beccc3162376c79f392620c95a447b19f64e761e22a7a3bc311a780e7d9fdd521e2f7edec25308c5bac6aa1c0a311801200a"
    )
  })
})
