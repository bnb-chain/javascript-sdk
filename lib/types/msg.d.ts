export interface SignMsg {
}
export interface Msg {
}
export declare abstract class BaseMsg {
    abstract getSignMsg(): SignMsg;
    abstract getMsg(): Msg;
}
