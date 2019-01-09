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

const CLA = 0x55
const ACCEPT_STATUSES = [0x9000] // throws if not
const INS_GET_VERSION = 0x00
const INS_PUBLIC_KEY_SECP256K1 = 0x01
const INS_SIGN_SECP256K1 = 0x02

class LedgerApp {
  constructor(transport) {
    this.transport = transport
    this.transport.setScrambleKey("CSM")
  }

  async getVersion() {
    const result = {}
    let apduResponse = await this.transport.send(
      CLA, INS_GET_VERSION, 0, 0, Buffer.alloc(0), ACCEPT_STATUSES)
    apduResponse = Buffer.from(apduResponse, "hex")
    const returnCode = apduResponse.slice(-2)
    result["test_mode"] = apduResponse[0] !== 0
    result["major"] = apduResponse[1]
    result["minor"] = apduResponse[2]
    result["patch"] = apduResponse[3]
    result["return_code"] = returnCode[0] * 256 + returnCode[1]
    return result
  }

  async publicKeySecp256k1() {
    const result = {}
    let apduResponse = await this.transport.send(
      CLA, INS_PUBLIC_KEY_SECP256K1, 0, 0, Buffer.alloc(0), ACCEPT_STATUSES)
    apduResponse = Buffer.from(apduResponse, "hex")
    const returnCode = apduResponse.slice(-2)
    result["pk"] = apduResponse.slice(0, 65)
    result["return_code"] = returnCode[0] * 256 + returnCode[1]
    return result
  }

  async signSecp256k1(txHex) {
    const result = {}
    let apduResponse = await this.transport.send(
      CLA, INS_SIGN_SECP256K1, 0, 0, Buffer.from(txHex, "hex"), ACCEPT_STATUSES)
    apduResponse = Buffer.from(apduResponse, "hex")
    const returnCode = apduResponse.slice(-2)
    result["sig"] = apduResponse.slice(0, 64)
    result["return_code"] = returnCode[0] * 256 + returnCode[1]
    return result
  }
}

module.exports = LedgerApp
