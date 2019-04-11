/* global QUnit */

const { test } = QUnit

const LONG_TIMEOUT = 15000

const EXPECTED_VERSION_MAJOR = 1
const EXPECTED_VERSION_MINOR = 1

let isBrowser
let Ledger, crypto
let app, response

// tests support both browser and node. find out which we're in
if (typeof window !== "undefined") {
  isBrowser = true
  crypto = window.SDK.crypto
  Ledger = window.SDK.Ledger
  window.Buffer = Buffer.Buffer // it's polyfilled
} else {
  isBrowser = false // is node.js
  Ledger = require("../lib/ledger")
  crypto = require("../lib/crypto")
}

//#region Init Connection

const getApp = async function(timeout = LONG_TIMEOUT) {
  const transClass = isBrowser ? Ledger.transports.u2f : Ledger.transports.node
  const transport = await transClass.create(timeout)
  app = new Ledger.app(transport)

  return app
}

QUnit.begin(async function() {
  console.log(
    "Attempting to connect to hardware wallet, please ensure that it is plugged in and the app is open."
  )
  console.log(
    "If the device is not connected or the app is not open, exit and rerun this test when it is."
  )
  try {
    app = await getApp()
  } catch (err) {
    console.error(
      "Unable to connect to hardware wallet. Please connect it and open the app.",
      err
    )
  }
})

//#endregion

//#region GET_VERSION

QUnit.module("GET_VERSION", {
  before: async function() {
    response = {} // clear
    try {
      const version = await app.getVersion()
      response = version
      console.log(response)
    } catch (err) {
      console.error(
        "Error invoking GET_VERSION. Please connect it and open the app.",
        err
      )
    }
  }
})

test("status code is 0x9000", function(assert) {
  assert.equal(response.return_code, 0x9000, "Status code is 0x9000")
})

test("has property test_mode", function(assert) {
  assert.ok(response.test_mode !== undefined, "Passed")
})

test("has property major", function(assert) {
  assert.ok(response.major !== undefined, "Passed")
})

test("has property minor", function(assert) {
  assert.ok(response.minor !== undefined, "Passed")
})

test("has property patch", function(assert) {
  assert.ok(response.patch !== undefined, "Passed")
})

test("app has matching version", function(assert) {
  assert.ok(response.major === EXPECTED_VERSION_MAJOR, "Passed")
  assert.ok(response.minor === EXPECTED_VERSION_MINOR, "Passed")
})

//#endregion

//#region PUBLIC_KEY_SECP256K1

let pubKey
QUnit.module("PUBLIC_KEY_SECP256K1", {
  before: async function() {
    response = {} // clear
    try {
      const hdPath = [44, 714, 0, 0, 0]
      response = await app.getPublicKey(hdPath)
      console.log(response)
      pubKey = response.pk
    } catch (err) {
      console.error(
        "Error invoking PUBLIC_KEY_SECP256K1. Please connect it and open the app.",
        err
      )
    }
  }
})

test("status code is 0x9000", function(assert) {
  assert.equal(response.return_code, 0x9000, "Status code is 0x9000")
})

test("has property pk", function(assert) {
  assert.ok(response.pk !== undefined, "Passed")
})

test("pk is the correct size", function(assert) {
  assert.equal(response.pk.length, 1 + 64, "Passed") // 1 byte PK prefix
})

// the 0x04 prefix represents an uncompressed pubkey
// https://github.com/libbitcoin/libbitcoin-system/wiki/Elliptic-Curve-Operations#point-operations-on-the-elliptic-curve
test("pk is prefixed with 0x04", function(assert) {
  assert.equal(response.pk[0], 0x04, "Passed")
})

// the 0x9000 suffix was being incorrectly appended, this test checks that it's not there now
test("pk does not end in 0x9000", function(assert) {
  assert.notEqual(response.pk[response.pk.length - 2], 0x90, "Passed")
  assert.notEqual(response.pk[response.pk.length - 1], 0x00, "Passed")
})

//#endregion

//#region PUBLIC_KEY_SECP256K1 (bad hdPath throws #1)

let badPkErrored, badPkErrorMsg, badPkErrorCode
QUnit.module("PUBLIC_KEY_SECP256K1 - bad path 1", {
  before: async function() {
    response = {} // clear
    try {
      const hdPath = [44, 714, 0] // too short
      response = await app.getPublicKey(hdPath)
      badPkErrored = false
    } catch (err) {
      badPkErrored = true
      badPkErrorMsg = err.message
      badPkErrorCode = err.statusCode
    }
  }
})

test("did throw an error", function(assert) {
  assert.ok(badPkErrored, "Passed")
})

