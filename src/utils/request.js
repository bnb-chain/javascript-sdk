/* eslint-disable */
import axios from 'axios';

class HttpRequest {
  constructor(baseURL){
    this.httpClient = axios.create({ baseURL });
  } 

  get(path, params, opts) {
    return this.request("get", path, params, opts);
  }

  post(path, body, opts) {
    return this.request("post", path, body, opts);
  }

  request(method, path, params, opts) {
    const options = {
      method,
      url: path,
      ...opts
    };

    if (params) {
      if (method === 'get') {
        options.params = params;
      } else {
        options.data = params;
      }
    }

    // for(const key in opts) {
    //   options[key] = opts[key];
    // }

    return this.httpClient
      .request(options)
      .then(response => {
        const data = response.data;
        data.status = response.status;
        return data;
      }).catch(err => {
        const msgObj = err.response && err.response.data && JSON.parse(err.response.data.message);
        const error = new Error(msgObj.message);
        error.code = msgObj.code;
        error.abci_code = msgObj.abci_code;
        throw error;
      });
  }
}

export default HttpRequest;
