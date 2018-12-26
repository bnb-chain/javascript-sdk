"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HttpRequest =
/*#__PURE__*/
function () {
  function HttpRequest(baseURL) {
    _classCallCheck(this, HttpRequest);

    this.httpClient = _axios.default.create({
      baseURL: baseURL
    });
  }

  _createClass(HttpRequest, [{
    key: "get",
    value: function get(path, params, opts) {
      return this.request("get", path, params, opts);
    }
  }, {
    key: "post",
    value: function post(path, body, opts) {
      return this.request("post", path, body, opts);
    }
  }, {
    key: "request",
    value: function request(method, path, params, opts) {
      var options = _objectSpread({
        method: method,
        url: path
      }, opts);

      if (params) {
        if (method === 'get') {
          options.params = params;
        } else {
          options.data = params;
        }
      }

      return this.httpClient.request(options).then(function (response) {
        return {
          result: response.data,
          status: response.status
        };
      }).catch(function (err) {
        var msgObj = err.response && err.response.data && JSON.parse(err.response.data.message);
        var error = new Error(msgObj.message);
        error.code = msgObj.code;
        error.abci_code = msgObj.abci_code;
        throw error;
      });
    }
  }]);

  return HttpRequest;
}();

var _default = HttpRequest;
exports.default = _default;