test("error message is 'Ledger device: UNKNOWN_ERROR (0x6984)'", function(assert) {
  assert.equal(
    badPkErrorMsg,
    "Ledger device: UNKNOWN_ERROR (0x6984)",
    "Error message is 'Ledger device: UNKNOWN_ERROR (0x6984)'"
  )
})

test("status code is 0x6984", function(assert) {
  assert.equal(badPkErrorCode, 0x6984, "Status code is 0x6984")
})

//#endregion

//#region PUBLIC_KEY_SECP256K1 (bad hdPath throws #2)

QUnit.module("PUBLIC_KEY_SECP256K1 - bad path 2", {
  before: async function() {
    response = {} // clear
    try {
      const hdPath = [44, 714, 0, 1, 0] // `change` node must be 0
      response = await app.getPublicKey(hdPath)
      badPkErrored = false
    } catch (err) {
      badPkErrored = true
      badPkErrorMsg = err.message
    }
  }
})

test("did throw an error", function(assert) {
  assert.ok(badPkErrored, "Passed")
})

test("error message is 'Ledger device: UNKNOWN_ERROR (0x6984)'", function(assert) {
  assert.equal(
    badPkErrorMsg,
    "Ledger device: UNKNOWN_ERROR (0x6984)",
    "Error message is 'Ledger device: UNKNOWN_ERROR (0x6984)'"
  )
})

test("status code is 0x6984", function(assert) {
  assert.equal(badPkErrorCode, 0x6984, "Status code is 0x6984")
})

//#endregion

//#region INS_SHOW_ADDR_SECP256K1 (index 0)

QUnit.module("INS_SHOW_ADDR_SECP256K1", {
  before: async function() {
    response = {} // clear
    try {
      const hdPath = [44, 714, 0, 0, 0]
      response = await app.showAddress("tbnb", hdPath)
      console.log(response)
    } catch (err) {
      console.error(
        "Error invoking INS_SHOW_ADDR_SECP256K1. Please connect it and open the app.",
        err
      )
    }
  }
})

test("status code is 0x9000", function(assert) {
  assert.equal(response.return_code, 0x9000, "Status code is 0x9000")
})

//#endregion

//#region INS_SHOW_ADDR_SECP256K1 (other index)

QUnit.module("INS_SHOW_ADDR_SECP256K1 - other index", {
  before: async function() {
    response = {} // clear
    try {
      const hdPath = [44, 714, 0, 0, 714]
      response = await app.showAddress("tbnb", hdPath)
      console.log(response)
    } catch (err) {
      console.error(
        "Error invoking INS_SHOW_ADDR_SECP256K1. Please connect it and open the app.",
        err
      )
    }
  }
})

test("status code is 0x9000", function(assert) {
  assert.equal(response.return_code, 0x9000, "Status code is 0x9000")
})

//#endregion

//#region INS_SHOW_ADDR_SECP256K1 (bad hdPath throws)

let badShowAddrErrored, badShowAddrErrorMsg, badShowAddrErrorCode
QUnit.module("INS_SHOW_ADDR_SECP256K1 - bad path", {
  before: async function() {
    response = {} // clear
    try {
      const hdPath = [44, 714, 0, 1, 0]
      response = await app.showAddress("tbnb", hdPath)
      console.log(response)
      badShowAddrErrored = false
    } catch (err) {
      badShowAddrErrored = true
      badShowAddrErrorMsg = err.message
      badShowAddrErrorCode = err.statusCode
      console.error(
        "Error invoking INS_SHOW_ADDR_SECP256K1. Please connect it and open the app.",
        err
      )
    }
  }
})

test("did throw an error", function(assert) {
  assert.ok(badShowAddrErrored, "Passed")
})

test("error message is 'Ledger device: UNKNOWN_ERROR (0x6984)'", function(assert) {
  assert.equal(
    badShowAddrErrorMsg,
    "Ledger device: UNKNOWN_ERROR (0x6984)",
    "Error message is 'Ledger device: UNKNOWN_ERROR (0x6984)'"
  )
})

test("status code is 0x6984", function(assert) {
  assert.equal(badShowAddrErrorCode, 0x6984, "Status code is 0x6984")
})

//#endregion

//#region INS_SHOW_ADDR_SECP256K1 (too long hrp throws)

QUnit.module("INS_SHOW_ADDR_SECP256K1 - hrp too long", {
  before: async function() {
    response = {} // clear
    try {
      response = await app.showAddress("tbnbxx")
      console.log(response)
      badShowAddrErrored = false
    } catch (err) {
      badShowAddrErrored = true
      badShowAddrErrorMsg = err.message
      badShowAddrErrorCode = err.statusCode
      console.error(
        "Error invoking INS_SHOW_ADDR_SECP256K1. Please connect it and open the app.",
        err
      )
    }
  }
})

