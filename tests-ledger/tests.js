/* global QUnit */

const { test } = QUnit

const LONG_TIMEOUT = 15000
const EXPECTED_MAJOR = 1
const EXPECTED_MINOR = 0
const EXPECTED_PATCH = 1

let app
let response

const getApp = async function(timeout = LONG_TIMEOUT) {
  let Ledger, isBrowser

  // tests support both browser and node. find out which we're in
  if (typeof window !== "undefined") {
    isBrowser = true
    Ledger = window.Ledger
  } else {
    isBrowser = false // is node.js
    Ledger = require("../src/ledger/index")
  }

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

QUnit.module("PUBLIC_KEY_SECP256K1", {
  before: async function() {
    try {
      const hdPath = [44, 714, 0, 0, 0]
      response = await app.publicKeySecp256k1(hdPath)
      console.log(response)
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
  assert.equal(response.pk.length, 64, "Passed")
})

// PUBLIC_KEY_SECP256K1 (bad hdPath throws)

let badPkErrored, badPkErrorMsg
QUnit.module("PUBLIC_KEY_SECP256K1", {
  before: async function() {
    try {
      const hdPath = [44] // TOO SHORT
      response = await app.publicKeySecp256k1(hdPath)
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
  assert.equal(badPkErrorMsg, "Invalid path.", "Error message is 'Invalid path.'")
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
QUnit.module("SIGN_SECP256K1", {
  before: async function() {
    try {
      // INCORRECT JSON in this tx (data is before chain_id, which is not the correct sort order.)
      // eslint-disable-next-line quotes
      const txMsg = `{"account_number":1,"data":"ABCD","chain_id":"bnbchain","memo":"memo","msgs":["msg"],"sequence":1,"source":1}`
      response = await app.signSecp256k1(txMsg)
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
  assert.equal(badTxErrorCode, 0x6A80, "Status code is 0x6A80")
})

// SIGN_SECP256K1 (good tx)

QUnit.module("SIGN_SECP256K1", {
  before: async function() {
    try {
      // this tx msg is a real BNC TX (no fee, with source and data)
      // eslint-disable-next-line quotes
      const txMsg = `{"account_number":"12","chain_id":"chain-bnb","data":null,"memo":"","msgs":[{"id":"BA36F0FAD74D8F41045463E4774F328F4AF779E5-4","ordertype":2,"price":1600000000,"quantity":100000000,"sender":"bnc1hgm0p7khfk85zpz5v0j8wnej3a90w7098fpxyh","side":1,"symbol":"NNB-338_BNB","timeinforce":1}],"sequence":"3","source":"1"}`
      const hdPath = [44, 714, 0, 0, 0]
      // app = await getApp(LONG_TIMEOUT)
      response = await app.signSecp256k1(txMsg, hdPath)
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

test("signature is the correct size", function(assert) {
  assert.ok(
    response.signature.length === 70 || response.signature.length === 71,
    "Passed"
  )
})

// SIGN_SECP256K1 (good tx with data)

QUnit.module("SIGN_SECP256K1", {
  before: async function() {
    try {
      // this tx msg follows the BNC structure (no fee, + source and data)
      // eslint-disable-next-line quotes
      const txMsg = `{"account_number":1,"chain_id":"bnbchain","data":"ABCD","memo":"memo","msgs":["msg"],"sequence":1,"source":1}`
      const hdPath = [44, 714, 0, 0, 0]
      // app = await getApp(LONG_TIMEOUT)
      response = await app.signSecp256k1(txMsg, hdPath)
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

test("signature is the correct size", function(assert) {
  assert.ok(
    response.signature.length === 70 || response.signature.length === 71,
    "Passed"
  )
})
