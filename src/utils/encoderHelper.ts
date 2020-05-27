import is from "is_js"

// typeToTyp3
//amino type convert
export default (type: any): 0 | 1 | 2 => {
  if (is.boolean(type)) {
    return 0
  }

  if (is.number(type)) {
    if (is.integer(type)) {
      return 0
    } else {
      return 1
    }
  }

  if (is.string(type) || is.array(type) || is.object(type)) {
    return 2
  }

  throw new Error(`Invalid type "${type}"`) // Is this what's expected?
}

export const size = function <T>(
  items: T[],
  iter: (it: T, index: number, acc: number) => number,
  acc: number
): number {
  if (acc === undefined) acc = 0
  for (let i = 0; i < items.length; ++i) acc += iter(items[i], i, acc)
  return acc
}
