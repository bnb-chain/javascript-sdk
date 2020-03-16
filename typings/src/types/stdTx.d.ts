/// <reference types="node" />
import { BaseMsg, Msg } from "./msg";
export interface StdSignMsg {
    chainId: string;
    accountNumber: number;
    sequence: number;
    baseMsg?: BaseMsg;
    msg?: Msg;
    memo: string;
    source: number;
    data?: Buffer | null | string;
}
export interface StdSignature {
    pub_key?: Buffer;
    signature: Buffer;
    account_number: number;
    sequence: number;
}
export interface StdTx {
    msg: Array<Msg>;
    signatures: Array<StdSignature>;
    memo: string;
    source: number;
    data?: Buffer | null | string;
    aminoPrefix: TxAminoPrefix;
}
export declare enum TxAminoPrefix {
    MsgSend = "2A2C87FA",
    NewOrderMsg = "CE6DC043",
    CancelOrderMsg = "166E681B",
    IssueMsg = "17EFAB80",
    BurnMsg = "7ED2D2A0",
    FreezeMsg = "E774B32D",
    UnfreezeMsg = "6515FF0D",
    MintMsg = "467E0829",
    ListMsg = "B41DE13F",
    StdTx = "F0625DEE",
    PubKeySecp256k1 = "EB5AE987",
    SignatureSecp256k1 = "7FC4A495",
    MsgSubmitProposal = "B42D614E",
    MsgDeposit = "A18A56E5",
    MsgVote = "A1CADD36",
    TimeLockMsg = "07921531",
    TimeUnlockMsg = "C4050C6C",
    TimeRelockMsg = "504711DA",
    HTLTMsg = "B33F9A24",
    DepositHTLTMsg = "63986496",
    ClaimHTLTMsg = "C1665300",
    RefundHTLTMsg = "3454A27C",
    SetAccountFlagsMsg = "BEA6E301"
}
