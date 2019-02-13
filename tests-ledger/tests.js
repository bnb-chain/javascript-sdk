/* global QUnit */

const { test } = QUnit

const LONG_TIMEOUT = 15000
const EXPECTED_MAJOR = 1
const EXPECTED_MINOR = 0
const EXPECTED_PATCH = 0

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

const getApp = async function(timeout = LONG_TIMEOUT) {
  const transClass = isBrowser ? Ledger.transports.u2f : Ledger.transports.node
  const transport = await transClass.create(timeout)
  app = new Ledger.app(transport)

  return app
}

// init connection

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

// GET_VERSION

QUnit.module("GET_VERSION", {
  before: async function() {
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
  assert.ok(response.major === EXPECTED_MAJOR, "Passed")
  assert.ok(response.minor === EXPECTED_MINOR, "Passed")
  assert.ok(response.patch === EXPECTED_PATCH, "Passed")
})

// PUBLIC_KEY_SECP256K1

let pubKey
QUnit.module("PUBLIC_KEY_SECP256K1", {
  before: async function() {
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

// PUBLIC_KEY_SECP256K1 (bad hdPath throws)

let badPkErrored, badPkErrorMsg
QUnit.module("PUBLIC_KEY_SECP256K1", {
  before: async function() {
    try {
      const hdPath = [44] // TOO SHORT
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

test("error message is 'Invalid path.'", function(assert) {
  assert.equal(
    badPkErrorMsg,
    "Invalid path.",
    "Error message is 'Invalid path.'"
  )
})

// SIGN CHUNKS

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

// SIGN_SECP256K1 (bad tx throws)

let badTxErrored, badTxErrorCode
QUnit.module("SIGN_SECP256K1 - bad tx", {
  before: async function() {
    try {
      // INCORRECT JSON in this tx (data is before chain_id, which is not the correct sort order.)
      // eslint-disable-next-line quotes
      const signBytes = `{"account_number":1,"data":"ABCD","chain_id":"bnbchain","memo":"smiley!☺","msgs":["msg"],"sequence":1,"source":1}`
      response = await app.sign(signBytes)
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

// SIGN_SECP256K1 (good tx)

QUnit.module("SIGN_SECP256K1 - good tx", {
  before: async function() {
    try {
      // this tx msg is a real BNC TX (no fee, with source and data)
      // eslint-disable-next-line quotes
      const signBytes = `{"account_number":"12","chain_id":"bnbchain","data":null,"memo":"smiley!☺","msgs":[{"id":"BA36F0FAD74D8F41045463E4774F328F4AF779E5-4","ordertype":2,"price":1612345678,"quantity":123456,"sender":"bnc1hgm0p7khfk85zpz5v0j8wnej3a90w7098fpxyh","side":1,"symbol":"NNB-338_BNB","timeinforce":1}],"sequence":"3","source":"1"}`
      const hdPath = [44, 714, 0, 0, 0]
      // app = await getApp(LONG_TIMEOUT)
      response = await app.sign(signBytes, hdPath)
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

// SIGN_SECP256K1 (good multi-send tx with data)

// this tx msg follows the BNC structure (no fee, + source and data)
// eslint-disable-next-line quotes
const signBytes = `{"account_number":"12","chain_id":"chain-bnb","data":"DATASTUFF","memo":"MEMOSTUFF","msgs":[{"inputs":[{"address":"bnc1hgm0p7khfk85zpz5v0j8wnej3a90w7098fpxyh","coins":[{"amount":200000000,"denom":"BNB"},{"amount":2000000,"denom":"NNB-0AB"}]}],"outputs":[{"address":"bnc1cku54wwn66w2rkgs3h6v5zxrwtzyew8chcl720","coins":[{"amount":200000000,"denom":"BNB"}]},{"address":"bnc1cku54wwn66w2rkgs3h6v5zxrwtzyew8chcl720","coins":[{"amount":2000000,"denom":"NNB-0AB"}]}]}],"sequence":"64","source":"1"}`
QUnit.module("SIGN_SECP256K1 - good multi-send tx with data", {
  before: async function() {
    try {
      const hdPath = [44, 714, 0, 0, 0]
      // app = await getApp(LONG_TIMEOUT)
      response = await app.sign(signBytes, hdPath)
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
