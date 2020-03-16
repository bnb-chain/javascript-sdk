/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "./msg";
import { TxAminoPrefix } from "./stdTx";
export interface SignedCancelOrder extends SignMsg {
    sender: string;
    symbol: string;
    refid: string;
}
export interface CancelOrderData extends Msg {
    sender: Buffer;
    symbol: string;
    refid: string;
    aminoPrefix: TxAminoPrefix;
}
export declare class CancelOrderMsg extends BaseMsg {
    private address;
    private symbol;
    private orderId;
    readonly aminoPrefix: TxAminoPrefix;
    constructor(address: string, sybmol: string, orderId: string);
    getSignMsg(): SignedCancelOrder;
    getMsg(): CancelOrderData;
}
