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
    call: BaseRpc["callWs"] | BaseRpc["callHttp"];
    private closed;
    private ws?;
    constructor(uriString?: string);
    connectWs(): void;
    callHttp(method: string, args?: Args): Promise<any>;
    callWs(method: string, args?: Args, listener?: (value: any) => void): Promise<unknown>;
    close(): void;
    private createCallBasedMethod;
    subscribe: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    unsubscribe: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    unsubscribeAll: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    status: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    netInfo: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    blockchain: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    genesis: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    health: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    block: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    blockResults: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    validators: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    consensusState: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    dumpConsensusState: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    broadcastTxCommit: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    broadcastTxSync: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    broadcastTxAsync: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    unconfirmedTxs: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    numUnconfirmedTxs: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    commit: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    tx: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    txSearch: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    abciQuery: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
    abciInfo: (args?: Args | undefined, listener?: ((value: any) => void) | undefined) => any;
}
