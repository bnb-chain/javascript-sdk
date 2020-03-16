import { Coin } from "./coin";
import { BigSource } from "big.js";
/**
 * validate the input number.
 * @param {Number} value
 */
export declare const checkNumber: (value: BigSource, name?: string) => void;
/**
 * basic validation of coins
 * @param {Array} coins
 */
export declare const checkCoins: (coins: Coin[]) => void;
export declare const validateSymbol: (symbol: string) => void;
export declare const validateTradingPair: (pair: string) => void;
export declare const validateOffsetLimit: (offset: number, limit: number) => void;
