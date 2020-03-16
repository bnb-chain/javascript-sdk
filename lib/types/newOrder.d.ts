/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "./msg";
import { TxAminoPrefix } from "./stdTx";
export interface NewOrder {
    id: string;
    symbol: string;
    ordertype: number;
    side: number;
    price: number;
    quantity: number;
    timeinforce: number;
}
export interface SignedNewOrder extends SignMsg, NewOrder {
    sender: string;
}
export interface NewOrderData extends Msg, NewOrder {
    sender: Buffer;
    aminoPrefix: TxAminoPrefix;
}
export declare class NewOrderMsg extends BaseMsg {
    private newOrder;
    private address;
    readonly aminoPrefix: TxAminoPrefix;
    constructor(data: NewOrder, address: string);
    getSignMsg(): SignedNewOrder;
    getMsg(): NewOrderData;
}
