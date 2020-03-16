/**
 * @module Swap
 */
import { BncClient } from "../client";
import { Coin } from "../utils/coin";
declare class Swap {
    static instance: Swap;
    private _bncClient;
    /**
     * @param {Object} bncClient
     */
    constructor(bncClient: BncClient);
    /**
     * HTLT(Hash timer locked transfer, create an atomic swap)
     * @param {String} from
     * @param {String} recipient
     * @param {String} recipientOtherChain
     * @param {String} senderOtherChain
     * @param {String} randomNumberHash
     * @param {Number} timestamp
     * @param {Array} amount
     * @param {String} expectedIncome
     * @param {Number} heightSpan
     * @param {boolean} crossChain
     * @returns {Promise}  resolves with response (success or fail)
     */
    HTLT(from: string, recipient: string, recipientOtherChain: string, senderOtherChain: string, randomNumberHash: string, timestamp: number, amount: Coin[], expectedIncome: string, heightSpan: number, crossChain: boolean): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * depositHTLT(deposit assets to an existing swap)
     * @param {String} from
     * @param {String} swapID
     * @param {Array} amount
     * @returns {Promise}  resolves with response (success or fail)
     */
    depositHTLT(from: string, swapID: string, amount: Coin[]): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * claimHTLT(claim assets from an swap)
     * @param {String} from
     * @param {String} swapID
     * @param {String} randomNumber
     * @returns {Promise}  resolves with response (success or fail)
     */
    claimHTLT(from: string, swapID: string, randomNumber: string): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * refundHTLT(refund assets from an swap)
     * @param {String} from
     * @param {String} swapID
     * @returns {Promise}  resolves with response (success or fail)
     */
    refundHTLT(from: string, swapID: string): Promise<{
        result: any;
        status: number;
    }>;
}
export default Swap;
