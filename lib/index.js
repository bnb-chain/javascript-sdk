'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transaction = exports.amino = exports.crypto = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require('./crypto');

var crypto = _interopRequireWildcard(_crypto);

var _encoder = require('./encoder');

var amino = _interopRequireWildcard(_encoder);

var _tx = require('./tx');

var _tx2 = _interopRequireDefault(_tx);

var _request = require('./utils/request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bnc = function () {
  function Bnc(server) {
    _classCallCheck(this, Bnc);

    this.httpClient = new _request2.default(server);
  }

  _createClass(Bnc, [{
    key: 'sendTx',
    value: async function sendTx(tx) {
      var opts = {
        data: tx,
        headers: {
          'content-type': 'text/plain'
        }
      };
      var data = await this.httpClient.request('post', '/api/v1/broadcast', null, opts);
      return data;
    }
  }]);

  return Bnc;
}();

exports.crypto = crypto;
exports.amino = amino;
exports.Transaction = _tx2.default;
exports.default = Bnc;