test("did throw an error", function(assert) {
  assert.ok(badShowAddrErrored, "Passed")
})

test("error message is 'Ledger device: UNKNOWN_ERROR (0x6984)'", function(assert) {
  assert.equal(
    badShowAddrErrorMsg,
    "Ledger device: UNKNOWN_ERROR (0x6984)",
    "Error message is 'Ledger device: UNKNOWN_ERROR (0x6984)'"
  )
})

test("status code is 0x6984", function(assert) {
  assert.equal(badShowAddrErrorCode, 0x6984, "Status code is 0x6984")
})

//#endregion

//#region SIGN CHUNKS

let chunks
QUnit.module("SIGN CHUNKS", {
  before: async function() {
    try {
      const hdPath = [44, 714, 0, 0, 0]
      const msg = Buffer.alloc(1234)
      chunks = app._signGetChunks(msg, hdPath)
    } catch (err) {
      // bleh
      console.error("An error occurred while calling _signGetChunks")
    }
  }
})

test("number of chunks is 6", function(assert) {
  assert.equal(chunks.length, 6, "Got 6 chunks")
})

test("chunk 1 is derivation path", function(assert) {
  assert.equal(chunks[0].length, 1 + 5 * 4, "Chunk 0 contains 21 bytes")
})

test("chunk 2 is message", function(assert) {
  assert.equal(chunks[1].length, 250, "Chunk 1 contains 250 bytes")
})

test("chunk 3 is message", function(assert) {
  assert.equal(chunks[2].length, 250, "Chunk 2 contains 250 bytes")
})

test("chunk 4 is message", function(assert) {
  assert.equal(chunks[3].length, 250, "Chunk 3 contains 250 bytes")
})

test("chunk 5 is message", function(assert) {
  assert.equal(chunks[4].length, 250, "Chunk 4 contains 250 bytes")
})

test("chunk 6 is remainder of message", function(assert) {
  assert.equal(chunks[5].length, 234, "Chunk 5 contains 234 bytes")
})

//#endregion

//#region SIGN_SECP256K1 (good tx)

QUnit.module("SIGN_SECP256K1 - good tx", {
  before: async function() {
    response = {} // clear
    try {
      // this tx msg is a real BNC TX (no fee, with source and data)
      // eslint-disable-next-line quotes
      const signBytes = `{"account_number":"12","chain_id":"bnbchain","data":null,"memo":"smiley!☺","msgs":[{"id":"BA36F0FAD74D8F41045463E4774F328F4AF779E5-4","ordertype":2,"price":1612345678,"quantity":123456,"sender":"bnc1hgm0p7khfk85zpz5v0j8wnej3a90w7098fpxyh","side":1,"symbol":"NNB-338_BNB","timeinforce":3}],"sequence":"3","source":"1"}`
      const hdPathSign = [44, 714, 0, 0, 1]
      await app.getPublicKey(hdPathSign) // sets the last "viewed" hd path on the device
      response = await app.sign(signBytes, hdPathSign)
      console.log(response)
    } catch (err) {
      console.error(
        "Error invoking SIGN_SECP256K1. Please connect it and open the app.",
        err
      )
    }
  }
})

test("status code is 0x9000", function(assert) {
  assert.equal(response.return_code, 0x9000, "Status code is 0x9000")
})

test("has property signature", function(assert) {
  assert.ok(response.signature !== undefined, "Passed")
})

test("signature size is within range 64-65", function(assert) {
  assert.ok(
    64 <= response.signature.length && response.signature.length <= 65,
    "Passed"
  )
})

//#endregion

//#region SIGN_SECP256K1 (good multi-send tx with data)

