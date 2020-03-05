declare module "is_js" {
  export const boolean: (a) => a is boolean
  export const number: (a) => a is number
  export const integer: (a) => a is number
  export const string: (a) => a is string
  export const array: (a) => a is Array<any>
  export const object: (a) => a is object
}

declare module "secure-random" {
  const csprng: (lenght: number) => ArrayBuffer
  export default csprng
}

declare module "crypto-browserify" {
  import _crypto from "crypto"
  const crypto: Pick<
    typeof _crypto,
    | "createHash"
    | "createHmac"
    | "pbkdf2"
    | "pbkdf2Sync"
    | "randomBytes"
    | "pseudoRandomBytes"
    | "createCipher"
    | "createDecipher"
    | "createDiffieHellman"
    | "createSign"
    | "createVerify"
    | "createECDH"
    | "publicEncrypt"
    | "privateDecrypt"
    | "privateEncrypt"
    | "publicDecrypt"
    | "createCipheriv"
    | "createDecipheriv"
  >
  export default crypto
}
