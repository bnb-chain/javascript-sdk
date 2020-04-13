/**
 * @module gov
 */
import Big, { BigSource } from "big.js"
import * as crypto from "../../crypto"
import { checkCoins } from "../../utils/validateHelper"
import proposalType from "./proposalType"
import { Coin } from "../../types"

import { BncClient } from ".." // This is a circular dependecy; should be changed to `import type` asap

const BASENUMBER = Math.pow(10, 8)

const proposalTypeMapping = {
  0x04: "ListTradingPair",
  0x00: "Nil",
  0x01: "Text",
  0x02: "ParameterChange",
  0x03: "SoftwareUpgrade",
  0x05: "FeeChange",
  0x06: "CreateValidator",
  0x07: "RemoveValidator",
} as const

/**
 * VoteOption
 * @example
 * OptionEmpty - 0x00
 * OptionYes - 0x01
 * OptionAbstain - 0x02
 * OptionNo - 0x03
 * OptionNoWithVeto - 0x04
 */
export const voteOption = {
  OptionEmpty: 0x00,
  OptionYes: 0x01,
  OptionAbstain: 0x02,
  OptionNo: 0x03,
  OptionNoWithVeto: 0x04,
} as const

const voteOptionMapping = {
  0x00: "Empty",
  0x01: "Yes",
  0x02: "Abstain",
  0x03: "No",
  0x04: "NoWithVeto",
}

class Gov {
  static instance: Gov
  private _bncClient!: BncClient

  /**
   * @param {Object} bncClient
   */
  constructor(bncClient: BncClient) {
    if (!Gov.instance) {
      this._bncClient = bncClient
      Gov.instance = this
    }

    return Gov.instance
  }

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
  async submitListProposal(listParams: {
    baseAsset: string
    quoteAsset: string
    initPrice: BigSource
    description: string
    expireTime: string
    address: string
    title: string
    initialDeposit: BigSource
    votingPeriod: BigSource
  }) {
    const listTradingPairObj = {
      base_asset_symbol: listParams.baseAsset,
      quote_asset_symbol: listParams.quoteAsset,
      init_price: +new Big(listParams.initPrice).mul(BASENUMBER).toString(),
      description: listParams.description,
      expire_time: new Date(listParams.expireTime).toISOString(),
    }

    const description = JSON.stringify(listTradingPairObj)
    const { address, title, initialDeposit, votingPeriod } = listParams
    return await this.submitProposal(
      address,
      title,
      description,
      proposalType.ProposalTypeListTradingPair,
      initialDeposit,
      votingPeriod
    )
  }

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
  async submitProposal(
    address: string,
    title: string,
    description: string,
    proposalType: keyof typeof proposalTypeMapping,
    initialDeposit: BigSource,
    votingPeriod: BigSource
  ) {
    const accAddress = crypto.decodeAddress(address)
    const coins = [
      {
        denom: "BNB",
        amount: new Big(initialDeposit).mul(BASENUMBER).toString(),
      },
    ]

    votingPeriod = +new Big(votingPeriod).mul(10 ** 9).toString()

    const proposalMsg = {
      title,
      description,
      proposal_type: proposalType,
      proposer: accAddress,
      initial_deposit: [
        {
          denom: "BNB",
          amount: +new Big(initialDeposit).mul(BASENUMBER).toString(),
        },
      ],
      voting_period: votingPeriod,
      msgType: "MsgSubmitProposal",
    }

    const signMsg = {
      description,
      initial_deposit: coins,
      proposal_type: proposalTypeMapping[proposalType],
      proposer: address,
      title,
      voting_period: votingPeriod.toString(),
    }

    const signedTx = await this._bncClient._prepareTransaction(
      proposalMsg,
      signMsg,
      address
    )
    return this._bncClient._broadcastDelegate(signedTx)
  }

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
  async deposit(proposalId: number, address: string, coins: Coin[]) {
    const accAddress = crypto.decodeAddress(address)

    checkCoins(coins)

    const amount: Coin[] = []
    coins.forEach((coin) => {
      amount.push({
        denom: coin.denom,
        amount: +new Big(coin.amount).mul(BASENUMBER).toString(),
      })
    })

    const depositMsg = {
      proposal_id: proposalId,
      depositer: accAddress,
      amount,
      msgType: "MsgDeposit",
    }

    const signMsg = {
      amount: amount.map((coin) => ({
        denom: coin.denom,
        amount: String(coin.amount),
      })),
      depositer: address,
      proposal_id: String(proposalId),
    }

    const signedTx = await this._bncClient._prepareTransaction(
      depositMsg,
      signMsg,
      address
    )
    return this._bncClient._broadcastDelegate(signedTx)
  }

  /**
   *
   * @param {Number} proposalId
   * @param {String} voter
   * @param {VoteOption} option
   */
  async vote(
    proposalId: number,
    voter: string,
    option: keyof typeof voteOptionMapping
  ) {
    const accAddress = crypto.decodeAddress(voter)

    const voteMsg = {
      proposal_id: proposalId,
      voter: accAddress,
      option,
      msgType: "MsgVote",
    }

    const signMsg = {
      option: voteOptionMapping[option],
      proposal_id: String(proposalId),
      voter,
    }

    const signedTx = await this._bncClient._prepareTransaction(
      voteMsg,
      signMsg,
      voter
    )
    return this._bncClient._broadcastDelegate(signedTx)
  }
}

export default Gov
