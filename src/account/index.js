import * as crypto from "../crypto"

export class Account {


  /**
   * Creates a private key.
   * @return {Object}
   * {
   *  address,
   *  privateKey
   * }
   */
  static createAccount() {
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
  static createAccountWithKeystore(password) {
    if (!password) {
      throw new Error("password should not be falsy")
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
  static createAccountWithMneomnic() {
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
  static recoverAccountFromKeystore(keystore, password) {
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
  static recoverAccountFromMneomnic(mneomnic) {
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
  static recoverAccountFromPrivateKey(privateKey) {
    const address = crypto.getAddressFromPrivateKey(privateKey)
    return {
      privateKey,
      address
    }
  }

  /**
   * @param {String} address
   * @return {Boolean}
   */
  static checkAddress(address) {
    return crypto.checkAddress(address)
  }

}