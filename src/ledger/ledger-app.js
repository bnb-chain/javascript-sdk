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

var LedgerApp = function(transport) {
  this.transport = transport
  this.transport.setScrambleKey("CSM")
};

const CLA = 0x55
const INS_GET_VERSION = 0x00
const ACCEPT_STATUSES = [0x9000]

LedgerApp.prototype.get_version = async function() {
  const result = {};
  let apduResponse = await this.transport.send(
    CLA, INS_GET_VERSION, 0, 0, Buffer.alloc(0), ACCEPT_STATUSES)
  apduResponse = Buffer.from(apduResponse, "hex")
  let error_code_data = apduResponse.slice(-2)
  result["test_mode"] = apduResponse[0] !== 0
  result["major"] = apduResponse[1]
  result["minor"] = apduResponse[2]
  result["patch"] = apduResponse[3]
  result["return_code"] = error_code_data[0] * 256 + error_code_data[1]
  return result
}

module.exports = LedgerApp
