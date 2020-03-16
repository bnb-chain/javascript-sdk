"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DEFAULT_LEDGER_INTERACTIVE_TIMEOUT = 50000;
var DEFAULT_LEDGER_NONINTERACTIVE_TIMEOUT = 3000;
var CLA = 0xbc;
var SCRAMBLE_KEY = "CSM";
var ACCEPT_STATUSES = [0x9000]; // throw if not
var CHUNK_SIZE = 250;
var INS_GET_VERSION = 0x00;
var INS_PUBLIC_KEY_SECP256K1 = 0x01;
var INS_SIGN_SECP256K1 = 0x02;
var INS_SHOW_ADDR_SECP256K1 = 0x03;
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
var LedgerApp = /** @class */ (function () {
    /**
     * Constructs a new LedgerApp.
     * @param {Transport} transport Ledger Transport, a subclass of ledgerjs Transport.
     * @param {Number} interactiveTimeout The interactive (user input) timeout in ms. Default 45s.
     * @param {Number} nonInteractiveTimeout The non-interactive timeout in ms. Default 3s.
     */
    function LedgerApp(transport, interactiveTimeout, nonInteractiveTimeout) {
        if (interactiveTimeout === void 0) { interactiveTimeout = DEFAULT_LEDGER_INTERACTIVE_TIMEOUT; }
        if (nonInteractiveTimeout === void 0) { nonInteractiveTimeout = DEFAULT_LEDGER_NONINTERACTIVE_TIMEOUT; }
        if (!transport || !transport.send) {
            throw new Error("LedgerApp expected a Transport");
        }
        this._transport = transport;
        this._interactiveTimeout = interactiveTimeout;
        this._nonInteractiveTimeout = nonInteractiveTimeout;
        this._transport.setScrambleKey(SCRAMBLE_KEY);
    }
    LedgerApp.prototype._serialize = function (cla, ins, p1, p2, data) {
        if (cla === void 0) { cla = CLA; }
        if (p1 === void 0) { p1 = 0; }
        if (p2 === void 0) { p2 = 0; }
        if (data === void 0) { data = null; }
        var size = 5;
        if (data != null) {
            if (data.length > 255) {
                throw new Error("maximum data size = 255");
            }
            size += data.length;
        }
        var buffer = Buffer.alloc(size);
        buffer[0] = cla;
        buffer[1] = ins;
        buffer[2] = p1;
        buffer[3] = p2;
        buffer[4] = 0;
        if (data != null) {
            buffer[4] = data.length;
            buffer.set(data, 5);
        }
        return buffer;
    };
    LedgerApp.prototype._serializeHRP = function (hrp) {
        if (hrp == null || hrp.length < 3 || hrp.length > 83) {
            throw new Error("Invalid HRP");
        }
        var buf = Buffer.alloc(1 + hrp.length);
        buf.writeUInt8(hrp.length, 0);
        buf.write(hrp, 1);
        return buf;
    };
    LedgerApp.prototype._serializeHDPath = function (path) {
        if (path == null || path.length < 3) {
            throw new Error("Invalid path.");
        }
        if (path.length > 10) {
            throw new Error("Invalid path. Length should be <= 10");
        }
        var buf = Buffer.alloc(1 + 4 * path.length);
        buf.writeUInt8(path.length, 0);
        for (var i = 0; i < path.length; i++) {
            var v = path[i];
            if (i < 3) {
                v |= 0x80000000; // Harden
            }
            buf.writeInt32LE(v, 1 + i * 4);
        }
        return buf;
    };
    LedgerApp.prototype._errorMessage = function (code) {
        switch (code) {
            case 1:
                return "U2F: Unknown";
            case 2:
                return "U2F: Bad request";
            case 3:
                return "U2F: Configuration unsupported";
            case 4:
                return "U2F: Device Ineligible";
            case 5:
                return "U2F: Timeout";
            case 14:
                return "Timeout";
            case 0x9000:
                return "No errors";
            case 0x9001:
                return "Device is busy";
            case 0x6400:
                return "Execution Error";
            case 0x6700:
                return "Wrong Length";
            case 0x6982:
                return "Empty Buffer";
            case 0x6983:
                return "Output buffer too small";
            case 0x6984:
                return "Data is invalid";
            case 0x6985:
                return "Conditions not satisfied";
            case 0x6986:
                return "Transaction rejected";
            case 0x6a80:
                return "Bad key handle";
            case 0x6b00:
                return "Invalid P1/P2";
            case 0x6d00:
                return "Instruction not supported";
            case 0x6e00:
                return "The app does not seem to be open";
            case 0x6f00:
                return "Unknown error";
            case 0x6f01:
                return "Sign/verify error";
            default:
                return "Unknown error code";
        }
    };
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
    LedgerApp.prototype.getVersion = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, apduResponse, returnCode, err_1, statusCode, statusText, message, stack;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this._transport.setExchangeTimeout(this._nonInteractiveTimeout);
                        return [4 /*yield*/, this._transport.send(CLA, INS_GET_VERSION, 0, 0, Buffer.alloc(0), ACCEPT_STATUSES)];
                    case 2:
                        apduResponse = _a.sent();
                        if (!Buffer.isBuffer(apduResponse))
                            throw new Error("expected apduResponse to be Buffer");
                        returnCode = apduResponse.slice(-2);
                        result["test_mode"] = apduResponse[0] !== 0;
                        result["major"] = apduResponse[1];
                        result["minor"] = apduResponse[2];
                        result["patch"] = apduResponse[3];
                        result["device_locked"] = apduResponse[4] === 1;
                        result["return_code"] = returnCode[0] * 256 + returnCode[1];
                        result["error_message"] = this._errorMessage(result["return_code"]);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        statusCode = err_1.statusCode, statusText = err_1.statusText, message = err_1.message, stack = err_1.stack;
                        console.warn("Ledger getVersion error:", this._errorMessage(statusCode), message, statusText, stack);
                        throw err_1;
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
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
    LedgerApp.prototype.publicKeySecp256k1 = function (hdPath) {
        if (hdPath === void 0) { hdPath = [44, 714, 0, 0, 0]; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, apduResponse, returnCode, err_2, statusCode, statusText, message, stack;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this._transport.setExchangeTimeout(this._nonInteractiveTimeout);
                        return [4 /*yield*/, this._transport.send(CLA, INS_PUBLIC_KEY_SECP256K1, 0, 0, this._serializeHDPath(hdPath), ACCEPT_STATUSES)];
                    case 2:
                        apduResponse = _a.sent();
                        if (!Buffer.isBuffer(apduResponse))
                            throw new Error("expected apduResponse to be Buffer");
                        returnCode = apduResponse.slice(-2);
                        result["pk"] = apduResponse.slice(0, 1 + 64);
                        result["return_code"] = returnCode[0] * 256 + returnCode[1];
                        result["error_message"] = this._errorMessage(result["return_code"]);
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        statusCode = err_2.statusCode, statusText = err_2.statusText, message = err_2.message, stack = err_2.stack;
                        console.warn("Ledger publicKeySecp256k1 error:", this._errorMessage(statusCode), message, statusText, stack);
                        throw err_2;
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
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
    LedgerApp.prototype._signGetChunks = function (data, hdPath) {
        var chunks = [];
        chunks.push(this._serializeHDPath(hdPath));
        var buffer = Buffer.from(data);
        for (var i = 0; i < buffer.length; i += CHUNK_SIZE) {
            var end = i + CHUNK_SIZE;
            if (i > buffer.length) {
                end = buffer.length;
            }
            chunks.push(buffer.slice(i, end));
        }
        return chunks;
    };
    LedgerApp.prototype._signSendChunk = function (chunkIdx, chunksCount, chunk) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, apduResponse, returnCode, err_3, statusCode, statusText, message, stack;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._transport.send(CLA, INS_SIGN_SECP256K1, chunkIdx, chunksCount, chunk)];
                    case 2:
                        apduResponse = _a.sent();
                        if (!Buffer.isBuffer(apduResponse))
                            throw new Error("expected apduResponse to be Buffer");
                        returnCode = apduResponse.slice(-2);
                        result["return_code"] = returnCode[0] * 256 + returnCode[1];
                        result["error_message"] = this._errorMessage(result["return_code"]);
                        result["signature"] = null;
                        if (apduResponse.length > 2) {
                            result["signature"] = apduResponse.slice(0, apduResponse.length - 2);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        statusCode = err_3.statusCode, statusText = err_3.statusText, message = err_3.message, stack = err_3.stack;
                        console.warn("Ledger signSendChunk error:", this._errorMessage(statusCode), message, statusText, stack);
                        throw err_3;
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Sends a transaction sign doc to the Ledger app to be signed.
     * @param {Buffer} signBytes The TX sign doc bytes to sign
     * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
     * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
     */
    LedgerApp.prototype.signSecp256k1 = function (signBytes, hdPath) {
        if (hdPath === void 0) { hdPath = [44, 714, 0, 0, 0]; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, chunks, response, err_4, statusCode, statusText, message, stack, i, err_5, statusCode, statusText, message, stack, signature, rOffset, rLen, sLen, sOffset, sigR, sigS;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {};
                        chunks = this._signGetChunks(signBytes, hdPath);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (chunks.length <= 1) {
                            this._transport.setExchangeTimeout(this._interactiveTimeout);
                        }
                        else {
                            // more to come, non-interactive
                            this._transport.setExchangeTimeout(this._nonInteractiveTimeout);
                        }
                        return [4 /*yield*/, this._signSendChunk(1, chunks.length, chunks[0])];
                    case 2:
                        response = _a.sent();
                        result["return_code"] = response.return_code;
                        result["error_message"] = response.error_message;
                        result["signature"] = null;
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        statusCode = err_4.statusCode, statusText = err_4.statusText, message = err_4.message, stack = err_4.stack;
                        console.warn("Ledger signSecp256k1 error (chunk 1):", this._errorMessage(statusCode), message, statusText, stack);
                        throw err_4;
                    case 4:
                        if (!(response.return_code === 0x9000)) return [3 /*break*/, 12];
                        i = 1;
                        _a.label = 5;
                    case 5:
                        if (!(i < chunks.length)) return [3 /*break*/, 11];
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        if (i === chunks.length - 1) {
                            // last?
                            this._transport.setExchangeTimeout(this._interactiveTimeout);
                        }
                        return [4 /*yield*/, this._signSendChunk(1 + i, chunks.length, chunks[i])];
                    case 7:
                        response = _a.sent();
                        result["return_code"] = response.return_code;
                        result["error_message"] = response.error_message;
                        return [3 /*break*/, 9];
                    case 8:
                        err_5 = _a.sent();
                        statusCode = err_5.statusCode, statusText = err_5.statusText, message = err_5.message, stack = err_5.stack;
                        console.warn("Ledger signSecp256k1 error (chunk 2):", this._errorMessage(statusCode), message, statusText, stack);
                        throw err_5;
                    case 9:
                        if (response.return_code !== 0x9000) {
                            return [3 /*break*/, 11];
                        }
                        _a.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 5];
                    case 11:
                        result["return_code"] = response.return_code;
                        result["error_message"] = response.error_message;
                        signature = response.signature;
                        if (!signature || !signature.length) {
                            throw new Error("Ledger assertion failed: Expected a non-empty signature from the device");
                        }
                        if (signature[0] !== 0x30) {
                            throw new Error("Ledger assertion failed: Expected a signature header of 0x30");
                        }
                        rOffset = 4;
                        rLen = signature[3];
                        sLen = signature[4 + rLen + 1] // skip over following 0x02 type prefix for s
                        ;
                        sOffset = signature.length - sLen;
                        // we can safely ignore the first byte in the 33 bytes cases
                        if (rLen === 33) {
                            rOffset++; // chop off 0x00 padding
                            rLen--;
                        }
                        if (sLen === 33)
                            sOffset++; // as above
                        sigR = signature.slice(rOffset, rOffset + rLen) // skip e.g. 3045022100 and pad
                        ;
                        sigS = signature.slice(sOffset);
                        signature = result["signature"] = Buffer.concat([sigR, sigS]);
                        if (signature.length !== 64) {
                            throw new Error("Ledger assertion failed: incorrect signature length " + signature.length);
                        }
                        return [3 /*break*/, 13];
                    case 12: throw new Error("Unable to sign the transaction. Return code " + response.return_code);
                    case 13: return [2 /*return*/, result];
                }
            });
        });
    };
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
    LedgerApp.prototype.showAddress = function (hrp, hdPath) {
        if (hrp === void 0) { hrp = "bnb"; }
        if (hdPath === void 0) { hdPath = [44, 714, 0, 0, 0]; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, data, apduResponse, returnCode;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {};
                        data = Buffer.concat([
                            this._serializeHRP(hrp),
                            this._serializeHDPath(hdPath)
                        ]);
                        this._transport.setExchangeTimeout(this._interactiveTimeout);
                        return [4 /*yield*/, this._transport.send(CLA, INS_SHOW_ADDR_SECP256K1, 0, 0, data, ACCEPT_STATUSES)];
                    case 1:
                        apduResponse = _a.sent();
                        if (!Buffer.isBuffer(apduResponse))
                            throw new Error("expected apduResponse to be Buffer");
                        returnCode = apduResponse.slice(-2);
                        result["return_code"] = returnCode[0] * 256 + returnCode[1];
                        result["error_message"] = this._errorMessage(result["return_code"]);
                        if (result.return_code === 0x6a80) {
                            result["error_message"] = apduResponse
                                .slice(0, apduResponse.length - 2)
                                .toString("ascii");
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // convenience aliases
    /**
     * Gets the public key from the Ledger app that is currently open on the device.
     * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
     * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
     */
    LedgerApp.prototype.getPublicKey = function (hdPath) {
        return this.publicKeySecp256k1(hdPath);
    };
    /**
     * Sends a transaction sign doc to the Ledger app to be signed.
     * @param {Buffer} signBytes The TX sign doc bytes to sign
     * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
     * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
     */
    LedgerApp.prototype.sign = function (signBytes, hdPath) {
        return this.signSecp256k1(signBytes, hdPath);
    };
    return LedgerApp;
}());
module.exports = LedgerApp;
exports.default = LedgerApp;
//# sourceMappingURL=ledger-app.js.map