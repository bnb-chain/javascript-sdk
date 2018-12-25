import BncClient from '../src'
import * as crypto from '../src/crypto'

jest.useFakeTimers();

const mnemonic = 'fragile duck lunch coyote cotton pole gym orange share muscle impulse mom pause isolate define oblige hungry sound stereo spider style river fun account'

const targetAddress = 'bnc1hgm0p7khfk85zpz5v0j8wnej3a90w7098fpxyh'
const fromAddress = 'bnc1ss57e8sa7xnwq030k2ctr775uac9gjzg6tfrv7'

const getClient = async () => {
  const client = new BncClient('https://dex-api.fdgahl.cn')
  await client.initChain()
  const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic).toString('hex')
  client.setPrivateKey(privateKey)
  return client
}

describe('BncClient test', async () => {

  it('create account', async () => {
    const client = await getClient()
    const res = client.createAccount()
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
  })

  it('create account with keystore', async () => {
    const client = await getClient()
    const res = client.createAccountWithKeystore('12345678')
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
    expect(res.keystore).toBeTruthy()
  })

  it('create account with mneomnic', async () => {
    const client = await getClient()
    const res = client.createAccountWithMneomnic()
    expect(res.address).toBeTruthy()
    expect(res.privateKey).toBeTruthy()
    expect(res.mnemonic).toBeTruthy()
  })

  it('get balance', async () => {
    const client = await getClient()
    const res = await client.getBalance('bnc1ss57e8sa7xnwq030k2ctr775uac9gjzg6tfrv7')
    expect(res.length).toBeGreaterThanOrEqual(0)
  })

  it('transfer bnb to other wallet', async () => {
    const client = await getClient()
    const res = await client.transfer(fromAddress, targetAddress, 100, 'BNB', 'hello world')
    expect(res['0'].code).toBe(0)
  })

})