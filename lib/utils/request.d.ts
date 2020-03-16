import { Method, AxiosRequestConfig } from "axios";
/**
 * @alias utils.HttpRequest
 */
declare class HttpRequest {
    private httpClient;
    constructor(baseURL: string);
    get(path: string, params?: any, opts?: AxiosRequestConfig): Promise<{
        result: any;
        status: number;
    }>;
    post(path: string, body?: any, opts?: AxiosRequestConfig): Promise<{
        result: any;
        status: number;
    }>;
    request(method: Method, path: string, params?: any, opts?: AxiosRequestConfig): Promise<{
        result: any;
        status: number;
    }>;
}
export default HttpRequest;
