/// <reference types="node" />
import { Coin as CoinType } from "../types/send";
import { TxAminoPrefix } from "../types/stdTx";
export declare class Token {
    aminoPrefix: TxAminoPrefix;
    name: string;
    symbol: string;
    original_symbol: string;
    total_supply: number;
    owner: Buffer;
    mintable: boolean;
    constructor(opts?: Partial<{
        name: string;
        symbol: string;
        original_symbol: string;
        total_supply: number;
        owner: Buffer;
        mintable: boolean;
    }>);
}
export declare class TokenOfList {
    name: string;
    symbol: string;
    original_symbol: string;
    total_supply: number;
    owner: Buffer;
    mintable: boolean;
    constructor(opts?: Partial<{
        name: string;
        symbol: string;
        original_symbol: string;
        total_supply: number;
        owner: Buffer;
        mintable: boolean;
    }>);
}
export declare class Coin {
    denom: CoinType["denom"];
    amount: CoinType["amount"];
    constructor(opts?: Partial<CoinType>);
}
export declare class BaseAccount {
    address: Buffer;
    coins: Coin[];
    public_key: Buffer;
    account_number: number;
    sequence: number;
    constructor(opts?: Partial<{
        address: Buffer;
        coins: Coin[];
        public_key: Buffer;
        account_number: number;
        sequence: number;
    }>);
}
export declare class AppAccount {
    aminoPrefix: TxAminoPrefix;
    base: BaseAccount;
    name: string;
    locked: Coin[];
    frozen: Coin[];
    constructor(opts?: Partial<{
        base: BaseAccount;
        name: string;
        locked: Coin[];
        frozen: Coin[];
    }>);
}
export declare class TokenBalance {
    symbol: string;
    free: number;
    locked: number;
    frozen: number;
    constructor(opts?: Partial<{
        symbol: string;
        free: number;
        locked: number;
        frozen: number;
    }>);
}
export declare class OpenOrder {
    id: string;
    symbol: string;
    price: number;
    quantity: number;
    cumQty: number;
    createdHeight: number;
    createdTimestamp: number;
    lastUpdatedHeight: number;
    lastUpdatedTimestamp: number;
    constructor(opts?: Partial<{
        id: string;
        symbol: string;
        price: number;
        quantity: number;
        cumQty: number;
        createdHeight: number;
        createdTimestamp: number;
        lastUpdatedHeight: number;
        lastUpdatedTimestamp: number;
    }>);
}
export declare class TradingPair {
    base_asset_symbol: string;
    quote_asset_symbol: string;
    list_price: number;
    tick_size: number;
    lot_size: number;
    constructor(opts?: Partial<{
        base_asset_symbol: string;
        quote_asset_symbol: string;
        list_price: number;
        tick_size: number;
        lot_size: number;
    }>);
}
export declare class OrderBookLevel {
    buyQty: number;
    buyPrice: number;
    sellQty: number;
    sellPrice: number;
    constructor(opts?: Partial<{
        buyQty: number;
        buyPrice: number;
        sellQty: number;
        sellPrice: number;
    }>);
}
export declare class OrderBook {
    height: number;
    levels: OrderBookLevel[];
    constructor(opts?: Partial<{
        height: number;
        levels: OrderBookLevel[];
    }>);
}
export declare class SubmitProposalMsg {
    aminoPrefix: TxAminoPrefix;
    title: string;
    description: string;
    proposal_type: number;
    proposer: Buffer;
    initial_deposit: number[];
    voting_period: number;
    constructor(opts?: Partial<{
        title: string;
        description: string;
        proposal_type: number;
        proposer: Buffer;
        initial_deposit: number[];
        voting_period: number;
    }>);
}
