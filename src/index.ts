import * as client from "./client"
import * as crypto from "./crypto"
import * as encoder from "./encoder"
import * as decoder from "./decoder"
import * as utils from "./utils"
import * as types from "./types"
import rpc from "./rpc/client"
import ledger from "./ledger"
import Transaction from "./tx"
import "./declarations"

const { BncClient } = client
const amino = { ...encoder, ...decoder }

export { Transaction, crypto, amino, utils, ledger, rpc, types }

export default BncClient
