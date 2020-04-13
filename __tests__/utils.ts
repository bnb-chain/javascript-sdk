import BncClient from "../src"
import * as crypto from "../src/crypto"

/* make sure the address from the mnemonic has balances, or the case will failed */
export const mnemonic =
  "offer caution gift cross surge pretty orange during eye soldier popular holiday mention east eight office fashion ill parrot vault rent devote earth cousin"

export const keystores = {
  // keystore with sha3 mac
  new: {
    version: 1,
    id: "4cffb5da-2f64-48ea-b1c7-c4dd9fe53da8",
    crypto: {
      ciphertext:
        "721fadbb4d7a53aefb3895c089115da5203e36221bb8735f539e6c9d466b3567",
      cipherparams: { iv: "19e3ae15059bb8b80e91fdbb30d0d28b" },
      cipher: "aes-256-ctr",
      kdf: "pbkdf2",
      kdfparams: {
        dklen: 32,
        salt:
          "04fc271dcd65e9e833ed2b6a1b4f90ce80b06fb57f9283c29d403cc269e4d8a7",
        c: 262144,
        prf: "hmac-sha256",
      },
      mac:
        "32beae99a8cc2f9f2134f5aad1047b33182d3bd9996f9c7a88c51429da8942d7fbd44d6035934031aaee3af189cd54644c4655bb6c20c96f7c25ac906ca4786d",
    },
  },
  // keystore with sha256 mac
  legacy: {
    version: 1,
    id: "dfb09873-f16f-48c6-a6b8-bb5a705c47a7",
    address: "bnc1dxj068zgk007fchefj9n8tq06pcuce5ypqm5zk",
    crypto: {
      ciphertext:
        "33b7439a8d64d73357dc91f88a6b3a45e7303717664d17daf8e8dc1cc708fa4b",
      cipherparams: { iv: "88c726d70cd0437bfdb2312dc60103fc" },
      cipher: "aes-256-ctr",
      kdf: "pbkdf2",
      kdfparams: {
        dklen: 32,
        salt:
          "ad10ef544417d4a25914dec3d908882686dd9d793b5c484b76fd5aa575cf54b9",
        c: 262144,
        prf: "hmac-sha256",
      },
      mac: "f7cc301d18c97c71741492b8029544952ad5567a733971deb49fd3eb03ee696e",
    },
  },
  // keystore with bad mac
  badMac: {
    version: 1,
    id: "dfb09873-f16f-48c6-a6b8-bb5a705c47a7",
    address: "bnc1dxj068zgk007fchefj9n8tq06pcuce5ypqm5zk",
    crypto: {
      ciphertext:
        "33b7439a8d64d73357dc91f88a6b3a45e7303717664d17daf8e8dc1cc708fa4b",
      cipherparams: { iv: "88c726d70cd0437bfdb2312dc60103fc" },
      cipher: "aes-256-ctr",
      kdf: "pbkdf2",
      kdfparams: {
        dklen: 32,
        salt:
          "ad10ef544417d4a25914dec3d908882686dd9d793b5c484b76fd5aa575cf54b9",
        c: 262144,
        prf: "hmac-sha256",
      },
      mac: "x7cc301d18c97c71741492b8029544952ad5567a733971deb49fd3eb03ee696e",
    },
  },
}

export const targetAddress = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"

export const getClient = async (
  useAwaitSetPrivateKey = true,
  doNotSetPrivateKey = false
) => {
  const client = new BncClient("https://testnet-dex-asiapacific.binance.org")
  await client.initChain()
  const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
  if (!doNotSetPrivateKey) {
    if (useAwaitSetPrivateKey) {
      await client.setPrivateKey(privateKey)
    } else {
      client.setPrivateKey(privateKey) // test without `await`
    }
  }

  // use default delegates (signing, broadcast)
  client.useDefaultSigningDelegate()
  client.useDefaultBroadcastDelegate()
  return client
}

export const wait = (ms) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, ms)
  })
}

export const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)

export const address = crypto.getAddressFromPrivateKey(privateKey)
