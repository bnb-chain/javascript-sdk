
export const MAX_INT64 = Math.pow(2, 63)

export const api = {
  broadcast: "/api/v1/broadcast",
  nodeInfo: "/api/v1/node-info",
  getAccount: "/api/v1/account",
  getMarkets: "/api/v1/markets"
}

export const NETWORK_PREFIX_MAPPING = {
  "testnet": "tbnb",
  "mainnet": "bnb"
}

/**
 * validate the input number.
 * @param {Number} value
 */
export const checkNumber = (value, name = "input number")=>{
  if(value <= 0) {
    throw new Error(`${name} should be a positive number`)
  }

  if (MAX_INT64 <= value) {
    throw new Error(`${name} should be less than 2^63`)
  }
}
