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
/// <reference types="node" />
/// <reference types="ledgerhq__hw-transport" />
import Transport from "@ledgerhq/hw-transport";
export interface Version {
    test_mode?: boolean;
    major?: number;
    minor?: number;
    patch?: number;
    device_locked?: boolean;
    return_code?: number;
    error_message?: string;
}
export interface PublicKey {
    pk?: Buffer;
    return_code?: number;
    error_message?: string;
}
export interface SignedSignature {
    return_code?: number;
    error_message?: string;
    signature?: Buffer | null;
}
export interface ReturnResponse {
    return_code?: number;
    error_message?: string;
}
/**
 * Ledger app interface.
 * @static
 */
declare class LedgerApp {
    private _transport;
    private _interactiveTimeout;
    private _nonInteractiveTimeout;
    /**
     * Constructs a new LedgerApp.
     * @param {Transport} transport Ledger Transport, a subclass of ledgerjs Transport.
     * @param {Number} interactiveTimeout The interactive (user input) timeout in ms. Default 45s.
     * @param {Number} nonInteractiveTimeout The non-interactive timeout in ms. Default 3s.
     */
    constructor(transport: Transport, interactiveTimeout?: number, nonInteractiveTimeout?: number);
    _serialize(cla: number | undefined, ins: number, p1?: number, p2?: number, data?: any): Buffer;
    _serializeHRP(hrp: string): Buffer;
    _serializeHDPath(path: number[]): Buffer;
    _errorMessage(code: number): "U2F: Unknown" | "U2F: Bad request" | "U2F: Configuration unsupported" | "U2F: Device Ineligible" | "U2F: Timeout" | "Timeout" | "No errors" | "Device is busy" | "Execution Error" | "Wrong Length" | "Empty Buffer" | "Output buffer too small" | "Data is invalid" | "Conditions not satisfied" | "Transaction rejected" | "Bad key handle" | "Invalid P1/P2" | "Instruction not supported" | "The app does not seem to be open" | "Unknown error" | "Sign/verify error" | "Unknown error code";
    /**
     * Gets the version of the Ledger app that is currently open on the device.
     * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
     */
    getVersion(): Promise<Version>;
    /**
     * Gets the public key from the Ledger app that is currently open on the device.
     * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
     * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
     */
    publicKeySecp256k1(hdPath?: number[]): Promise<PublicKey>;
    _signGetChunks(data: any, hdPath: number[]): Buffer[];
    _signSendChunk(chunkIdx: any, chunksCount: any, chunk: any): Promise<SignedSignature>;
    /**
     * Sends a transaction sign doc to the Ledger app to be signed.
     * @param {Buffer} signBytes The TX sign doc bytes to sign
     * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
     * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
     */
    signSecp256k1(signBytes: Buffer, hdPath?: number[]): Promise<SignedSignature>;
    /**
     * Shows the user's address for the given HD path on the device display.
     * @param {string} hrp The bech32 human-readable prefix
     * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
     * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
     */
    showAddress(hrp?: string, hdPath?: number[]): Promise<ReturnResponse>;
    /**
     * Gets the public key from the Ledger app that is currently open on the device.
     * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
     * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
     */
    getPublicKey(hdPath: number[]): Promise<PublicKey>;
    /**
     * Sends a transaction sign doc to the Ledger app to be signed.
     * @param {Buffer} signBytes The TX sign doc bytes to sign
     * @param {array} hdPath The HD path to use to get the public key. Default is [44, 714, 0, 0, 0]
     * @throws Will throw Error if a transport error occurs, or if the firmware app is not open.
     */
    sign(signBytes: Buffer, hdPath: number[]): Promise<SignedSignature>;
}
export default LedgerApp;
