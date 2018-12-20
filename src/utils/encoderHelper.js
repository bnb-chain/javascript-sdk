import _ from 'lodash'

// typeToTyp3
//amino type convert
export default type => {
  if(_.isBoolean(type)){
    return 0
  }

  if(_.isNumber(type)) {
    return _.isInteger(type) ? 0 : 1
  }

  if(_.isString(type) || _.isArray(type) || _.isObject(type)){
    return 2;
  }
}

export const size = function (items, iter, acc) {
  if (acc === undefined) acc = 0
  // TODO: Control the condition when items is not Array
  return items.reduce((prev, cur) => prev + iter(cur, i, prev), acc)
}

export const isAbstractCodec = function (codec) {
  return (codec &&
    typeof codec.encode === 'function' &&
    typeof codec.decode === 'function' &&
    typeof codec.encodingLength === 'function')
}
