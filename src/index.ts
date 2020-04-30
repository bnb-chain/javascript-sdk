import * as client from "./client"
import * as crypto from "./crypto"
import * as amino from "./amino"
import * as utils from "./utils"
import * as types from "./types"
import rpc from "./rpc"
import ledger from "./ledger"
import Transaction from "./tx"
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