// this tx msg follows the BNC structure (no fee, + source and data)
// eslint-disable-next-line quotes
const signBytes = `{"account_number":"12","chain_id":"chain-bnb","data":"DATASTUFF","memo":"MEMOSTUFF","msgs":[{"inputs":[{"address":"bnc1hgm0p7khfk85zpz5v0j8wnej3a90w7098fpxyh","coins":[{"amount":20012345678,"denom":"BNB"},{"amount":212345678,"denom":"NNB-0AB"},{"amount":1,"denom":"NNB-0AB"}]}],"outputs":[{"address":"bnc1cku54wwn66w2rkgs3h6v5zxrwtzyew8chcl720","coins":[{"amount":20012345678,"denom":"BNB"}]},{"address":"bnc1cku54wwn66w2rkgs3h6v5zxrwtzyew8chcl721","coins":[{"amount":212345678,"denom":"NNB-0AB"}]},{"address":"bnc1cku54wwn66w2rkgs3h6v5zxrwtzyew8chcl722","coins":[{"amount":1,"denom":"NNB-0AB"}]}]}],"sequence":"64","source":"1"}`
QUnit.module("SIGN_SECP256K1 - good multi-send tx with data", {
  before: async function() {
    response = {} // clear
    try {
      const hdPathSign = [44, 714, 0, 0, 0]
      await app.getPublicKey(hdPathSign) // sets the last "viewed" hd path on the device
      response = await app.sign(signBytes, hdPathSign)
      console.log(response)
    } catch (err) {
      console.error(
        "Error invoking SIGN_SECP256K1. Please connect it and open the app.",
        err
      )
    }
  }
})

test("status code is 0x9000", function(assert) {
  assert.equal(response.return_code, 0x9000, "Status code is 0x9000")
})

test("has property signature", function(assert) {
  assert.ok(response.signature !== undefined, "Passed")
})

test("signature size is within range 64-65", function(assert) {
  assert.ok(
    64 <= response.signature.length && response.signature.length <= 65,
    "Passed"
  )
})

test("signature passes verification", function(assert) {
  const sig = response.signature
  assert.ok(
    crypto.verifySignature(
      sig,
      Buffer.from(signBytes, "utf8").toString("hex"),
      pubKey.toString("hex")
    ),
    "Signature OK"
  )
})

//#endregion

//#region SIGN_SECP256K1 (bad tx throws)

let badTxErrored, badTxErrorCode
QUnit.module("SIGN_SECP256K1 - bad tx content", {
  before: async function() {
    response = {} // clear
    try {
      // INCORRECT JSON in this tx (data is before chain_id, which is not the correct sort order.)
      // eslint-disable-next-line quotes
      const signBytes = `{"account_number":1,"data":"ABCD","chain_id":"bnbchain","memo":"smiley!☺","msgs":["msg"],"sequence":1,"source":1}`
      response = {}
      const hdPathSign = [44, 714, 0, 0, 0]
      await app.getPublicKey(hdPathSign) // sets the last "viewed" hd path on the device
      response = await app.sign(signBytes, hdPathSign)
      badTxErrored = false
    } catch (err) {
      badTxErrored = true
      badTxErrorCode = err.statusCode
    }
  }
})

test("did throw an error", function(assert) {
  assert.ok(badTxErrored, "Passed")
})

test("status code is 0x6A80", function(assert) {
  assert.equal(badTxErrorCode, 0x6a80, "Status code is 0x6A80")
})

test("does not have property signature", function(assert) {
  assert.ok(response.signature === undefined, "Passed")
})

//#endregion

//#region SIGN_SECP256K1 (sign with different, vs the viewed, hd path throws)

let badSignHdPathErrored, badSignHdPathErrorCode
QUnit.module("SIGN_SECP256K1 - different prior hd path", {
  before: async function() {
    response = {} // clear
    try {
      // this tx msg is a real BNC TX (no fee, with source and data)
      // eslint-disable-next-line quotes
      const signBytes = `{"account_number":"12","chain_id":"bnbchain","data":null,"memo":"smiley!☺","msgs":[{"id":"BA36F0FAD74D8F41045463E4774F328F4AF779E5-4","ordertype":2,"price":1612345678,"quantity":123456,"sender":"bnc1hgm0p7khfk85zpz5v0j8wnej3a90w7098fpxyh","side":1,"symbol":"NNB-338_BNB","timeinforce":3}],"sequence":"3","source":"1"}`
      const hdPathView = [44, 714, 0, 0, 1]
      await app.getPublicKey(hdPathView)
      const hdPathSign = [44, 714, 0, 0, 0]
      response = await app.sign(signBytes, hdPathSign)
      console.log(response)
      badSignHdPathErrored = false
    } catch (err) {
      badSignHdPathErrored = true
      badSignHdPathErrorCode = err.statusCode
      console.error(
        "Error invoking SIGN_SECP256K1. Please connect it and open the app.",
        err
      )
    }
  }
})

test("did throw an error", function(assert) {
  assert.ok(badSignHdPathErrored, "Passed")
})

test("status code is 0x6984", function(assert) {
  assert.equal(badSignHdPathErrorCode, 0x6984, "Status code is 0x6984")
})

test("does not have property signature", function(assert) {
  assert.ok(response.signature === undefined, "Passed")
})

//#endregion
