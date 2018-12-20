"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Transaction", {
  enumerable: true,
  get: function get() {
    return _tx.default;
  }
});
exports.amino = exports.crypto = exports.default = void 0;

var crypto = _interopRequireWildcard(require("./crypto"));

exports.crypto = crypto;

var amino = _interopRequireWildcard(require("./encoder"));

exports.amino = amino;

var _tx = _interopRequireDefault(require("./tx"));

var _request = _interopRequireDefault(require("./utils/request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var sortFieldSequence = function sortFieldSequence(obj) {
  if (!obj) return {};
  var result = {};
  var sortedKeys = Object.keys(obj).sort();
  sortedKeys.map(function (key) {
    if (key !== 'msgType') {
      result[key] = obj[key];
    }
  });
  return result;
};

var BncClient =
/*#__PURE__*/
function () {
  /**
  * @param {string} Binance Chain url
  * @param {String} privateKey
  * @param {String} chainId
  * @param {Number} account_number
  */
  function BncClient(options) {
    _classCallCheck(this, BncClient);

    if (!options) {
      throw new Error("options should not be null");
    }

    if (!options.server) {
      throw new Error("Binance chain server should not be null");
    }

    this.httpClient = new _request.default(options.server);
    this.account_number = options.account_number;
    this.chainId = options.chainId || 'chain-bnb';
  }

  _createClass(BncClient, [{
    key: "setPrivateKey",
    value: function setPrivateKey(privateKey) {
      this.privateKey = privateKey;
      return this;
    }
    /**
    * 
    * @param {String} fromAddress 
    * @param {String} toAddress 
    * @param {Number} amount 
    * @param {String} asset 
    * @param {String} memo 
    */

  }, {
    key: "transfer",
    value: function () {
      var _transfer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(fromAddress, toAddress, amount, asset, memo) {
        var accCode, toAccCode, coin, msg, signMsg;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                accCode = crypto.decodeAddress(fromAddress);
                toAccCode = crypto.decodeAddress(toAddress);
                coin = {
                  denom: asset,
                  amount: amount
                };
                msg = {
                  inputs: [{
                    address: accCode,
                    coins: [coin]
                  }],
                  outputs: [{
                    address: toAccCode,
                    coins: [coin]
                  }],
                  msgType: 'MsgSend'
                };
                signMsg = {
                  inputs: [{
                    address: fromAddress,
                    coins: [{
                      amount: amount.toString(),
                      denom: asset
                    }]
                  }],
                  outputs: [{
                    address: toAddress,
                    coins: [{
                      amount: amount.toString(),
                      denom: asset
                    }]
                  }]
                };
                _context.next = 7;
                return this.sendTransaction(msg, signMsg, fromAddress, null, memo, true);

              case 7:
                return _context.abrupt("return", _context.sent);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function transfer(_x, _x2, _x3, _x4, _x5) {
        return _transfer.apply(this, arguments);
      };
    }()
  }, {
    key: "cancelOrder",
    value: function () {
      var _cancelOrder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(fromAddress, symbol, orderIds, refids, sequence) {
        var _this = this;

        var accCode, requests;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                accCode = crypto.decodeAddress(fromAddress);
                requests = [];
                orderIds.forEach(function (orderId, index) {
                  msg = {
                    sender: accCode,
                    symbol: symbol,
                    id: orderId,
                    refid: refids[index],
                    msgType: 'CancelOrderMsg'
                  };
                  signMsg = {
                    id: orderId,
                    refid: refids[index],
                    sender: fromAddress,
                    symbol: symbol
                  };
                  requests.push(_this.sendTransaction(msg, signMsg, fromAddress, sequence, ''));
                });
                _context2.next = 5;
                return Promise.all(requests);

              case 5:
                return _context2.abrupt("return", _context2.sent);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function cancelOrder(_x6, _x7, _x8, _x9, _x10) {
        return _cancelOrder.apply(this, arguments);
      };
    }()
    /**
     * placeOrder
     * @param {String} address
     * @param {String} symbol
     * @param {String} side
     * @param {Number} price
     * @param {Number} quantity
     * @param {Number} sequence
     */

  }, {
    key: "placeOrder",
    value: function () {
      var _placeOrder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(address, symbol, side, price, quantity, sequence) {
        var accCode, placeOrderMsg, signMsg;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                accCode = crypto.decodeAddress(address);
                placeOrderMsg = {
                  sender: accCode,
                  id: "".concat(accCode.toString('hex'), "-").concat(sequence + 1).toUpperCase(),
                  symbol: symbol,
                  ordertype: 2,
                  side: side,
                  price: Math.floor(price * 100000000),
                  quantity: Math.floor(quantity * 100000000),
                  timeinforce: 1,
                  msgType: 'NewOrderMsg'
                };
                signMsg = {
                  id: placeOrderMsg.id,
                  ordertype: placeOrderMsg.ordertype,
                  price: placeOrderMsg.price,
                  quantity: placeOrderMsg.quantity,
                  sender: address,
                  side: placeOrderMsg.side,
                  symbol: placeOrderMsg.symbol,
                  timeinforce: 1
                };
                _context3.next = 5;
                return this.sendTransaction(placeOrderMsg, signMsg, address, sequence, '', true);

              case 5:
                return _context3.abrupt("return", _context3.sent);

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function placeOrder(_x11, _x12, _x13, _x14, _x15, _x16) {
        return _placeOrder.apply(this, arguments);
      };
    }()
    /**
     * send single transaction to binance chain
     * @param {Object} concrete msg type
     * @param {Object} stdSignMsg
     * @param {String} address
     * @param {Number} sequence
     * @param {String} memo
     * @param {Boolean} sync 
     * @return {Object} response (success or fail)
     */

  }, {
    key: "sendTransaction",
    value: function () {
      var _sendTransaction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(msg, stdSignMsg, address) {
        var sequence,
            memo,
            sync,
            data,
            options,
            tx,
            txBytes,
            _args4 = arguments;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                sequence = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : null;
                memo = _args4.length > 4 && _args4[4] !== undefined ? _args4[4] : '';
                sync = _args4.length > 5 && _args4[5] !== undefined ? _args4[5] : false;

                if (!(!sequence && address)) {
                  _context4.next = 8;
                  break;
                }

                _context4.next = 6;
                return this.httpClient.request('get', "/api/v1/account/".concat(address));

              case 6:
                data = _context4.sent;
                sequence = data.sequence;

              case 8:
                options = {
                  account_number: parseInt(this.account_number),
                  chain_id: this.chainId,
                  memo: memo,
                  msg: msg,
                  sequence: parseInt(sequence),
                  type: msg.msgType
                };
                tx = new _tx.default(options);
                txBytes = tx.sign(this.privateKey, stdSignMsg).serialize();
                console.log(txBytes);
                _context4.next = 14;
                return this.sendTx(txBytes, sync);

              case 14:
                return _context4.abrupt("return", _context4.sent);

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function sendTransaction(_x17, _x18, _x19) {
        return _sendTransaction.apply(this, arguments);
      };
    }()
    /**
     * send multiple transaction to binance chain
     * @param {Array} concrete msg type array
     * @param {Array} signature msg array
     * @param {Boolean} sync
     * @param {Number} sequence
     * @return {Object} send transaction response(success or fail)
     */

  }, {
    key: "sendBatchTransaction",
    value: function () {
      var _sendBatchTransaction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(msgs, signMsgs) {
        var _this2 = this;

        var sync,
            sequence,
            batchBytes,
            _args5 = arguments;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                sync = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : false;
                sequence = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : null;

                if (sequence === null) {// TODO: fetch sequence from API
                }

                batchBytes = [];
                msgs.forEach(function (msg, index) {
                  var options = {
                    account_number: parseInt(_this2.account_number),
                    chain_id: _this2.chainId,
                    memo: '',
                    msg: msg,
                    sequence: parseInt(_this2.sequence),
                    type: msg.msgType
                  };
                  var tx = new _tx.default(options);
                  var txBytes = tx.sign(_this2.privateKey, signMsgs[index]).serialize();
                  batchBytes.push(txBytes);
                });
                _context5.next = 7;
                return this.sendTx(batchBytes.join(','), sync);

              case 7:
                return _context5.abrupt("return", _context5.sent);

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function sendBatchTransaction(_x20, _x21) {
        return _sendBatchTransaction.apply(this, arguments);
      };
    }()
  }, {
    key: "sendTx",
    value: function () {
      var _sendTx = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(tx) {
        var sync,
            opts,
            data,
            _args6 = arguments;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                sync = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : true;
                opts = {
                  data: tx,
                  headers: {
                    'content-type': 'text/plain'
                  }
                };
                _context6.next = 4;
                return this.httpClient.request('post', "/api/v1/broadcast?sync=".concat(sync), null, opts);

              case 4:
                data = _context6.sent;
                return _context6.abrupt("return", data);

              case 6:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function sendTx(_x22) {
        return _sendTx.apply(this, arguments);
      };
    }()
  }]);

  return BncClient;
}();

var _default = BncClient;
exports.default = _default;