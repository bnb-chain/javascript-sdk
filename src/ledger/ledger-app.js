/********************************************************************************
 *   Binance Chain Ledger App Interface
 *   (c) 2018-2019 Binance
 *   (c) 2018 ZondaX GmbH
 *   (c) 2016-2017 Ledger
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

// The general structure of commands and responses is as follows:

// #### Commands

// | Field   | Type     | Content                | Note |
// |:------- |:-------- |:---------------------- | ---- |
// | CLA     | byte (1) | Application Identifier | 0x55 |
// | INS     | byte (1) | Instruction ID         |      |
// | P1      | byte (1) | Parameter 1            |      |
// | P2      | byte (1) | Parameter 2            |      |
// | L       | byte (1) | Bytes in payload       |      |
// | PAYLOAD | byte (L) | Payload                |      |

// #### Response

// | Field   | Type     | Content     | Note                     |
// | ------- | -------- | ----------- | ------------------------ |
// | ANSWER  | byte (?) | Answer      | depends on the command   |
// | SW1-SW2 | byte (2) | Return code | see list of return codes |

const CLA = 0x55
const ACCEPT_STATUSES = [0x9000] // throws if not
const CHUNK_SIZE = 250
const INS_GET_VERSION = 0x00
const INS_PUBLIC_KEY_SECP256K1 = 0x01
const INS_SIGN_SECP256K1 = 0x02

class LedgerApp {
  constructor(transport) {
    this._transport = transport
    this._transport.setScrambleKey("CSM")
  }

  _serialize(CLA, INS, p1 = 0, p2 = 0, data = null) {
    let size = 5
    if (data != null) {
      if (data.length > 255) {
        throw new Error("maximum data size = 255")
      }
      size += data.length
    }
    let buffer = Buffer.alloc(size)

    buffer[0] = CLA
    buffer[1] = INS
    buffer[2] = p1
    buffer[3] = p2
    buffer[4] = 0

    if (data != null) {
      buffer[4] = data.length
      buffer.set(data, 5)
    }

    return buffer
  }

  _serializeHdPath(path) {
    if (path == null || path.length < 3) {
      throw new Error("Invalid path.")
    }
    if (path.length > 10) {
      throw new Error("Invalid path. Length should be <= 10")
    }
    let buf = Buffer.alloc(1 + 4 * path.length)
    buf.writeUInt8(path.length)
    for (let i = 0; i < path.length; i++) {
      let v = path[i]
      if (i < 3) {
        v |= 0x80000000 // Harden
      }
      buf.writeInt32LE(v, 1 + i * 4)
    }
    return buf
  }

  _errorMessage(code) {
    switch (code) {
      case 14:
        return "Timeout"
      case 0x9000:
        return "No errors"
      case 0x9001:
        return "Device is busy"
      case 0x6400:
        return "Execution Error"
      case 0x6700:
        return "Wrong Length"
      case 0x6982:
        return "Empty Buffer"
      case 0x6983:
        return "Output buffer too small"
      case 0x6984:
        return "Data is invalid"
      case 0x6985:
        return "Conditions not satisfied"
      case 0x6986:
        return "Command not allowed"
      case 0x6a80:
        return "Bad key handle"
      case 0x6b00:
        return "Invalid P1/P2"
      case 0x6d00:
        return "Instruction not supported"
      case 0x6e00:
        return "CLA not supported"
      case 0x6f00:
        return "Unknown error"
      case 0x6f01:
        return "Sign/verify error"
      default:
        return "Unknown error code"
    }
  }

  /* GET_VERSION */

  // #### Payload

  // | Field | Type     | Content                | Expected |
  // | ----- | -------- | ---------------------- | -------- |
  // | CLA   | byte (1) | Application Identifier | 0x55     |
  // | INS   | byte (1) | Instruction ID         | 0x00     |
  // | P1    | byte (1) | Parameter 1            | ignored  |
  // | P2    | byte (1) | Parameter 2            | ignored  |
  // | L     | byte (1) | Bytes in payload       | 0        |

  // #### Response

  // | Field   | Type     | Content       | Note                            |
  // | ------- | -------- | ------------- | ------------------------------- |
  // | CLA     | byte (1) | Test Mode     | 0xFF means test mode is enabled |
  // | MAJOR   | byte (1) | Version Major |                                 |
  // | MINOR   | byte (1) | Version Minor |                                 |
  // | PATCH   | byte (1) | Version Patch |                                 |
  // | SW1-SW2 | byte (2) | Return code   | see list of return codes        |

  async getVersion() {
    const result = {}
    try {
      let apduResponse = await this._transport.send(
        CLA,
        INS_GET_VERSION,
        0,
        0,
        Buffer.alloc(0),
        ACCEPT_STATUSES
      )
      apduResponse = Buffer.from(apduResponse, "hex")
      const returnCode = apduResponse.slice(-2)
      result["test_mode"] = apduResponse[0] !== 0
      result["major"] = apduResponse[1]
      result["minor"] = apduResponse[2]
      result["patch"] = apduResponse[3]
      result["return_code"] = returnCode[0] * 256 + returnCode[1]
      result["error_message"] = this._errorMessage(result["return_code"])
    } catch (err) {
      const { statusCode, statusText, message, stack } = err
      console.warn("Ledger getVersion error:",
        this._errorMessage(statusCode), message, statusText, stack)
      throw err
    }
    return result
  }

  /* PUBLIC_KEY_SECP256K1 */

  // #### Payload

  // | Field | Type     | Content                 | Expected |
  // | ----- | -------- | ----------------------  | -------- |
  // | CLA   | byte (1) | Application Identifier  | 0x55     |
  // | INS   | byte (1) | Instruction ID          | 0x01     |
  // | P1    | byte (1) | Parameter 1             | ignored  |
  // | P2    | byte (1) | Parameter 2             | ignored  |
  // | L     | byte (1) | Bytes in payload        | (depends) |
  // | PL    | byte (1) | Derivation Path Length  | 3<=PL<=10 |
  // | Path[0] | byte (4) | Derivation Path Data    | 44 |
  // | Path[1] | byte (4) | Derivation Path Data    | 118 |
  // | ..  | byte (4) | Derivation Path Data    |  |
  // | Path[PL-1]  | byte (4) | Derivation Path Data    |  |

  // First three items in the derivation path will be hardened automatically hardened

  // #### Response

  // | Field   | Type      | Content       | Note                            |
  // | ------- | --------- | ------------- | ------------------------------- |
  // | PK      | byte (65) | Public Key    |  |
  // | SW1-SW2 | byte (2)  | Return code   | see list of return codes        |

  // default hdPath from Cosmos
  async publicKeySecp256k1(hdPath = [44, 118, 0, 0, 0]) {
    const result = {}
    try {
      let apduResponse = await this._transport.send(
        CLA,
        INS_PUBLIC_KEY_SECP256K1,
        0,
        0,
        this._serializeHdPath(hdPath),
        ACCEPT_STATUSES
      )
      apduResponse = Buffer.from(apduResponse, "hex")
      const returnCode = apduResponse.slice(-2)
      result["pk"] = apduResponse.slice(3, 3 + 65)
      result["return_code"] = returnCode[0] * 256 + returnCode[1]
      result["error_message"] = this._errorMessage(result["return_code"])
    } catch (err) {
      const { statusCode, statusText, message, stack } = err
      console.warn("Ledger publicKeySecp256k1 error:",
        this._errorMessage(statusCode), message, statusText, stack)
      throw err
    }
    return result
  }

  /* SIGN_SECP256K1 */

  // #### Payload

  // | Field | Type     | Content                | Expected |
  // | ----- | -------- | ---------------------- | -------- |
  // | CLA   | byte (1) | Application Identifier | 0x55     |
  // | INS   | byte (1) | Instruction ID         | 0x02     |
  // | P1    | byte (1) | Packet Current Index   |   |
  // | P2    | byte (1) | Packet Total Count     |
  //   |
  // | L     | byte (1) | Bytes in payload       | (depends)        |

  // The first packet/chunk includes only the derivation path

  // All other packets/chunks should contain message to sign

  // *First Packet*

  // | Field | Type     | Content                | Expected |
  // | ----- | -------- | ---------------------- | -------- |
  // | PL    | byte (1) | Derivation Path Length  | 3<=PL<=10 |
  // | Path[0] | byte (4) | Derivation Path Data    | 44 |
  // | Path[1] | byte (4) | Derivation Path Data    | 118 |
  // | ..  | byte (4) | Derivation Path Data    |  |
  // | Path[PL-1]  | byte (4) | Derivation Path Data    |  |
  // | Message | bytes... | Message to Sign | |

  // *Other Chunks/Packets*

  // | Field | Type     | Content                | Expected |
  // | ----- | -------- | ---------------------- | -------- |
  // | Message | bytes... | Message to Sign | |

  // #### Response

  // | Field   | Type      | Content       | Note                            |
  // | ------- | --------- | ------------- | ------------------------------- |
  // | SIG     | byte (64) | Signature     |  |
  // | SW1-SW2 | byte (2)  | Return code   | see list of return codes        |

  _signGetChunks(data, hdPath) {
    const chunks = []
    chunks.push(this._serializeHdPath(hdPath))
    let buffer = Buffer.from(data)
    for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
      let end = i + CHUNK_SIZE
      if (i > buffer.length) {
        end = buffer.length
      }
      chunks.push(buffer.slice(i, end))
    }
    return chunks
  }

  async _signSendChunk(chunkIdx, chunkNum, chunk) {
    const result = {}
    try {
      let apduResponse = await this._transport.send(
        CLA,
        INS_SIGN_SECP256K1,
        chunkIdx,
        chunkNum,
        chunk
      )
      apduResponse = Buffer.from(apduResponse, "hex")
      let error_code_data = apduResponse.slice(-2)

      result["return_code"] = error_code_data[0] * 256 + error_code_data[1]
      result["error_message"] = this._errorMessage(result["return_code"])

      result["signature"] = null
      if (apduResponse.length > 2) {
        result["signature"] = apduResponse.slice(0, apduResponse.length - 2)
      }
    } catch (err) {
      const { statusCode, statusText, message, stack } = err
      console.warn("Ledger signSendChunk error:",
        this._errorMessage(statusCode), message, statusText, stack)
      throw err
    }
    return result
  }

  // default hdPath
  async signSecp256k1(txMsg, hdPath = [44, 118, 0, 0, 0]) {
    const response = {}
    const chunks = this._signGetChunks(txMsg, hdPath)
    console.log('chunks', chunks)
    // _signSendChunk doesn't throw, it catches exceptions itself. no need for try/catch
    let result
    try {
      result = await this._signSendChunk(1, chunks.length, chunks[0])
      response["return_code"] = result.return_code
      response["error_message"] = result.error_message
      response["signature"] = null
    } catch (err) {
      const { statusCode, statusText, message, stack } = err
      console.warn("Ledger signSecp256k1 error (chunk 1):",
        this._errorMessage(statusCode), message, statusText, stack)
      throw err
    }
    if (result.return_code === 0x9000) {
      for (let i = 1; i < chunks.length; i++) {
        try {
          result = await this._signSendChunk(1 + i, chunks.length, chunks[i])
          response["return_code"] = result.return_code
          response["error_message"] = result.error_message
        } catch (err) {
          const { statusCode, statusText, message, stack } = err
          console.warn("Ledger signSecp256k1 error (chunk 2):",
            this._errorMessage(statusCode), message, statusText, stack)
          throw err
        }
        if (result.return_code !== 0x9000) {
          break
        }
      }
      response["return_code"] = result.return_code
      response["error_message"] = result.error_message
      response["signature"] = result.signature
    }
    if (result.return_code !== 0x9000) {
      throw new Error(
        "Unable to sign the transaction. Return code " + result.return_code
      )
    }
    return response
  }
}

module.exports = LedgerApp
