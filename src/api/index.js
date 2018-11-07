import HttpRequest from '../utils/request';
import { isValidAddress, isValidSymbol, isValidTx, isValidURL } from './validations';


module.exports = (baseURL) => {
  if(!isValidURL(baseURL)) {
    throw Error("Invalid API base URL");
  }

  const api = new HttpRequest(baseURL);

  return {
    sendTx: async (tx) => {
      if(!isValidTx(tx)) {
        throw Error("Invalid tx");
      }
      return await api.post("/broadcast", tx);
    },

    account: async (address) => {
      if(!isValidAddress(address)) {
        throw Error("Invalid address");
      }
      return await api.get(`/account/${address}`);
    },

    depth: async (query = {}) => {
      newDepthQuery().validate(query);
      return await api.get("/depth", query);
    },

    kline: async (query = {}) => {
      newKlineQuery().validate(query);
      return await api.get("/kline", query);
    },
      
    trades: async (query = {}) => {
      newTradesQuery().validate(query);
      return await api.get("/trades", query);
    },

    openOrders: async (query = {}) => {
      newOpenOrdersQuery().validate(query);
      return await api.get("/orders/open", query);
    },
    
    closedOrders: async (query) => {
      newClosedOrdersQuery().validate(query);
      return await api.get("/orders/closed", query);
    },
    
    order: async (orderId) => {
      if(!orderId || orderId === "") {
        throw new Error("Invalid orderID");
      }
      return await api.get(`/orders/${orderId}`);
    },

    ticker: async (symbol) => {
      if(!isValidSymbol(symbol)) {
        throw Error("Invalid symbol");
      }
      return await api.get("/ticker/ticker", { symbol });
    },
    
    ticker24hr: async (symbol) => {
      if(!isValidSymbol(symbol)) {
        throw Error("Invalid symbol");
      }
      return await api.get("/ticker/24hr", { symbol })
    },
    
    tx: async (txHash) => {
      if(!txHash || txHash === "") {
        throw new Error("Invalid txHash");
      }
      return await api.get(`/tx/${txHash}`);
    },

    markets: async () => await api.get("/markets"),
    
    tokens: async () => await api.get("/tokens"),
    
    time: async () => await api.get("/time"),

    validators: async () => await api.get("/validators"),

    nodeInfo: async () => await api.get("/node-info"),

    frontierInfo: async () => await api.get("/frontier-info"),

    validators: async () => await api.get("/validators"),

    cryptoCurrency: async () => await api.get("/crypto-currency"),

    fiatCurrency: async () => await api.get("/fiat-currency"),
  }
}
