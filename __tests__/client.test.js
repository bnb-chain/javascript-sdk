import BncClient from "../src"
import * as crypto from "../src/crypto"

const mnemonic = "fragile duck lunch coyote cotton pole gym orange share muscle impulse mom pause isolate define oblige hungry sound stereo spider style river fun account"

const keystore = {"version":1,"id":"dfb09873-f16f-48c6-a6b8-bb5a705c47a7","address":"bnc1dxj068zgk007fchefj9n8tq06pcuce5ypqm5zk","crypto":{"ciphertext":"33b7439a8d64d73357dc91f88a6b3a45e7303717664d17daf8e8dc1cc708fa4b","cipherparams":{"iv":"88c726d70cd0437bfdb2312dc60103fc"},"cipher":"aes-256-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"ad10ef544417d4a25914dec3d908882686dd9d793b5c484b76fd5aa575cf54b9","c":262144,"prf":"hmac-sha256"},"mac":"f7cc301d18c97c71741492b8029544952ad5567a733971deb49fd3eb03ee696e"}}

const targetAddress = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd"

let client

const getClient = async () => {
  if(client && client.chainId){
    return client
  }
  client = new BncClient("https://testnet-dex.binance.org")
  await client.initChain()
  const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic).toString("hex")
  client.setPrivateKey(privateKey)
  return client
}

const wait = ms => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, ms)
  })
}

describe("BncClient test", async () => {

  it("create account", async () => {
    const client = await getClient()
    const res = client.createAccount()
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("create account with keystore", async () => {
    const client = await getClient()
    const res = client.createAccountWithKeystore("12345678")
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
    expect(res.keystore).toBeTruthy()
  })

  it("create account with mneomnic", async () => {
    const client = await getClient()
    const res = client.createAccountWithMneomnic()
    console.log(res)
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
    expect(res.mnemonic).toBeTruthy()
  })

  it("recover account from keystore", async () => {
    const client = await getClient()
    const res = client.recoverAccountFromKeystore(keystore, "12345qwert!S")
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("recover account from mneomnic", async () => {
    const client = await getClient()
    const res = client.recoverAccountFromMneomnic(mnemonic)
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("recover account from privatekey", async () => {
    const client = await getClient()
    const pk = crypto.generatePrivateKey()
    const res = client.recoverAccountFromPrivateKey(pk)
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("get balance", async () => {
    const client = await getClient()
    const res = await client.getBalance(targetAddress)
    expect(res.length).toBeGreaterThanOrEqual(0)
  })

  it("transfer placeOrder cancelOrder", async () => {
    jest.setTimeout(50000)
    const symbol = 'ADA.B-F2F_BNB'
    const client = await getClient()
    const addr = crypto.getAddressFromPrivateKey(client.privateKey)
    const accCode = crypto.decodeAddress(addr)
    const account = await client._httpClient.request("get", `/api/v1/account/${addr}`)
    const sequence = account.result && account.result.sequence

    const res = await client.transfer(addr, targetAddress, 1, "BNB", "hello world", sequence)
    expect(res.status).toBe(200)

    await wait(3000)

    const res1 = await client.placeOrder(addr, symbol, 1, 0.000396000, 12, sequence + 1)
    expect(res1.status).toBe(200)

    await wait(5000)

    const orderId = `${accCode.toString("hex")}-${sequence + 2}`.toUpperCase()
    const res2 = await client.cancelOrder(addr, symbol, orderId, sequence + 2)
    expect(res2.status).toBe(200)
  })

  it("get account", async () => {
    const client = await getClient(``)
    const res = await client.getAccount("tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd")
    if(res.status === 200){
      expect(res.status).toBe(200)
    }else {
      expect(res.status).toBe(204)
    }
  })
})
