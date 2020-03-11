/**
 * https://github.com/nomic-io/js-tendermint/blob/master/src/rpc.js
 */

import is from "is_js"
import { EventEmitter } from "events"
import axios from "axios"
import url from "url"
import websocket from "websocket-stream"
import ndjson from "ndjson"
import Pumpify from "pumpify"

export type Args = { [k: string]: any }

function convertHttpArgs(url: string, args: Args = {}) {
  const search = []
  for (let k in args) {
    if (is.string(args[k])) {
      search.push(`${k}="${args[k]}"`)
    } else if (Buffer.isBuffer(args[k])) {
      search.push(`${k}=0x${args[k].toString("hex")}`)
    } else {
      search.push(`${k}=${args[k]}`)
    }
  }
  return `${url}?${search.join("&")}`
}

function convertWsArgs(args: Args = {}) {
  for (let k in args) {
    let v = args[k]
    if (typeof v === "number") {
      args[k] = String(v)
    } else if (Buffer.isBuffer(v)) {
      args[k] = "0x" + v.toString("hex")
    } else if (v instanceof Uint8Array) {
      args[k] = "0x" + Buffer.from(v).toString("hex")
    }
  }
  return args
}

const wsProtocols = ["ws:", "wss:"]
const httpProtocols = ["http:", "https:"]
const allProtocols = wsProtocols.concat(httpProtocols)

export default class BaseRpc extends EventEmitter {
  private uri: string
  private websocket!: boolean
  public call!: BaseRpc["callWs"] | BaseRpc["callHttp"]
  private closed: boolean = false
  private ws?: Pumpify

  constructor(uriString = "localhost:27146") {
    super()

    // parse full-node URI
    let { protocol, hostname, port } = url.parse(uriString)

    // default to http
    if (!protocol || !allProtocols.includes(protocol)) {
      let uri = url.parse(`http://${uriString}`)
      protocol = uri.protocol
      hostname = uri.hostname
      port = uri.port
    }

    this.uri = !port
      ? `${protocol}//${hostname}/`
      : `${protocol}//${hostname}:${port}/`

    if (protocol && wsProtocols.includes(protocol)) {
      this.websocket = true
      this.uri = `${this.uri}websocket`
      this.call = this.callWs
      this.connectWs()
    } else if (protocol && httpProtocols.includes(protocol)) {
      this.call = this.callHttp
    }
  }

  connectWs() {
    this.ws = new Pumpify.obj(ndjson.stringify(), websocket(this.uri))

    this.ws.on("error", err => this.emit("error", err))
    this.ws.on("close", () => {
      if (this.closed) return
      this.emit("error", Error("websocket disconnected"))
    })
    this.ws.on("data", data => {
      data = JSON.parse(data)
      if (!data.id) return
      this.emit(data.id, data.error, data.result)
    })
  }

  callHttp(method: string, args?: Args) {
    let url = this.uri + method
    url = convertHttpArgs(url, args)
    return axios({
      url: url
    }).then(
      function({ data }) {
        if (data.error) {
          let err = Error(data.error.message)
          Object.assign(err, data.error)
          throw err
        }
        return data.result
      },
      function(err) {
        throw Error(err)
      }
    )
  }

  callWs(method: string, args?: Args, listener?: (value: any) => void) {
    let self = this
    return new Promise((resolve, reject) => {
      let id = Math.random().toString(36)
      let params = convertWsArgs(args)
      if (method === "subscribe") {
        if (typeof listener !== "function") {
          throw Error("Must provide listener function")
        }

        // events get passed to listener
        this.on(id + "#event", (err, res) => {
          if (err) return self.emit("error", err)
          return listener(res.data.value)
        })

        // promise resolves on successful subscription or error
        this.on(id, err => {
          if (err) return reject(err)
          resolve()
        })
      } else {
        // response goes to promise
        this.once(id, (err, res) => {
          if (err) return reject(err)
          resolve(res)
        })
      }

      this.ws?.write({ jsonrpc: "2.0", id, method, params })
    })
  }

  close() {
    this.closed = true
    if (!this.ws) return
    this.ws.destroy()
  }

  private createCallBasedMethod = (name: string) => (
    args?: Args,
    listener?: Parameters<BaseRpc["call"]>[2]
  ) => {
    return this.call(name, args, listener).then(res => {
      return res
    })
  }

  subscribe = this.createCallBasedMethod("subscribe")
  unsubscribe = this.createCallBasedMethod("unsubscribe")
  unsubscribeAll = this.createCallBasedMethod("unsubscribe_all")

  status = this.createCallBasedMethod("status")
  netInfo = this.createCallBasedMethod("net_info")
  blockchain = this.createCallBasedMethod("blockchain")
  genesis = this.createCallBasedMethod("genesis")
  health = this.createCallBasedMethod("health")
  block = this.createCallBasedMethod("block")
  blockResults = this.createCallBasedMethod("block_results")
  validators = this.createCallBasedMethod("validators")
  consensusState = this.createCallBasedMethod("consensus_state")
  dumpConsensusState = this.createCallBasedMethod("dump_consensus_state")
  broadcastTxCommit = this.createCallBasedMethod("broadcast_tx_commit")
  broadcastTxSync = this.createCallBasedMethod("broadcast_tx_sync")
  broadcastTxAsync = this.createCallBasedMethod("broadcast_tx_async")
  unconfirmedTxs = this.createCallBasedMethod("unconfirmed_txs")
  numUnconfirmedTxs = this.createCallBasedMethod("num_unconfirmed_txs")
  commit = this.createCallBasedMethod("commit")
  tx = this.createCallBasedMethod("tx")
  txSearch = this.createCallBasedMethod("tx_search")

  abciQuery = this.createCallBasedMethod("abci_query")
  abciInfo = this.createCallBasedMethod("abci_info")
}
