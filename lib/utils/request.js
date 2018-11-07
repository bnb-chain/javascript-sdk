'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable */


var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpRequest = function () {
  function HttpRequest(server) {
    _classCallCheck(this, HttpRequest);

    this.httpClient = _axios2.default.create({
      baseURL: server
    });
  }

  _createClass(HttpRequest, [{
    key: 'request',
    value: function request(method, path, params, opts) {
      var options = {
        method: method,
        url: path
      };

      if (params) {
        if (method === 'get') {
          options.params = params;
        } else {
          options.data = params;
        }
      }

      for (var key in opts) {
        options[key] = opts[key];
      }

      return this.httpClient.request(options).then(function (response) {
        var data = response.data;
        data.status = response.status;
        return data;
      }).catch(function (err) {
        var error = void 0;
        error = new Error('[API] HTTP request failed. Inspect this error for more info');
        Object.assign(error, err.response);

        console.warn('[WARN] ' + (error.message || ''), error);
        throw error;
      });
    }
  }]);

  return HttpRequest;
}();

exports.default = HttpRequest;