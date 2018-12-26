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

var api = {
  broadcast: '/api/v1/broadcast',
  nodeInfo: '/api/v1/node-info',
  getAccount: '/api/v1/account',
  getSimulateAccount: '/api/v1/simulate/account/'
};

var BncClient =
/*#__PURE__*/
function () {
  /**
  * @param {string} Binance Chain public url
  */
  function BncClient(server) {
    _classCallCheck(this, BncClient);

    if (!server) {
      throw new Error("Binance chain server should not be null");
    }

    this._httpClient = new _request.default(server);
  }

  _createClass(BncClient, [{
    key: "initChain",
    value: function () {
      var _initChain = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.chainId) {
                  _context.next = 5;
                  break;
                }

                _context.next = 3;
                return this._httpClient.request('get', api.nodeInfo);

              case 3:
                data = _context.sent;
                this.chainId = data.node_info && data.node_info.network || 'chain-bnb';

              case 5:
                return _context.abrupt("return", this);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function initChain() {
        return _initChain.apply(this, arguments);
      };
    }()
  }, {
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
      regeneratorRuntime.mark(function _callee2(fromAddress, toAddress, amount, asset, memo) {
        var accCode, toAccCode, coin, msg, signMsg;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                accCode = crypto.decodeAddress(fromAddress);
                toAccCode = crypto.decodeAddress(toAddress);
                amount = amount * Math.pow(10, 8);
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
                _context2.next = 8;
                return this._sendTransaction(msg, signMsg, fromAddress, null, memo, true);

              case 8:
                return _context2.abrupt("return", _context2.sent);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
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
      regeneratorRuntime.mark(function _callee3(fromAddress, symbols, orderIds, refids, sequence) {
        var _this = this;

        var accCode, requests;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                accCode = crypto.decodeAddress(fromAddress);
                requests = [];
                orderIds.forEach(function (orderId, index) {
                  var msg = {
                    sender: accCode,
                    symbol: symbols[index],
                    id: orderId,
                    refid: refids[index],
                    msgType: 'CancelOrderMsg'
                  };
                  var signMsg = {
                    id: orderId,
                    refid: refids[index],
                    sender: fromAddress,
                    symbol: symbols[index]
                  };
                  requests.push(_this._sendTransaction(msg, signMsg, fromAddress, sequence + index, ''));
                });
                return _context3.abrupt("return", Promise.all(requests));

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
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
      regeneratorRuntime.mark(function _callee4(address, symbol, side, price, quantity, sequence) {
        var accCode, data, placeOrderMsg, signMsg;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                accCode = crypto.decodeAddress(address);

                if (sequence) {
                  _context4.next = 7;
                  break;
                }

                _context4.next = 4;
                return this._httpClient.request('get', "".concat(api.getAccount, "/").concat(address));

              case 4:
                data = _context4.sent;
                sequence = data.sequence;
                console.log(data);

              case 7:
                placeOrderMsg = {
                  sender: accCode,
                  id: "".concat(accCode.toString('hex'), "-").concat(sequence + 1).toUpperCase(),
                  symbol: symbol,
                  ordertype: 2,
                  side: side,
                  price: Math.floor(price * Math.pow(10, 8)),
                  quantity: Math.floor(quantity * Math.pow(10, 8)),
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
                _context4.next = 11;
                return this._sendTransaction(placeOrderMsg, signMsg, address, sequence, '', true);

              case 11:
                return _context4.abrupt("return", _context4.sent);

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
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
    key: "_sendTransaction",
    value: function () {
      var _sendTransaction2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(msg, stdSignMsg, address) {
        var sequence,
            memo,
            sync,
            data,
            _data,
            options,
            tx,
            txBytes,
            _args5 = arguments;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                sequence = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : null;
                memo = _args5.length > 4 && _args5[4] !== undefined ? _args5[4] : '';
                sync = _args5.length > 5 && _args5[5] !== undefined ? _args5[5] : false;

                if (!(!sequence && address)) {
                  _context5.next = 9;
                  break;
                }

                _context5.next = 6;
                return this._httpClient.request('get', "/api/v1/account/".concat(address));

              case 6:
                data = _context5.sent;
                sequence = data.result.sequence;
                this.account_number = data.result.account_number;

              case 9:
                if (this.account_number) {
                  _context5.next = 14;
                  break;
                }

                _context5.next = 12;
                return this._httpClient.request('get', "/api/v1/account/".concat(address));

              case 12:
                _data = _context5.sent;
                this.account_number = _data.result.account_number;

              case 14:
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
                _context5.next = 19;
                return this._sendTx(txBytes, sync);

              case 19:
                return _context5.abrupt("return", _context5.sent);

              case 20:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function _sendTransaction(_x17, _x18, _x19) {
        return _sendTransaction2.apply(this, arguments);
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
    key: "_sendBatchTransaction",
    value: function () {
      var _sendBatchTransaction2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(msgs, stdSignMsgs, address) {
        var _this2 = this;

        var sequence,
            memo,
            sync,
            data,
            _data2,
            batchBytes,
            _args6 = arguments;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                sequence = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : null;
                memo = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : '';
                sync = _args6.length > 5 && _args6[5] !== undefined ? _args6[5] : false;

                if (!(!sequence && address)) {
                  _context6.next = 9;
                  break;
                }

                _context6.next = 6;
                return this._httpClient.request('get', "/api/v1/account/".concat(address));

              case 6:
                data = _context6.sent;
                sequence = data.sequence;
                this.account_number = data.account_number;

              case 9:
                if (this.account_number) {
                  _context6.next = 14;
                  break;
                }

                _context6.next = 12;
                return this._httpClient.request('get', "/api/v1/account/".concat(address));

              case 12:
                _data2 = _context6.sent;
                this.account_number = _data2.account_number;

              case 14:
                batchBytes = [];
                msgs.forEach(function (msg, index) {
                  var options = {
                    account_number: parseInt(_this2.account_number),
                    chain_id: _this2.chainId,
                    memo: '',
                    msg: msg,
                    sequence: parseInt(sequence),
                    type: msg.msgType
                  };
                  var tx = new _tx.default(options);
                  var txBytes = tx.sign(_this2.privateKey, stdSignMsgs[index]).serialize();
                });
                _context6.next = 18;
                return this._sendTx(batchBytes.join(','), sync);

              case 18:
                return _context6.abrupt("return", _context6.sent);

              case 19:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function _sendBatchTransaction(_x20, _x21, _x22) {
        return _sendBatchTransaction2.apply(this, arguments);
      };
    }()
  }, {
    key: "_sendTx",
    value: function () {
      var _sendTx2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(tx) {
        var sync,
            opts,
            data,
            _args7 = arguments;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                sync = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : true;
                opts = {
                  data: tx,
                  headers: {
                    'content-type': 'text/plain'
                  }
                };
                _context7.next = 4;
                return this._httpClient.request('post', "".concat(api.broadcast, "?sync=").concat(sync), null, opts);

              case 4:
                data = _context7.sent;
                return _context7.abrupt("return", data);

              case 6:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function _sendTx(_x23) {
        return _sendTx2.apply(this, arguments);
      };
    }()
    /**
     * get balance
     * @param {String} address 
     */

  }, {
    key: "getBalance",
    value: function () {
      var _getBalance = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8(address) {
        var data;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (address) {
                  _context8.next = 2;
                  break;
                }

                throw new Error("address should not be null");

              case 2:
                _context8.prev = 2;
                _context8.next = 5;
                return this._httpClient.request('get', "".concat(api.getAccount, "/").concat(address));

              case 5:
                data = _context8.sent;
                return _context8.abrupt("return", data.result.balances);

              case 9:
                _context8.prev = 9;
                _context8.t0 = _context8["catch"](2);
                return _context8.abrupt("return", []);

              case 12:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[2, 9]]);
      }));

      return function getBalance(_x24) {
        return _getBalance.apply(this, arguments);
      };
    }()
    /**
     * get account
     * @param {String} address 
     */

  }, {
    key: "getAccount",
    value: function () {
      var _getAccount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9(address) {
        var data;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (address) {
                  _context9.next = 2;
                  break;
                }

                throw new Error("address should not be null");

              case 2:
                _context9.prev = 2;
                _context9.next = 5;
                return this._httpClient.request('get', "".concat(api.getAccount, "/").concat(address));

              case 5:
                data = _context9.sent;
                return _context9.abrupt("return", data);

              case 9:
                _context9.prev = 9;
                _context9.t0 = _context9["catch"](2);
                return _context9.abrupt("return", null);

              case 12:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[2, 9]]);
      }));

      return function getAccount(_x25) {
        return _getAccount.apply(this, arguments);
      };
    }()
    /**
     * 
     * @return {Object} 
     * {
     *  address,
     *  privateKey
     * }
     */

  }, {
    key: "createAccount",
    value: function createAccount() {
      var privateKey = crypto.generatePrivateKey();
      return {
        privateKey: privateKey,
        address: crypto.getAddressFromPrivateKey(privateKey)
      };
    }
    /**
     * 
     * @param {String} password 
     *  {
     *  privateKey,
     *  address,
     *  keystore
     * }
     */

  }, {
    key: "createAccountWithKeystore",
    value: function createAccountWithKeystore(password) {
      if (!password) {
        throw new Error("password should not be null");
      }

      var privateKey = crypto.generatePrivateKey();
      var address = crypto.getAddressFromPrivateKey(privateKey);
      var keystore = crypto.generateKeyStore(privateKey, password);
      return {
        privateKey: privateKey,
        address: address,
        keystore: keystore
      };
    }
    /**
     * @return {Object}
     * {
     *  privateKey,
     *  address,
     *  mnemonic
     * }
     */

  }, {
    key: "createAccountWithMneomnic",
    value: function createAccountWithMneomnic() {
      var mnemonic = crypto.generateMnemonic();
      var privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
      var address = crypto.getAddressFromPrivateKey(privateKey);
      return {
        privateKey: privateKey,
        address: address,
        mnemonic: mnemonic
      };
    }
    /**
     * @param {String} keystore 
     * @param {String} password
     * {
     * privateKey,
     * address
     * } 
     */

  }, {
    key: "recoverAccountFromKeystore",
    value: function recoverAccountFromKeystore(keystore, password) {
      var privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
      var address = crypto.getAddressFromPrivateKey(privateKey);
      return {
        privateKey: privateKey,
        address: address
      };
    }
    /**
     * @param {String} mneomnic 
     * {
     * privateKey,
     * address
     * }
     */

  }, {
    key: "recoverAccountFromMneomnic",
    value: function recoverAccountFromMneomnic(mneomnic) {
      var privateKey = crypto.getPrivateKeyFromMnemonic(mneomnic);
      var address = crypto.getAddressFromPrivateKey(privateKey);
      return {
        privateKey: privateKey,
        address: address
      };
    }
    /**
     * @param {String} privateKey 
     * {
     * privateKey,
     * address
     * }
     */

  }, {
    key: "recoverAccountFromPrivateKey",
    value: function recoverAccountFromPrivateKey(privateKey) {
      var address = crypto.getAddressFromPrivateKey(privateKey);
      return {
        privateKey: privateKey,
        address: address
      };
    }
  }]);

  return BncClient;
}();

var _default = BncClient;
exports.default = _default;