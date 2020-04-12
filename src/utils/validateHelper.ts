import { Coin } from "../types"
import Big, { BigSource } from "big.js"

const MAX_INT64 = Math.pow(2, 63)

/**
 * validate the input number.
 * @param {Number} value
 */
export const checkNumber = (value: BigSource, name = "input number") => {
  if (new Big(value).lte(0)) {
    throw new Error(`${name} should be a positive number`)
  }

  if (new Big(value).gte(MAX_INT64)) {
    throw new Error(`${name} should be less than 2^63`)
  }
}

/**
 * basic validation of coins
 * @param {Array} coins
 */
export const checkCoins = (coins: Coin[]) => {
  coins = coins || []
  coins.forEach(coin => {
    checkNumber(coin.amount)
    if (!coin.denom) {
      throw new Error("invalid denmon")
    }
  })
}

export const validateSymbol = (symbol: string) => {
  if (!symbol) {
    throw new Error("suffixed token symbol cannot be empty")
  }

  const splitSymbols = symbol.split("-")

  //check length with .B suffix
  if (!/^[a-zA-z\d/.]{3,10}$/.test(splitSymbols[0])) {
    throw new Error("symbol length is limited to 3~10")
  }
}

export const validateTradingPair = (pair: string) => {
  const symbols = pair.split("_")
  if (symbols.length !== 2) {
    throw new Error('the pair should in format "symbol1_symbol2"')
  }

  validateSymbol(symbols[0])
  validateSymbol(symbols[1])
}

export const validateOffsetLimit = (offset: number, limit: number) => {
  if (offset < 0) {
    throw new Error("offset can't be less than 0")
  }

  if (limit < 0) {
    throw new Error("limit can't be less than 0")
  }
}
