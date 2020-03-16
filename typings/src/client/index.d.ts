/// <reference types="node" />
/**
 * @module client
 */
import * as crypto from "../crypto";
import Transaction from "../tx";
import HttpRequest from "../utils/request";
import TokenManagement from "../token/";
import Swap from "../swap/";
import Gov from "../gov/";
import { BigSource } from "big.js";
import { Coin } from "../utils/coin";
import LedgerApp, { PublicKey, SignedSignature } from "../ledger/ledger-app";
export declare const api: {
    broadcast: string;
    nodeInfo: string;
    getAccount: string;
    getMarkets: string;
    getSwaps: string;
    getOpenOrders: string;
    getDepth: string;
    getTransactions: string;
    getTx: string;
};
export declare const NETWORK_PREFIX_MAPPING: {
    readonly testnet: "tbnb";
    readonly mainnet: "bnb";
};
export declare type Transfer = {
    to: string;
    coins: Coin[];
};
/**
 * The default signing delegate which uses the local private key.
 * @param  {Transaction} tx      the transaction
 * @param  {Object}      signMsg the canonical sign bytes for the msg
 * @return {Transaction}
 */
export declare const DefaultSigningDelegate: (this: BncClient, tx: Transaction, signMsg?: any) => Promise<Transaction>;
/**
 * The default broadcast delegate which immediately broadcasts a transaction.
 * @param {Transaction} signedTx the signed transaction
 */
export declare const DefaultBroadcastDelegate: (this: BncClient, signedTx: Transaction) => Promise<{
    result: any;
    status: number;
}>;
/**
 * The Ledger signing delegate.
 * @param  {LedgerApp}  ledgerApp
 * @param  {preSignCb}  function
 * @param  {postSignCb} function
 * @param  {errCb} function
 * @return {function}
 */
export declare const LedgerSigningDelegate: (ledgerApp: LedgerApp, preSignCb: (preSignCb: Buffer) => void, postSignCb: (pubKeyResp: PublicKey, sigResp: SignedSignature) => void, errCb: (error: any) => void, hdPath: number[]) => (this: BncClient, tx: Transaction, signMsg?: any) => Promise<Transaction>;
/**
 * The Binance Chain client.
 */
