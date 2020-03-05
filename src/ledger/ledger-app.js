/**
 * @module ledger
 */
/********************************************************************************
 *   Binance Chain Ledger App Interface
 *   (c) 2018-2019 Binance
 *   (c) 2018 ZondaX GmbH
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
 *******************************************************************************
 */

const DEFAULT_LEDGER_INTERACTIVE_TIMEOUT = 50000
const DEFAULT_LEDGER_NONINTERACTIVE_TIMEOUT = 3000

const CLA = 0xbc
const SCRAMBLE_KEY = "CSM"
const ACCEPT_STATUSES = [0x9000] // throw if not
const CHUNK_SIZE = 250

const INS_GET_VERSION = 0x00
const INS_PUBLIC_KEY_SECP256K1 = 0x01
const INS_SIGN_SECP256K1 = 0x02
const INS_SHOW_ADDR_SECP256K1 = 0x03
// const INS_GET_ADDR_SECP256K1 = 0x04

// The general structure of commands and responses is as follows:

// #### Commands

// | Field   | Type     | Content                | Note |
// |:------- |:-------- |:---------------------- | ---- |
// | CLA     | byte (1) | Application Identifier | 0xBC |
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

/**
 * Ledger app interface.
 * @static
 */
class LedgerApp {
  /**
   * Constructs a new LedgerApp.
   * @param {Transport} transport Ledger Transport, a subclass of ledgerjs Transport.
   * @param {Number} interactiveTimeout The interactive (user input) timeout in ms. Default 45s.
   * @param {Number} nonInteractiveTimeout The non-interactive timeout in ms. Default 3s.
   */
  constructor(
    transport,
    interactiveTimeout = DEFAULT_LEDGER_INTERACTIVE_TIMEOUT,
    nonInteractiveTimeout = DEFAULT_LEDGER_NONINTERACTIVE_TIMEOUT
  ) {
    if (!transport || !transport.send) {
      throw new Error("LedgerApp expected a Transport")
    }
    this._transport = transport
    if (typeof interactiveTimeout === "number") {
      this._interactiveTimeout = interactiveTimeout
    }
    if (typeof nonInteractiveTimeout === "number") {
      this._nonInteractiveTimeout = nonInteractiveTimeout
    }
    this._transport.setScrambleKey(SCRAMBLE_KEY)
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

  _serializeHRP(hrp) {
    if (hrp == null || hrp.length < 3 || hrp.length > 83) {
      throw new Error("Invalid HRP")
    }
    let buf = Buffer.alloc(1 + hrp.length)
    buf.writeUInt8(hrp.length, 0)
    buf.write(hrp, 1)
    return buf
  }

  _serializeHDPath(path) {
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
      case 1:
        return "U2F: Unknown"
      case 2:
        return "U2F: Bad request"
      case 3:
        return "U2F: Configuration unsupported"
      case 4:
        return "U2F: Device Ineligible"
      case 5:
        return "U2F: Timeout"
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
        return "Transaction rejected"
      case 0x6a80:
        return "Bad key handle"
      case 0x6b00:
        return "Invalid P1/P2"
      case 0x6d00:
        return "Instruction not supported"
      case 0x6e00:
        return "The app does not seem to be open"
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
  // | CLA   | byte (1) | Application Identifier | 0xBC     |
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
  // | LOCKED  | byte (1) | Device Locked | boolean                         |
  // | SW1-SW2 | byte (2) | Return code   | see list of return codes        |

  /**
   * Gets the version of the Ledger app that is currently open on the device.
   * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
   */
  async getVersion() {
    const result = {}
    try {
      this._transport.setExchangeTimeout(this._nonInteractiveTimeout)
      let apduResponse = await this._transport.send(
        CLA,
        INS_GET_VERSION,
        0,
        0,
        Buffer.alloc(0),
        ACCEPT_STATUSES
      )
      if (!Buffer.isBuffer(apduResponse))
        throw new Error("expected apduResponse to be Buffer")
      const returnCode = apduResponse.slice(-2)
      result["test_mode"] = apduResponse[0] !== 0
      result["major"] = apduResponse[1]
      result["minor"] = apduResponse[2]
      result["patch"] = apduResponse[3]
      result["device_locked"] = apduResponse[4] === 1
      result["return_code"] = returnCode[0] * 256 + returnCode[1]
      result["error_message"] = this._errorMessage(result["return_code"])
    } catch (err) {
      const { statusCode, statusText, message, stack } = err
      console.warn(
        "Ledger getVersion error:",
        this._errorMessage(statusCode),
        message,
        statusText,
        stack
      )
      throw err
    }
    return result
  }

  /* PUBLIC_KEY_SECP256K1 */

  // #### Payload

  // | Field | Type     | Content                 | Expected |
  // | ----- | -------- | ----------------------  | -------- |
  // | CLA   | byte (1) | Application Identifier  | 0xBC     |
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

  /**
   * Gets the public key from the Ledger app that is currently open on the device.
   * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
   * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
   */
  async publicKeySecp256k1(hdPath = [44, 714, 0, 0, 0]) {
    const result = {}
    try {
      this._transport.setExchangeTimeout(this._nonInteractiveTimeout)
      let apduResponse = await this._transport.send(
        CLA,
        INS_PUBLIC_KEY_SECP256K1,
        0,
        0,
        this._serializeHDPath(hdPath),
        ACCEPT_STATUSES
      )
      if (!Buffer.isBuffer(apduResponse))
        throw new Error("expected apduResponse to be Buffer")
      const returnCode = apduResponse.slice(-2)
      result["pk"] = apduResponse.slice(0, 1 + 64)
      result["return_code"] = returnCode[0] * 256 + returnCode[1]
      result["error_message"] = this._errorMessage(result["return_code"])
    } catch (err) {
      const { statusCode, statusText, message, stack } = err
      console.warn(
        "Ledger publicKeySecp256k1 error:",
        this._errorMessage(statusCode),
        message,
        statusText,
        stack
      )
      throw err
    }
    return result
  }

  /* SIGN_SECP256K1 */

  // #### Payload

  // | Field | Type     | Content                | Expected |
  // | ----- | -------- | ---------------------- | -------- |
  // | CLA   | byte (1) | Application Identifier | 0xBC     |
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
  // | SIG     | byte (~71) | Signature     | DER encoded (length prefixed parts) |
  // | SW1-SW2 | byte (2)  | Return code   | see list of return codes        |

  _signGetChunks(data, hdPath) {
    const chunks = []
    chunks.push(this._serializeHDPath(hdPath))
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

  async _signSendChunk(chunkIdx, chunksCount, chunk) {
    const result = {}
    try {
      let apduResponse = await this._transport.send(
        CLA,
        INS_SIGN_SECP256K1,
        chunkIdx,
        chunksCount,
        chunk
      )
      if (!Buffer.isBuffer(apduResponse))
        throw new Error("expected apduResponse to be Buffer")
      let returnCode = apduResponse.slice(-2)

      result["return_code"] = returnCode[0] * 256 + returnCode[1]
      result["error_message"] = this._errorMessage(result["return_code"])

      result["signature"] = null
      if (apduResponse.length > 2) {
        result["signature"] = apduResponse.slice(0, apduResponse.length - 2)
      }
    } catch (err) {
      const { statusCode, statusText, message, stack } = err
      console.warn(
        "Ledger signSendChunk error:",
        this._errorMessage(statusCode),
        message,
        statusText,
        stack
      )
      throw err
    }
    return result
  }

  /**
   * Sends a transaction sign doc to the Ledger app to be signed.
   * @param {Buffer} signBytes The TX sign doc bytes to sign
   * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
   * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
   */
  async signSecp256k1(signBytes, hdPath = [44, 714, 0, 0, 0]) {
    const result = {}
    const chunks = this._signGetChunks(signBytes, hdPath)
    // _signSendChunk doesn't throw, it catches exceptions itself. no need for try/catch
    let response
    try {
      if (chunks.length <= 1) {
        this._transport.setExchangeTimeout(this._interactiveTimeout)
      } else {
        // more to come, non-interactive
        this._transport.setExchangeTimeout(this._nonInteractiveTimeout)
      }
      response = await this._signSendChunk(1, chunks.length, chunks[0])
      result["return_code"] = response.return_code
      result["error_message"] = response.error_message
      result["signature"] = null
    } catch (err) {
      const { statusCode, statusText, message, stack } = err
      console.warn(
        "Ledger signSecp256k1 error (chunk 1):",
        this._errorMessage(statusCode),
        message,
        statusText,
        stack
      )
      throw err
    }
    if (response.return_code === 0x9000) {
      for (let i = 1; i < chunks.length; i++) {
        try {
          if (i === chunks.length - 1) {
            // last?
            this._transport.setExchangeTimeout(this._interactiveTimeout)
          }
          response = await this._signSendChunk(1 + i, chunks.length, chunks[i])
          result["return_code"] = response.return_code
          result["error_message"] = response.error_message
        } catch (err) {
          const { statusCode, statusText, message, stack } = err
          console.warn(
            "Ledger signSecp256k1 error (chunk 2):",
            this._errorMessage(statusCode),
            message,
            statusText,
            stack
          )
          throw err
        }
        if (response.return_code !== 0x9000) {
          break
        }
      }
      result["return_code"] = response.return_code
      result["error_message"] = response.error_message

      // Ledger has encoded the sig in ASN1 DER format, but we need a 64-byte buffer of <r,s>
      // DER-encoded signature from Ledger:
      // 0 0x30: a header byte indicating a compound structure
      // 1 A 1-byte length descriptor for all what follows (ignore)
      // 2 0x02: a header byte indicating an integer
      // 3 A 1-byte length descriptor for the R value
      // 4 The R coordinate, as a big-endian integer
      //   0x02: a header byte indicating an integer
      //   A 1-byte length descriptor for the S value
      //   The S coordinate, as a big-endian integer
      //  = 7 bytes of overhead
      let signature = response.signature
      if (!signature || !signature.length) {
        throw new Error(
          "Ledger assertion failed: Expected a non-empty signature from the device"
        )
      }
      if (signature[0] !== 0x30) {
        throw new Error(
          "Ledger assertion failed: Expected a signature header of 0x30"
        )
      }
      // decode DER string format
      let rOffset = 4
      let rLen = signature[3]
      let sLen = signature[4 + rLen + 1] // skip over following 0x02 type prefix for s
      let sOffset = signature.length - sLen
      // we can safely ignore the first byte in the 33 bytes cases
      if (rLen === 33) {
        rOffset++ // chop off 0x00 padding
        rLen--
      }
      if (sLen === 33) sOffset++ // as above
      const sigR = signature.slice(rOffset, rOffset + rLen) // skip e.g. 3045022100 and pad
      const sigS = signature.slice(sOffset)

      signature = result["signature"] = Buffer.concat([sigR, sigS])
      if (signature.length !== 64) {
        throw new Error(
          `Ledger assertion failed: incorrect signature length ${signature.length}`
        )
      }
    } else {
      throw new Error(
        "Unable to sign the transaction. Return code " + response.return_code
      )
    }
    return result
  }

  /* INS_SHOW_ADDR_SECP256K1 */

  // #### Command

  // | Field      | Type           | Content                | Expected       |
  // | ---------- | -------------- | ---------------------- | -------------- |
  // | CLA        | byte (1)       | Application Identifier | 0xBC           |
  // | INS        | byte (1)       | Instruction ID         | 0x03           |
  // | P1         | byte (1)       | Parameter 1            | ignored        |
  // | P2         | byte (1)       | Parameter 2            | ignored        |
  // | L          | byte (1)       | Bytes in payload       | (depends)      |
  // | HRP_LEN    | byte(1)        | Bech32 HRP Length      | 1<=HRP_LEN<=83 |
  // | HRP        | byte (HRP_LEN) | Bech32 HRP             |                |
  // | PL         | byte (1)       | Derivation Path Length | 3<=PL<=5       |
  // | Path[0]    | byte (4)       | Derivation Path Data   | 44             |
  // | Path[1]    | byte (4)       | Derivation Path Data   | 714            |
  // | ..         | byte (4)       | Derivation Path Data   |                |
  // | Path[PL-1] | byte (4)       | Derivation Path Data   |                |

  // First three items in the derivation path will be automatically hardened

  /**
   * Shows the user's address for the given HD path on the device display.
   * @param {string} hrp The bech32 human-readable prefix
   * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
   * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
   */
  async showAddress(hrp = "bnb", hdPath = [44, 714, 0, 0, 0]) {
    const result = {}
    let data = Buffer.concat([
      this._serializeHRP(hrp),
      this._serializeHDPath(hdPath)
    ])
    this._transport.setExchangeTimeout(this._interactiveTimeout)
    let apduResponse = await this._transport.send(
      CLA,
      INS_SHOW_ADDR_SECP256K1,
      0,
      0,
      data,
      ACCEPT_STATUSES
    )
    if (!Buffer.isBuffer(apduResponse))
      throw new Error("expected apduResponse to be Buffer")
    let returnCode = apduResponse.slice(-2)
    result["return_code"] = returnCode[0] * 256 + returnCode[1]
    result["error_message"] = this._errorMessage(result["return_code"])
    if (result.return_code === 0x6a80) {
      result["error_message"] = apduResponse
        .slice(0, apduResponse.length - 2)
        .toString("ascii")
    }
    return result
  }

  // convenience aliases

  /**
   * Gets the public key from the Ledger app that is currently open on the device.
   * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
   * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
   */
  getPublicKey(hdPath) {
    return this.publicKeySecp256k1(hdPath)
  }

  /**
   * Sends a transaction sign doc to the Ledger app to be signed.
   * @param {Buffer} signBytes The TX sign doc bytes to sign
   * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
   * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
   */
  sign(signBytes, hdPath) {
    return this.signSecp256k1(signBytes, hdPath)
  }
}

module.exports = LedgerApp
