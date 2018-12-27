import _ from "lodash"

// typeToTyp3
//amino type convert
export default type => {
  if(_.isBoolean(type)){
    return 0
  }

  if(_.isNumber(type)){
    if(_.isInteger(type)){
      return 0
    }else{
      return 1
    }
  }

  if(_.isString(type) || _.isArray(type) || _.isObject(type)){
    return 2
  }
}

export const size = function (items, iter, acc) {
  if (acc === undefined) acc = 0
  for (var i = 0; i < items.length; ++i) acc += iter(items[i], i, acc)
  return acc
}

export const isAbstractCodec = function (codec) {
  return (codec &&
    typeof codec.encode === "function" &&
    typeof codec.decode === "function" &&
    typeof codec.encodingLength === "function")
}
