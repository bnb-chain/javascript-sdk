export interface SignMsg {}
export interface Msg {}

export abstract class BaseMsg {
  public abstract getSignMsg(): SignMsg
  public abstract getMsg(): Msg
}
