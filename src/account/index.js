import * as crypto from "../crypto"

const getAccountApi = "/api/v1/account"

class Account { 
  constructor(httpClient){
    this._httpClient = httpClient 
  }

  /**
   * get balance
   * @param {String} address 
   */
  async getBalance(address) {
    if(!address) {
      throw new Error("address should not be null")
    }

    try {
      const data = await this._httpClient.request("get", `${getAccountApi}/${address}`)
      return data.result.balances
    } catch(err) {
      return []
    }
  }

  /**
   * get account
   * @param {String} address 
   */
  async getAccount(address) {
    if(!address) {
      throw new Error("address should not be null")
    }

    try {
      const data = await this._httpClient.request("get", `${getAccountApi}/${address}`)
      return data
    } catch(err) {
      return null
    }
  }

  /**
   * 
   * @return {Object} 
   * {
   *  address,
   *  privateKey
   * }
   */
  createAccount() {
    const privateKey = crypto.generatePrivateKey()
    return {
      privateKey,
      address: crypto.getAddressFromPrivateKey(privateKey)
    }
  }

  /**
   * 
   * @param {String} password 
   *  {
   *  privateKey,
   *  address,
   *  keystore
   * }
   */
  createAccountWithKeystore(password){
    if(!password){
      throw new Error("password should not be null")
    }

    const privateKey = crypto.generatePrivateKey()
    const address = crypto.getAddressFromPrivateKey(privateKey)
    const keystore = crypto.generateKeyStore(privateKey, password)
    return {
      privateKey,
      address,
      keystore
    }
  }

  /**
   * @return {Object}
   * {
   *  privateKey,
   *  address,
   *  mnemonic
   * }
   */
  createAccountWithMneomnic() {
    const mnemonic = crypto.generateMnemonic()
    const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
    const address = crypto.getAddressFromPrivateKey(privateKey)
    return {
      privateKey,
      address,
      mnemonic
    }
  }

  /**
   * @param {String} keystore 
   * @param {String} password
   * {
   * privateKey,
   * address
   * } 
   */
  recoverAccountFromKeystore(keystore, password){
    const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password)
    const address = crypto.getAddressFromPrivateKey(privateKey)
    return {
      privateKey,
      address
    }
  }

  /**
   * @param {String} mneomnic 
   * {
   * privateKey,
   * address
   * }
   */
  recoverAccountFromMneomnic(mneomnic){
    const privateKey = crypto.getPrivateKeyFromMnemonic(mneomnic)
    const address = crypto.getAddressFromPrivateKey(privateKey)
    return {
      privateKey,
      address
    }
  }

  /**
   * @param {String} privateKey 
   * {
   * privateKey,
   * address
   * }
   */
  recoverAccountFromPrivateKey(privateKey){
    const address = crypto.getAddressFromPrivateKey(privateKey)
    return {
      privateKey,
      address
    }
  }

}

export default Account