import axios, { AxiosInstance, Method, AxiosRequestConfig } from "axios"

/**
 * @alias utils.HttpRequest
 */
export class HttpRequest {
  private httpClient: AxiosInstance

  constructor(baseURL: string) {
    this.httpClient = axios.create({ baseURL })
  }

  get(path: string, params?: any, opts?: AxiosRequestConfig) {
    return this.request("get", path, params, opts)
  }

  post(path: string, body?: any, opts?: AxiosRequestConfig) {
    return this.request("post", path, body, opts)
  }

  request(
    method: Method,
    path: string,
    params?: any,
    opts: AxiosRequestConfig = {}
  ) {
    const options = {
      method,
      url: path,
      ...opts,
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
      .then((response) => {
        return { result: response.data, status: response.status }
      })
      .catch((err) => {
        let error = err
        try {
          const msgObj = err.response && err.response.data
          error = new Error(msgObj.message)
          error.code = msgObj.code
        } catch (err) {
          throw error
        }
        throw error
      })
  }
}

export default HttpRequest
