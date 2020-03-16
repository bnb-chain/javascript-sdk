/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "./msg";
import { TxAminoPrefix } from "./stdTx";
export interface Coin {
    denom: string;
    amount: number;
}
export interface SignInputOutput {
    address: string;
    coins: Coin[];
}
interface InputOutput {
    address: Buffer;
    coins: Coin[];
}
export interface SignedSend extends SignMsg {
    inputs: SignInputOutput[];
    outputs: SignInputOutput[];
}
export interface SendData extends Msg {
    inputs: InputOutput[];
    outputs: InputOutput[];
    aminoPrefix: TxAminoPrefix;
}
/**
 * Only support transfers of one-to-one, one-to-many
 */
export declare class SendMsg extends BaseMsg {
    private sender;
    private outputs;
    readonly aminoPrefix: TxAminoPrefix;
    constructor(sender: string, outputs: SignInputOutput[]);
    calInputCoins(inputsCoins: Coin[], coins: Coin[]): void;
    getSignMsg(): SignedSend;
    getMsg(): SendData;
}
export {};
