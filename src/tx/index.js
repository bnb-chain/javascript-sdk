import * as crypto from "../crypto/"
import * as encoder from "../encoder/"
import { UVarInt } from "../encoder/varint"

export const TxTypes = {
  MsgSend: "MsgSend",
  NewOrderMsg: "NewOrderMsg",
  CancelOrderMsg: "CancelOrderMsg",
  IssueMsg: "IssueMsg",
  BurnMsg: "BurnMsg",
  FreezeMsg: "FreezeMsg",
  UnfreezeMsg: "UnfreezeMsg",
  MintMsg: "MintMsg",
  ListMsg: "ListMsg",
  StdTx: "StdTx",
  PubKeySecp256k1: "PubKeySecp256k1",
  SignatureSecp256k1: "SignatureSecp256k1",
  MsgSubmitProposal: "MsgSubmitProposal",
  MsgDeposit: "MsgDeposit",
  MsgVote: "MsgVote",
  TimeLockMsg: "TimeLockMsg",
  TimeUnlockMsg: "TimeUnlockMsg",
  TimeRelockMsg: "TimeRelockMsg",
  HTLTMsg: "HTLTMsg",
  DepositHTLTMsg: "DepositHTLTMsg",
  ClaimHTLTMsg: "ClaimHTLTMsg",
  RefundHTLTMsg: "RefundHTLTMsg",
  SetAccountFlagsMsg: "SetAccountFlagsMsg"
}

export const TypePrefixes = {
  MsgSend: "2A2C87FA",
  NewOrderMsg: "CE6DC043",
  CancelOrderMsg: "166E681B",
  IssueMsg: "17EFAB80",
  BurnMsg: "7ED2D2A0",
  FreezeMsg: "E774B32D",
  UnfreezeMsg: "6515FF0D",
  MintMsg: "467E0829",
  ListMsg: "B41DE13F",
  StdTx: "F0625DEE",
  PubKeySecp256k1: "EB5AE987",
  SignatureSecp256k1: "7FC4A495",
  MsgSubmitProposal: "B42D614E",
  MsgDeposit: "A18A56E5",
  MsgVote: "A1CADD36",
  TimeLockMsg: "07921531",
  TimeUnlockMsg: "C4050C6C",
  TimeRelockMsg: "504711DA",
  HTLTMsg: "B33F9A24",
  DepositHTLTMsg: "63986496",
  ClaimHTLTMsg: "C1665300",
  RefundHTLTMsg: "3454A27C",
  SetAccountFlagsMsg: "BEA6E301"
}

/**
 * Creates a new transaction object.
 * @example
 * var rawTx = {
 *   account_number: 1,
 *   chain_id: 'bnbchain-1000',
 *   memo: '',
 *   msg: {},
 *   type: 'NewOrderMsg',
 *   sequence: 29,
 *   source: 0
 * };
 * var tx = new Transaction(rawTx);
 * @property {Buffer} raw The raw vstruct encoded transaction
 * @param {Number} data.account_number account number
 * @param {String} data.chain_id bnbChain Id
 * @param {String} data.memo transaction memo
 * @param {String} type transaction type
 * @param {Object} data.msg object data of tx type
 * @param {Number} data.sequence transaction counts
 * @param {Number} data.source where does this transaction come from
 */
class Transaction {
  constructor(data) {
    if (!TxTypes[data.type]) {
      throw new TypeError(`does not support transaction type: ${data.type}`)
    }

    if (!data.chain_id) {
      throw new Error("chain id should not be null")
    }

    data = data || {}

    this.type = data.type
    this.sequence = data.sequence || 0
    this.account_number = data.account_number || 0
    this.chain_id = data.chain_id
    this.msgs = data.msg ? [data.msg] : []
    this.memo = data.memo
    this.source = data.source || 0 // default value is 0
  }

  /**
   * generate the sign bytes for a transaction, given a msg
   * @param {Object} concrete msg object
   * @return {Buffer}
   **/
  getSignBytes(msg) {
    if (!msg) {
      throw new Error("msg should be an object")
    }
    const signMsg = {
      "account_number": this.account_number.toString(),
      "chain_id": this.chain_id,
      "data": null,
      "memo": this.memo,
      "msgs": [msg],
      "sequence": this.sequence.toString(),
      "source": this.source.toString()
    }

    return encoder.convertObjectToSignBytes(signMsg)
  }

  /**
   * attaches a signature to the transaction
   * @param {Elliptic.PublicKey} pubKey
   * @param {Buffer} signature
   * @return {Transaction}
   **/
  addSignature(pubKey, signature) {
    pubKey = this._serializePubKey(pubKey) // => Buffer
    this.signatures = [{
      pub_key: pubKey,
      signature: signature,
      account_number: this.account_number,
      sequence: this.sequence,
    }]
    return this
  }

  /**
   * sign transaction with a given private key and msg
   * @param {string} privateKey private key hex string
   * @param {Object} concrete msg object
   * @return {Transaction}
   **/
  sign(privateKey, msg) {
    if(!privateKey){
      throw new Error("private key should not be null")
    }

    if(!msg){
      throw new Error("signing message should not be null")
    }

    const signBytes = this.getSignBytes(msg)
    const privKeyBuf = Buffer.from(privateKey, "hex")
    const signature = crypto.generateSignature(signBytes.toString("hex"), privKeyBuf)
    this.addSignature(crypto.generatePubKey(privKeyBuf), signature)
    return this
  }

  /**
   * encode signed transaction to hex which is compatible with amino
   * @param {object} opts msg field
   */
  serialize() {
    if (!this.signatures) {
      throw new Error("need signature")
    }

    let msg = this.msgs[0]

    const stdTx = {
      msg: [msg],
      signatures: this.signatures,
      memo: this.memo,
      source: this.source, // sdk value is 0, web wallet value is 1
      data: "",
      msgType: TxTypes.StdTx
    }

    const bytes = encoder.marshalBinary(stdTx)
    return bytes.toString("hex")
  }

  /**
   * serializes a public key in a 33-byte compressed format.
   * @param {Elliptic.PublicKey} unencodedPubKey
   * @return {Buffer}
   */
  _serializePubKey(unencodedPubKey) {
    let format = 0x2
    if (unencodedPubKey.y && unencodedPubKey.y.isOdd()) {
      format |= 0x1
    }
    let pubBz = Buffer.concat([
      UVarInt.encode(format),
      unencodedPubKey.x.toArrayLike(Buffer, "be", 32)
    ])
    // prefixed with length
    pubBz = encoder.encodeBinaryByteArray(pubBz)
    // add the amino prefix
    pubBz = Buffer.concat([Buffer.from("EB5AE987", "hex"), pubBz])
    return pubBz
  }
}

Transaction.TxTypes = TxTypes
Transaction.TypePrefixes = TypePrefixes

// DEPRECATED: Retained for backward compatibility
Transaction.txType = TxTypes
Transaction.typePrefix = TypePrefixes

export default Transaction
