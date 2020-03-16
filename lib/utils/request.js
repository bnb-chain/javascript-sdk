"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var axios_1 = tslib_1.__importDefault(require("axios"));
/**
 * @alias utils.HttpRequest
 */
var HttpRequest = /** @class */ (function () {
    function HttpRequest(baseURL) {
        this.httpClient = axios_1.default.create({ baseURL: baseURL });
    }
    HttpRequest.prototype.get = function (path, params, opts) {
        return this.request("get", path, params, opts);
    };
    HttpRequest.prototype.post = function (path, body, opts) {
        return this.request("post", path, body, opts);
    };
    HttpRequest.prototype.request = function (method, path, params, opts) {
        if (opts === void 0) { opts = {}; }
        var options = tslib_1.__assign({ method: method, url: path }, opts);
        if (params) {
            if (method === "get") {
                options.params = params;
            }
            else {
                options.data = params;
            }
        }
        return this.httpClient
            .request(options)
            .then(function (response) {
            return { result: response.data, status: response.status };
        })
            .catch(function (err) {
            var error = err;
            try {
                var msgObj = err.response && err.response.data;
                error = new Error(msgObj.message);
                error.code = msgObj.code;
            }
            catch (err) {
                throw error;
            }
            throw error;
        });
    };
    return HttpRequest;
}());
exports.default = HttpRequest;
//# sourceMappingURL=request.js.map