export declare class BncClient {
    _httpClient: HttpRequest;
    _signingDelegate: typeof DefaultSigningDelegate;
    _broadcastDelegate: typeof DefaultBroadcastDelegate;
    _useAsyncBroadcast: boolean;
    _source: number;
    tokens: TokenManagement;
    swap: Swap;
    gov: Gov;
    chainId?: string | null;
    addressPrefix: typeof NETWORK_PREFIX_MAPPING[keyof typeof NETWORK_PREFIX_MAPPING];
    network: keyof typeof NETWORK_PREFIX_MAPPING;
    privateKey?: string;
    address?: string;
    _setPkPromise?: ReturnType<HttpRequest["request"]>;
    account_number?: string | number;
    /**
     * @param {String} server Binance Chain public url
     * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
     * @param {Number} source where does this transaction come from (default 0)
     */
    constructor(server: string, useAsyncBroadcast?: boolean, source?: number);
    /**
     * Initialize the client with the chain's ID. Asynchronous.
     * @return {Promise}
     */
    initChain(): Promise<this>;
    /**
     * Sets the client network (testnet or mainnet).
     * @param {String} network Indicate testnet or mainnet
     */
    chooseNetwork(network: keyof typeof NETWORK_PREFIX_MAPPING): void;
    /**
     * Sets the client's private key for calls made by this client. Asynchronous.
     * @param {string} privateKey the private key hexstring
     * @param {boolean} localOnly set this to true if you will supply an account_number yourself via `setAccountNumber`. Warning: You must do that if you set this to true!
     * @return {Promise}
     */
    setPrivateKey(privateKey: string, localOnly?: boolean): Promise<this>;
    /**
     * Sets the client's account number.
     * @param {number} accountNumber
     */
    setAccountNumber(accountNumber: number): void;
    /**
     * Use async broadcast mode. Broadcasts faster with less guarantees (default off)
     * @param {Boolean} useAsyncBroadcast
     * @return {BncClient} this instance (for chaining)
     */
    useAsyncBroadcast(useAsyncBroadcast?: boolean): BncClient;
    /**
     * Sets the signing delegate (for wallet integrations).
     * @param {function} delegate
     * @return {BncClient} this instance (for chaining)
     */
    setSigningDelegate(delegate: BncClient["_signingDelegate"]): BncClient;
    /**
     * Sets the broadcast delegate (for wallet integrations).
     * @param {function} delegate
     * @return {BncClient} this instance (for chaining)
     */
    setBroadcastDelegate(delegate: BncClient["_broadcastDelegate"]): BncClient;
    /**
     * Applies the default signing delegate.
     * @return {BncClient} this instance (for chaining)
     */
    useDefaultSigningDelegate(): BncClient;
    /**
     * Applies the default broadcast delegate.
     * @return {BncClient} this instance (for chaining)
     */
    useDefaultBroadcastDelegate(): BncClient;
    /**
     * Applies the Ledger signing delegate.
     * @param {function} ledgerApp
     * @param {function} preSignCb
     * @param {function} postSignCb
     * @param {function} errCb
     * @return {BncClient} this instance (for chaining)
     */
    useLedgerSigningDelegate(...args: Parameters<typeof LedgerSigningDelegate>): this;
    /**
     * Transfer tokens from one address to another.
     * @param {String} fromAddress
     * @param {String} toAddress
     * @param {Number} amount
     * @param {String} asset
     * @param {String} memo optional memo
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */
    transfer(fromAddress: string, toAddress: string, amount: BigSource, asset: string, memo?: string, sequence?: null): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * Create and sign a multi send tx
     * @param {String} fromAddress
     * @param {Array} outputs
     * @example
     * const outputs = [
     * {
     *   "to": "tbnb1p4kpnj5qz5spsaf0d2555h6ctngse0me5q57qe",
     *   "coins": [{
     *     "denom": "BNB",
     *     "amount": 10
     *   },{
     *     "denom": "BTC",
     *     "amount": 10
     *   }]
     * },
     * {
     *   "to": "tbnb1scjj8chhhp7lngdeflltzex22yaf9ep59ls4gk",
     *   "coins": [{
     *     "denom": "BTC",
     *     "amount": 10
     *   },{
     *     "denom": "BNB",
     *     "amount": 10
     *   }]
     * }]
     * @param {String} memo optional memo
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */
    multiSend(fromAddress: string, outputs: Transfer[], memo?: string, sequence?: null): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * Cancel an order.
     * @param {String} fromAddress
     * @param {String} symbol the market pair
     * @param {String} refid the order ID of the order to cancel
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */
    cancelOrder(fromAddress: string, symbol: string, refid: string, sequence?: number | null): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * Place an order.
     * @param {String} address
     * @param {String} symbol the market pair
     * @param {Number} side (1-Buy, 2-Sell)
     * @param {Number} price
     * @param {Number} quantity
     * @param {Number} sequence optional sequence
     * @param {Number} timeinforce (1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel))
     * @return {Promise} resolves with response (success or fail)
     */
    placeOrder(address: string | undefined, symbol: string, side: number, price: number, quantity: number, sequence?: number | null, timeinforce?: number): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * @param {String} address
     * @param {Number} proposalId
     * @param {String} baseAsset
     * @param {String} quoteAsset
     * @param {Number} initPrice
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */
    list(address: string, proposalId: number, baseAsset: string, quoteAsset: string, initPrice: number, sequence?: null): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * Set account flags
     * @param {String} address
     * @param {Number} flags new value of account flags
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */
    setAccountFlags(address: string, flags: number, sequence?: null): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * Prepare a serialized raw transaction for sending to the blockchain.
     * @param {Object} msg the msg object
     * @param {Object} stdSignMsg the sign doc object used to generate a signature
     * @param {String} address
     * @param {Number} sequence optional sequence
     * @param {String} memo optional memo
     * @return {Transaction} signed transaction
     */
    _prepareTransaction(msg: any, stdSignMsg: any, address: string, sequence?: string | number | null, memo?: string): Promise<Transaction>;
    /**
     * Broadcast a transaction to the blockchain.
     * @param {signedTx} tx signed Transaction object
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Promise} resolves with response (success or fail)
     */
    sendTransaction(signedTx: Transaction, sync: boolean): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * Broadcast a raw transaction to the blockchain.
     * @param {String} signedBz signed and serialized raw transaction
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Promise} resolves with response (success or fail)
     */
    sendRawTransaction(signedBz: string, sync?: boolean): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * Broadcast a raw transaction to the blockchain.
     * @param {Object} msg the msg object
     * @param {Object} stdSignMsg the sign doc object used to generate a signature
     * @param {String} address
     * @param {Number} sequence optional sequence
     * @param {String} memo optional memo
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Promise} resolves with response (success or fail)
     */
    _sendTransaction(msg: any, stdSignMsg: any, address: string, sequence?: string | number | null, memo?: string, sync?: boolean): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * get account
     * @param {String} address
     * @return {Promise} resolves with http response
     */
    getAccount(address?: string | undefined): Promise<{
        result: any;
        status: number;
    } | null>;
    /**
     * get balances
     * @param {String} address optional address
     * @return {Promise} resolves with http response
     */
    getBalance(address?: string | undefined): Promise<any>;
    /**
     * get markets
     * @param {Number} limit max 1000 is default
     * @param {Number} offset from beggining, default 0
     * @return {Promise} resolves with http response
     */
    getMarkets(limit?: number, offset?: number): Promise<never[] | {
        result: any;
        status: number;
    }>;
    /**
     * get transactions for an account
     * @param {String} address optional address
     * @param {Number} offset from beggining, default 0
     * @return {Promise} resolves with http response
     */
    getTransactions(address?: string | undefined, offset?: number): Promise<never[] | {
        result: any;
        status: number;
    }>;
    /**
     * get transaction
     * @param {String} hash the transaction hash
     * @return {Promise} resolves with http response
     */
    getTx(hash: string): Promise<never[] | {
        result: any;
        status: number;
    }>;
    /**
     * get depth for a given market
     * @param {String} symbol the market pair
     * @return {Promise} resolves with http response
     */
    getDepth(symbol?: string): Promise<never[] | {
        result: any;
        status: number;
    }>;
    /**
     * get open orders for an address
     * @param {String} address binance address
     * @param {String} symbol binance BEP2 symbol
     * @return {Promise} resolves with http response
     */
    getOpenOrders(address?: string): Promise<never[] | {
        result: any;
        status: number;
    }>;
    /**
     * get atomic swap
     * @param {String} swapID: ID of an existing swap
     * @return {Promise} AtomicSwap
     */
    getSwapByID(swapID: string): Promise<never[] | {
        result: any;
        status: number;
    }>;
    /**
     * query atomic swap list by creator address
     * @param {String} creator: swap creator address
     * @param {Number} offset from beginning, default 0
     * @param {Number} limit, max 1000 is default
     * @return {Promise} Array of AtomicSwap
     */
    getSwapByCreator(creator: string, limit?: number, offset?: number): Promise<never[] | {
        result: any;
        status: number;
    }>;
    /**
     * query atomic swap list by recipient address
     * @param {String} recipient: the recipient address of the swap
     * @param {Number} offset from beginning, default 0
     * @param {Number} limit, max 1000 is default
     * @return {Promise} Array of AtomicSwap
     */
    getSwapByRecipient(recipient: string, limit?: number, offset?: number): Promise<never[] | {
        result: any;
        status: number;
    }>;
    /**
     * Creates a private key and returns it and its address.
     * @return {object} the private key and address in an object.
     * {
     *  address,
     *  privateKey
     * }
     */
    createAccount(): {
        privateKey: string;
        address: string;
    };
    /**
     * Creates an account keystore object, and returns the private key and address.
     * @param {String} password
     *  {
     *  privateKey,
     *  address,
     *  keystore
     * }
     */
    createAccountWithKeystore(password: string): {
        privateKey: string;
        address: string;
        keystore: crypto.KeyStore;
    };
    /**
     * Creates an account from mnemonic seed phrase.
     * @return {object}
     * {
     *  privateKey,
     *  address,
     *  mnemonic
     * }
     */
    createAccountWithMneomnic(): {
        privateKey: string;
        address: string;
        mnemonic: string;
    };
    /**
     * Recovers an account from a keystore object.
     * @param {object} keystore object.
     * @param {string} password password.
     * {
     * privateKey,
     * address
     * }
     */
    recoverAccountFromKeystore(keystore: Parameters<typeof crypto.getPrivateKeyFromKeyStore>[0], password: Parameters<typeof crypto.getPrivateKeyFromKeyStore>[1]): {
        privateKey: string;
        address: string;
    };
    /**
     * Recovers an account from a mnemonic seed phrase.
     * @param {string} mneomnic
     * {
     * privateKey,
     * address
     * }
     */
    recoverAccountFromMnemonic(mnemonic: string): {
        privateKey: string;
        address: string;
    };
    recoverAccountFromMneomnic(mnemonic: string): {
        privateKey: string;
        address: string;
    };
    /**
     * Recovers an account using private key.
     * @param {String} privateKey
     * {
     * privateKey,
     * address
     * }
     */
    recoverAccountFromPrivateKey(privateKey: string): {
        privateKey: string;
        address: string;
    };
    /**
     * Validates an address.
     * @param {String} address
     * @param {String} prefix
     * @return {Boolean}
     */
    checkAddress(address: string, prefix?: BncClient["addressPrefix"]): boolean;
    /**
     * Returns the address for the current account if setPrivateKey has been called on this client.
     * @return {String}
     */
    getClientKeyAddress(): string;
}
