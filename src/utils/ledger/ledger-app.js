/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *   (c) 2018 ZondaX GmbH
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

"use strict";

var LedgerApp = function(comm) {
  this.comm = comm;
  this.comm.setScrambleKey("CSM");
};

const CLA = 0x55;
const INS_GET_VERSION = 0x00;

function serialize(CLA, INS, p1 = 0, p2 = 0, data = null) {
  let size = 5;
  if (data != null) {
    if (data.length > 255) {
      throw new Error("maximum data size = 255");
    }
    size += data.length;
  }
  let buffer = Buffer.alloc(size);

  buffer[0] = CLA;
  buffer[1] = INS;
  buffer[2] = p1;
  buffer[3] = p2;
  buffer[4] = 0;

  if (data != null) {
    buffer[4] = data.length;
    buffer.set(data, 5);
  }

  return buffer;
}

LedgerApp.prototype.get_version = function() {
  var buffer = serialize(CLA, INS_GET_VERSION, 0, 0);

  return this.comm
    .exchange(buffer.toString("hex"), [0x9000])
    .then(function(apduResponse) {
      var result = {};
      apduResponse = Buffer.from(apduResponse, "hex");
      let error_code_data = apduResponse.slice(-2);
      result["test_mode"] = apduResponse[0] !== 0;
      result["major"] = apduResponse[1];
      result["minor"] = apduResponse[2];
      result["patch"] = apduResponse[3];
      result["return_code"] = error_code_data[0] * 256 + error_code_data[1];
      return result;
    });
};

module.exports = LedgerApp;
