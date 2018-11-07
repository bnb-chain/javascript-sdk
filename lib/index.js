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

var Bnc =
/*#__PURE__*/
function () {
  function Bnc(server) {
    _classCallCheck(this, Bnc);

    this.httpClient = new _request.default(server);
  }

  _createClass(Bnc, [{
    key: "sendTx",
    value: function () {
      var _sendTx = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(tx) {
        var opts, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                opts = {
                  data: tx,
                  headers: {
                    'content-type': 'text/plain'
                  }
                };
                _context.next = 3;
                return this.httpClient.request('post', '/api/v1/broadcast', null, opts);

              case 3:
                data = _context.sent;
                return _context.abrupt("return", data);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function sendTx(_x) {
        return _sendTx.apply(this, arguments);
      };
    }()
  }]);

  return Bnc;
}();

var _default = Bnc;
exports.default = _default;