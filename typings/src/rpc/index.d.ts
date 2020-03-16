/**
 * https://github.com/nomic-io/js-tendermint/blob/master/src/rpc.js
 */
/// <reference types="node" />
import { EventEmitter } from "events";
export declare type Args = {
    [k: string]: any;
};
export default class BaseRpc extends EventEmitter {
    private uri;
    private websocket;
    call: BaseRpc["callWs"] | BaseRpc["callHttp"];
    private closed;
    private ws?;
    constructor(uriString?: string);
    connectWs(): void;
    callHttp(method: string, args?: Args): Promise<any>;
    callWs(method: string, args?: Args, listener?: (value: any) => void): Promise<unknown>;
    close(): void;
    private createCallBasedMethod;
    subscribe: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    unsubscribe: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    unsubscribeAll: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    status: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    netInfo: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    blockchain: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    genesis: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    health: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    block: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    blockResults: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    validators: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    consensusState: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    dumpConsensusState: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    broadcastTxCommit: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    broadcastTxSync: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    broadcastTxAsync: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    unconfirmedTxs: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    numUnconfirmedTxs: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    commit: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    tx: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    txSearch: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    abciQuery: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
    abciInfo: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => Promise<unknown>;
}
