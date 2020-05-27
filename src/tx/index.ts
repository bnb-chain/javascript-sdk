import { curve } from "elliptic"

import { crypto } from "../"
import {
  convertObjectToSignBytes,
  UVarInt,
  marshalBinary,
  encodeBinaryByteArray,
} from "../amino"
import {
  BaseMsg,
  SignMsg,
  StdSignMsg,
  StdSignature,
  StdTx,
  AminoPrefix,
} from "../types/"

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
 * @param {Msg} data.msg object data of tx type
 * @param {Number} data.sequence transaction counts
 * @param {Number} data.source where does this transaction come from
 */
export default class Transaction {
  private sequence: NonNullable<StdSignMsg["sequence"]>
  private account_number: NonNullable<StdSignMsg["accountNumber"]>
  private chain_id: StdSignMsg["chainId"]

  // DEPRECATED: Retained for backward compatibility,
  private msg?: any

  private baseMsg?: NonNullable<BaseMsg>
  private memo: StdSignMsg["memo"]
  private source: NonNullable<StdSignMsg["source"]>
  private signatures: Array<StdSignature>

  constructor(data: StdSignMsg) {
    data = data || {}
    if (!data.chainId) {
      throw new Error("chain id should not be null")
    }

    this.sequence = data.sequence || 0
    this.account_number = data.accountNumber || 0
    this.chain_id = data.chainId
    this.msg = data.msg
    this.baseMsg = data.baseMsg
    this.memo = data.memo
    this.source = data.source || 0 // default value is 0
    this.signatures = []
  }

  /**
   * generate the sign bytes for a transaction, given a msg
   * @param {SignMsg} concrete msg object
   * @return {Buffer}
   **/
  getSignBytes(msg?: SignMsg): Buffer {
    msg = msg || (this.baseMsg && this.baseMsg.getSignMsg())
    const signMsg = {
      account_number: this.account_number.toString(),
      chain_id: this.chain_id,
      data: null,
      memo: this.memo,
      msgs: [msg],
      sequence: this.sequence.toString(),
      source: this.source.toString(),
    }

    return convertObjectToSignBytes(signMsg)
  }

  /**
   * attaches a signature to the transaction
   * @param {Elliptic.PublicKey} pubKey
   * @param {Buffer} signature
   * @return {Transaction}
   **/
  addSignature(pubKey: curve.base.BasePoint, signature: Buffer): Transaction {
    const pubKeyBuf = this._serializePubKey(pubKey) // => Buffer
    this.signatures = [
      {
        pub_key: pubKeyBuf,
        signature: signature,
        account_number: this.account_number,
        sequence: this.sequence,
      },
    ]
    return this
  }

  /**
   * sign transaction with a given private key and msg
   * @param {string} privateKey private key hex string
   * @param {SignMsg} concrete msg object
   * @return {Transaction}
   **/
  sign(privateKey: string, msg?: SignMsg): Transaction {
    if (!privateKey) {
      throw new Error("private key should not be null")
    }

    const signBytes = this.getSignBytes(msg)
    const privKeyBuf = Buffer.from(privateKey, "hex")
    const signature = crypto.generateSignature(
      signBytes.toString("hex"),
      privKeyBuf
    )
    this.addSignature(crypto.generatePubKey(privKeyBuf), signature)
    return this
  }

  /**
   * encode signed transaction to hex which is compatible with amino
   */
  serialize(): string {
    if (!this.signatures) {
      throw new Error("need signature")
    }
    const msg = this.msg || (this.baseMsg && this.baseMsg.getMsg())
    const stdTx: StdTx = {
      msg: [msg],
      signatures: this.signatures,
      memo: this.memo,
      source: this.source, // sdk value is 0, web wallet value is 1
      data: "",
      aminoPrefix: AminoPrefix.StdTx,
    }
    const bytes = marshalBinary(stdTx)
    return bytes.toString("hex")
  }

  /**
   * serializes a public key in a 33-byte compressed format.
   * @param {Elliptic.PublicKey} unencodedPubKey
   * @return {Buffer}
   */
  private _serializePubKey(unencodedPubKey: curve.base.BasePoint) {
    let format = 0x2
    const y = unencodedPubKey.getY()
    const x = unencodedPubKey.getX()
    if (y && y.isOdd()) {
      format |= 0x1
    }
    let pubBz = Buffer.concat([
      UVarInt.encode(format),
      x.toArrayLike(Buffer, "be", 32),
    ])

    // prefixed with length
    pubBz = encodeBinaryByteArray(pubBz)
    // add the amino prefix
    pubBz = Buffer.concat([Buffer.from("EB5AE987", "hex"), pubBz])
    return pubBz
  }
}

export const buildSignedTransaction = ({
  msg,
  chainId,
  accountNumber,
  sequence,
  source = 0,
  memo,
  privateKey,
}: {
  msg: BaseMsg
  chainId: string
  accountNumber: number
  sequence: number
  source: number
  memo: string
  privateKey: string
}) => {
  const data: StdSignMsg = {
    chainId: chainId,
    accountNumber: accountNumber,
    sequence: sequence,
    baseMsg: msg,
    memo,
    source,
  }

  const tx = new Transaction(data)
  return tx.sign(privateKey).serialize()
}
