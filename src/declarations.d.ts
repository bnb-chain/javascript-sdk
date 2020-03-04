declare module "is_js" {
  export const boolean: (a) => a is boolean
  export const number: (a) => a is number
  export const integer: (a) => a is number
  export const string: (a) => a is string
  export const array: (a) => a is Array<any>
  export const object: (a) => a is object
}
