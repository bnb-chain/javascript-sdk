const MAX_INT64 = Math.pow(2, 63)

/**
 * validate the input number.
 * @param {Number} value
 */
export const checkNumber = (value, name = "input number") => {
  if (value <= 0) {
    throw new Error(`${name} should be a positive number`)
  }

  if (MAX_INT64 <= value) {
    throw new Error(`${name} should be less than 2^63`)
  }
}

/**
 * basic validation of coins
 * @param {Array} coins 
 */
export const checkCoins = (coins) => {
  coins = coins || []
  coins.forEach((coin) => {
    checkNumber(coin.amount)
    if (!coin.denom) {
      throw new Error("invalid denmon")
    }
  })
}

export const validateSymbol = (symbol) => {
  if (!symbol) {
    throw new Error("suffixed token symbol cannot be empty")
  }

  const splitSymbols = symbol.split("-")

  //check length with .B suffix
  if (!/^[a-zA-z\d/.]{3,10}$/.test(splitSymbols[0])) {
    throw new Error("symbol length is limited to 3~10")
  }
}

export const validateTradingPair = (pair) => {
  const symbols = pair.split("_")
  if (symbols.length !== 2) {
    throw new Error("the pair should in format \"symbol1_symbol2\"")
  }

  validateSymbol(symbols[0])
  validateSymbol(symbols[1])
}

export const validateOffsetLimit = (offset, limit) => {
  if (offset < 0) {
    throw new Error("offset can't be less than 0")
  }

  if (limit < 0) {
    throw new Error("limit can't be less than 0")
  }
}


