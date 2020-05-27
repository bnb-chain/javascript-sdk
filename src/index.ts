import * as amino from "./amino"
import * as client from "./client"
import * as crypto from "./crypto"
import ledger from "./ledger"
import rpc from "./rpc"
import Transaction from "./tx"
import * as types from "./types"
import * as utils from "./utils"
import "./declarations"

const { BncClient } = client

export { Transaction, crypto, amino, utils, ledger, rpc, types }

module.exports = BncClient
module.exports.Transaction = Transaction

module.exports.crypto = crypto
module.exports.amino = amino
module.exports.utils = utils
module.exports.ledger = ledger
module.exports.rpc = rpc
