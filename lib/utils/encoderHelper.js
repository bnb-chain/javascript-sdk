'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAbstractCodec = exports.size = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// typeToTyp3
//amino type convert
exports.default = function (type) {
  if (_lodash2.default.isBoolean(type)) {
    return 0;
  }

  if (_lodash2.default.isNumber(type)) {
    if (_lodash2.default.isInteger(type)) {
      return 0;
    } else {
      return 1;
    }
  }

  if (_lodash2.default.isString(type) || _lodash2.default.isArray(type) || _lodash2.default.isObject(type)) {
    return 2;
  }
};

var size = exports.size = function size(items, iter, acc) {
  if (acc === undefined) acc = 0;
  for (var i = 0; i < items.length; ++i) {
    acc += iter(items[i], i, acc);
  }return acc;
};

var isAbstractCodec = exports.isAbstractCodec = function isAbstractCodec(codec) {
  return codec && typeof codec.encode === 'function' && typeof codec.decode === 'function' && typeof codec.encodingLength === 'function';
};