import is from "is_js"

// typeToTyp3
//amino type convert
export default type => {
  if(is.boolean(type)){
    return 0
  }

  if(is.number(type)){
    if(is.integer(type)){
      return 0
    }else{
      return 1
    }
  }

  if(is.string(type) || is.array(type) || is.object(type)){
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
