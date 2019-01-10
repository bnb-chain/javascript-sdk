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
  app = new Ledger.App(transport)

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

test("return_code is 0x9000", function(assert) {
  assert.ok(response.return_code === 0x9000, "Passed")
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
      const hdPath = [44, 118, 0, 0, 0]
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

test("return_code is 0x9000", function(assert) {
  assert.ok(response.return_code === 0x9000, "Passed")
})

test("has property pk", function(assert) {
  assert.ok(response.pk !== undefined, "Passed")
})

test("pk is the correct size", function(assert) {
  assert.equal(response.pk.length, 64, "Passed")
})

// SIGN CHUNKS

let chunks
QUnit.module("SIGN CHUNKS", {
  before: async function() {
    try {
      const hdPath = [44, 118, 0, 0, 0]
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

// SIGN_SECP256K1

QUnit.module("SIGN_SECP256K1", {
  before: async function() {
    try {
      // eslint-disable-next-line quotes
      const txMsg = `{"account_number":1,"chain_id":"bnbchain","fee":{"amount":[],"gas":0},"memo":"","msgs":["msg"],"sequence":1}`
      const hdPath = [44, 118, 0, 0, 0]
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

test("return_code is 0x9000", function(assert) {
  assert.ok(response.return_code === 0x9000, "Passed")
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
