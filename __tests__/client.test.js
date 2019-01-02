import BncClient from "../src"
import { crypto } from "../src"

const mnemonic = "fragile duck lunch coyote cotton pole gym orange share muscle impulse mom pause isolate define oblige hungry sound stereo spider style river fun account"

const keystore = {"version":1,"id":"dfb09873-f16f-48c6-a6b8-bb5a705c47a7","address":"bnc1dxj068zgk007fchefj9n8tq06pcuce5ypqm5zk","crypto":{"ciphertext":"33b7439a8d64d73357dc91f88a6b3a45e7303717664d17daf8e8dc1cc708fa4b","cipherparams":{"iv":"88c726d70cd0437bfdb2312dc60103fc"},"cipher":"aes-256-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"ad10ef544417d4a25914dec3d908882686dd9d793b5c484b76fd5aa575cf54b9","c":262144,"prf":"hmac-sha256"},"mac":"f7cc301d18c97c71741492b8029544952ad5567a733971deb49fd3eb03ee696e"}}

const targetAddress = "bnc1hgm0p7khfk85zpz5v0j8wnej3a90w7098fpxyh"
const fromAddress = "bnc1ss57e8sa7xnwq030k2ctr775uac9gjzg6tfrv7"

const getClient = async () => {
  const client = new BncClient("https://dex-api.fdgahl.cn")
  await client.initChain()
  const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic).toString("hex")
  client.setPrivateKey(privateKey)
  return client
}

describe("BncClient test", async () => {

  it("create account", async () => {
    const client = await getClient()
    const res = client.account.createAccount()
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("create account with keystore", async () => {
    const client = await getClient()
    const res = client.account.createAccountWithKeystore("12345678")
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
    expect(res.keystore).toBeTruthy()
  })

  it("create account with mneomnic", async () => {
    const client = await getClient()
    const res = client.account.createAccountWithMneomnic()
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
    expect(res.mnemonic).toBeTruthy()
  })

  it("recover account from keystore", async () => {
    const client = await getClient()
    const res = client.account.recoverAccountFromKeystore(keystore, "12345qwert!S")
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("recover account from mneomnic", async () => {
    const client = await getClient()
    const res = client.account.recoverAccountFromMneomnic(mnemonic)
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("recover account from privatekey", async () => {
    const client = await getClient()
    const pk = crypto.generatePrivateKey()
    const res = client.account.recoverAccountFromPrivateKey(pk)
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it("get balance", async () => {
    const client = await getClient()
    const res = await client.account.getBalance("bnc1hgm0p7khfk85zpz5v0j8wnej3a90w7098fpxyh")
    expect(res.length).toBeGreaterThanOrEqual(0)
  })

  it("get account", async () => {
    const client = await getClient()
    const res = await client.account.getAccount("bnc1hgm0p7khfk85zpz5v0j8wnej3a90w7098fpxyh")
    expect(res.status).toBe(200)
  })

  it("transfer bnb to other wallet", async () => {
    const client = await getClient()
    const res = await client.transfer(fromAddress, targetAddress, 100, "BNB", "hello world")
    expect(res.result[0].code).toBe(0)
  })

  it("transfer bnb to other wallet", async () => {
    const client = await getClient()
    const res = await client.transfer(fromAddress, targetAddress, 5, "BNB", "hello world")
    expect(res.result[0].code).toBe(0)
  })

})