"use strict";
/********************************************************************************
 *   Binance Chain Ledger App Interface
 *   (c) 2018-2019 Binance
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
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ledger_app_1 = tslib_1.__importDefault(require("./ledger-app"));
// intentionally ambiguous to confuse webpack (we don't need this in web builds)
var LEDGER_NODE_HID_TRANSPORT_MODULE = "@ledgerhq/hw-transport-node-hid";
var isBrowser = typeof window !== "undefined";
// const Ledger  = module.exports
var Ledger = {
    app: ledger_app_1.default,
    LedgerApp: ledger_app_1.default,
    transports: {
        u2f: require("@ledgerhq/hw-transport-u2f").default,
        wble: require("@ledgerhq/hw-transport-web-ble").default,
        // requiring the node transport in the browser causes a bit of an issue with webpack! this is a conditional require
        node: !isBrowser && moduleExists(LEDGER_NODE_HID_TRANSPORT_MODULE)
            ? require(LEDGER_NODE_HID_TRANSPORT_MODULE).default
            : null
    }
};
Ledger.transports = module.exports = Ledger;
exports.default = Ledger;
function moduleExists(name) {
    try {
        return require.resolve(name);
    }
    catch (e) {
        return false;
    }
}
//# sourceMappingURL=index.js.map