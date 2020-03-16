/**
 * @module gov
 */
import { BigSource } from "big.js";
import { Coin } from "../utils/coin";
import { BncClient } from "../client";
declare const proposalTypeMapping: {
    readonly 4: "ListTradingPair";
    readonly 0: "Nil";
    readonly 1: "Text";
    readonly 2: "ParameterChange";
    readonly 3: "SoftwareUpgrade";
    readonly 5: "FeeChange";
    readonly 6: "CreateValidator";
    readonly 7: "RemoveValidator";
};
/**
 * VoteOption
 * @example
 * OptionEmpty - 0x00
 * OptionYes - 0x01
 * OptionAbstain - 0x02
 * OptionNo - 0x03
 * OptionNoWithVeto - 0x04
 */
export declare const voteOption: {
    readonly OptionEmpty: 0;
    readonly OptionYes: 1;
    readonly OptionAbstain: 2;
    readonly OptionNo: 3;
    readonly OptionNoWithVeto: 4;
};
declare const voteOptionMapping: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
};
declare class Gov {
    static instance: Gov;
    private _bncClient;
    /**
     * @param {Object} bncClient
     */
    constructor(bncClient: BncClient);
    /**
     * Submit a list proposal along with an initial deposit
     * @param {Object} listParams
     * @example
     * var listParams = {
     *  title: 'New trading pair',
     *  description: '',
     *  baseAsset: 'BTC',
     *  quoteAsset: 'BNB',
     *  initPrice: 1,
     *  address: '',
     *  initialDeposit: 2000,
     *  expireTime: 1570665600,
     *  votingPeriod: 604800
     * }
     */
    submitListProposal(listParams: {
        baseAsset: string;
        quoteAsset: string;
        initPrice: BigSource;
        description: string;
        expireTime: string;
        address: string;
        title: string;
        initialDeposit: BigSource;
        votingPeriod: BigSource;
    }): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * Submit a proposal along with an initial deposit.
     * Proposal title, description, type and deposit can
     * be given directly or through a proposal JSON file.
     * @param {String} address
     * @param {String} title
     * @param {String} description
     * @param {Number} proposalType
     * @param {Number} initialDeposit
     * @param {String} votingPeriod
     * @return {Promise} resolves with response (success or fail)
     */
    submitProposal(address: string, title: string, description: string, proposalType: keyof typeof proposalTypeMapping, initialDeposit: BigSource, votingPeriod: BigSource): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * Deposit tokens for activing proposal
     * @param {Number} proposalId
     * @param {String} address
     * @param {Array} coins
     * @example
     * var coins = [{
     *   "denom": "BNB",
     *   "amount": 10
     * }]
     */
    deposit(proposalId: number, address: string, coins: Coin[]): Promise<{
        result: any;
        status: number;
    }>;
    /**
     *
     * @param {Number} proposalId
     * @param {String} voter
     * @param {VoteOption} option
     */
    vote(proposalId: number, voter: string, option: keyof typeof voteOptionMapping): Promise<{
        result: any;
        status: number;
    }>;
}
export default Gov;
