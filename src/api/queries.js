import { isValidAddress, isValidSymbol } from './validations';

exports.newDepthQuery = () => ({
  default: {
    symbol: "",
    limit: 20  
  },

  isValid: query => {
    if(!isValidSymbol(query.symbol)) {
      throw Error("Invalid symbol");
    }
    return true;
  }
})

exports.newKlineQuery = () => ({
  default: {
    symbol: "",
    interval: "1h",
    limit: 20,
    startTime: 0,
    endTime: 0  
  },

  validate: query => {
    if(!isValidSymbol(query.symbol)) {
      throw Error("Invalid symbol");
    }

    if(["5m", "1h", "1d", "1w", "1m", "1y"].indexOf(query.interval) < 0) {
      throw Error("Invalid interval");
    }

    return true;
  }
})

exports.newOpenOrdersQuery = () => ({
  default: {
    address: "",
    symbol: ""  
  },

  validate: query => {
    if(!isValidAddress(query.address)) {
      throw Error("Invalid address");
    }

    if(!isValidSymbol(query.symbol)) {
      throw Error("Invalid symbol");
    }

    return true;
  }  
})

exports.newClosedOrdersQuery = () => ({
  default: {
    address: "",
    symbol: "",
    offset: 0,
    limit: 20,
    start: 0,
    end: 0,
    side: ""    
  },

  validate: query => {
    if(!isValidAddress(query.address)) {
      throw Error("Invalid address");
    }

    if(!isValidSymbol(query.symbol)) {
      throw Error("Invalid symbol");
    }

    if(query.side && query.side.toLowerCase() !== "sell" && query.side.toLowerCase() !== "buy") {
      throw Error("Invalid side");
    }

    return true;
  }    
})

exports.newTradesQuery = () => ({
  default: {
    address: "",
    symbol: "",
    offset: 0,
    limit: 20,
    start: 0,
    end: 0,
    side: ""  
  },

  validate: query => {
    if(!isValidAddress(query.address)) {
      throw Error("Invalid address");
    }

    if(!isValidSymbol(query.symbol)) {
      throw Error("Invalid symbol");
    }

    if(query.side && query.side.toLowerCase() !== "sell" && query.side.toLowerCase() !== "buy") {
      throw Error("Invalid side");
    }

    return true;
  } 
})

export default {
  newDepthQuery,
  newKlineQuery,
  newOpenOrdersQuery,
  newClosedOrdersQuery,
  newTradesQuery
}