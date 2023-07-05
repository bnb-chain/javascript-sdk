/********************************************************************************
 *   BNB Beacon Chain Ledger App Interface
 *   (c) 2018-2019 All BNB Chain Developers
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/
/* eslint-disable*/
import ledgerApp from "./ledger-app"

// intentionally ambiguous to confuse webpack (we don't need this in web builds)
const LEDGER_NODE_HID_TRANSPORT_MODULE = "@ledgerhq/hw-transport-node-hid"

const isBrowser = typeof window !== "undefined"
// const Ledger  = module.exports

const Ledger: any = {
  app: ledgerApp,
  LedgerApp: ledgerApp,
  transports: {
    u2f: require("@ledgerhq/hw-transport-u2f").default,
    wble: require("@ledgerhq/hw-transport-web-ble").default,

    // requiring the node transport in the browser causes a bit of an issue with webpack! this is a conditional require
    node:
      !isBrowser && moduleExists(LEDGER_NODE_HID_TRANSPORT_MODULE)
        ? require(LEDGER_NODE_HID_TRANSPORT_MODULE).default
        : null,
  },
}

module.exports = Ledger

export default Ledger

function moduleExists(name: string) {
  try {
    return require.resolve(name)
  } catch (e) {
    return false
  }
}
