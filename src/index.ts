import * as client from "./client"
import * as crypto from "./crypto"
import * as encoder from "./encoder"
import * as decoder from "./decoder"
import * as utils from "./utils"
import rpc from "./rpc/client"
import ledger from "./ledger"
import Transaction from "./tx"

const { BncClient } = client
const amino = { ...encoder, ...decoder }

export { Transaction, crypto, amino, utils, ledger, rpc }

export default BncClient
