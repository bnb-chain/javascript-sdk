/* global QUnit */

let Ledger;
let isBrowser;

if (typeof window !== "undefined") {
  isBrowser = true
  Ledger = window.Ledger
} else {
  isBrowser = false // is node.js
  Ledger = require("../src/ledger/index")
}

const TIMEOUT = 1000;
const EXPECTED_MAJOR = 0;
const EXPECTED_MINOR = 1;
const EXPECTED_PATCH = 1;

let response;

QUnit.begin(async function() {
  console.log("Attempting to connect to hardware wallet, please ensure that it is plugged in and the app is open.")
  console.log("If the device is not connected or the app is not open, exit and rerun this test when it is.")
  try {
    const transClass = isBrowser ? Ledger.Transports.u2f : Ledger.Transports.node
    const transport = await transClass.create(TIMEOUT)
    let app = new Ledger.App(transport)
    const version = await app.getVersion()
    response = version
    console.log(response)
  } catch (err) {
    console.error("Unable to connect to hardware wallet. Please connect it and open the app.", err)
  }
})

QUnit.test("return_code is 0x9000", function(assert) {
  assert.ok(response.return_code === 0x9000, "Passed")
})

QUnit.test("has property test_mode", function(assert) {
  assert.ok(response.test_mode !== undefined, "Passed")
})

QUnit.test("has property major", function(assert) {
  assert.ok(response.major !== undefined, "Passed")
})

QUnit.test("has property minor", function(assert) {
  assert.ok(response.minor !== undefined, "Passed")
})

QUnit.test("has property patch", function(assert) {
  assert.ok(response.patch !== undefined, "Passed")
})

QUnit.test("test_mode is enabled", function(assert) {
  assert.ok(response.test_mode, "Passed")
})

QUnit.test("app has matching version", function(assert) {
  assert.ok(response.major === EXPECTED_MAJOR, "Passed")
  assert.ok(response.minor === EXPECTED_MINOR, "Passed")
  assert.ok(response.patch === EXPECTED_PATCH, "Passed")
})
