import axios from "axios"

class HttpRequest {
  constructor(baseURL){
    this.httpClient = axios.create({ baseURL })
  }

  get(path, params, opts) {
    return this.request("get", path, params, opts)
  }

  post(path, body, opts) {
    return this.request("post", path, body, opts)
  }

  request(method, path, params, opts) {
    const options = {
      method,
      url: path,
      ...opts
    }

    if (params) {
      if (method === "get") {
        options.params = params
      } else {
        options.data = params
      }
    }

    return this.httpClient
      .request(options)
      .then(response => {
        return { result: response.data, status: response.status }
      }).catch(err => {
        console.log(err)
        const msgObj = err.response && err.response.data && JSON.parse(err.response.data.message)
        let error = new Error(msgObj.message)
        error.code = msgObj.code
        error.abci_code = msgObj.abci_code
        throw error
      })
  }
}

export default HttpRequest
