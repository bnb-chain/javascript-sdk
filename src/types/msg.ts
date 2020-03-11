export interface SignMsg {}
export interface Msg {}

export abstract class BaseMsg {
  public abstract getSignMsg(): SignMsg
  public abstract getMsg(): Msg
}

export interface Coin {
  denom: string
  amount: string
}

interface InputOutput {
  address: string
  coins: Coin[]
}

export interface Input extends InputOutput {}

export interface Output extends InputOutput {}

export interface SendMsg {
  inputs: Input[]
  outputs: Output[]
}
