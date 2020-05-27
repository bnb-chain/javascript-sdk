/* eslint-disable */
export interface SignMsg {}
export interface Msg {}

export abstract class BaseMsg {
  public abstract getSignMsg(): SignMsg
  public abstract getMsg(): Msg
  public static defaultMsg(): Record<string, unknown> {
    return {}
  }
}
