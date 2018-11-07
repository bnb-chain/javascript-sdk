"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAbstractCodec = exports.size = exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// typeToTyp3
//amino type convert
var _default = function _default(type) {
  if (_lodash.default.isBoolean(type)) {
    return 0;
  }

  if (_lodash.default.isNumber(type)) {
    if (_lodash.default.isInteger(type)) {
      return 0;
    } else {
      return 1;
    }
  }

  if (_lodash.default.isString(type) || _lodash.default.isArray(type) || _lodash.default.isObject(type)) {
    return 2;
  }
};

exports.default = _default;

var size = function size(items, iter, acc) {
  if (acc === undefined) acc = 0;

  for (var i = 0; i < items.length; ++i) {
    acc += iter(items[i], i, acc);
  }

  return acc;
};

exports.size = size;

var isAbstractCodec = function isAbstractCodec(codec) {
  return codec && typeof codec.encode === 'function' && typeof codec.decode === 'function' && typeof codec.encodingLength === 'function';
};

exports.isAbstractCodec = isAbstractCodec;