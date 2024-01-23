export interface PrinterOptions {
    /**
     * axios 导入，必须有 axios 默认方法和 AxiosRequestConfig、AxiosPromise 两个类型
     * 可以修改为当前工程的 axios 实例，或其他类 axios 方法，类型导出不要忘记了
     * @example
     * import type {AxiosRequestConfig, AxiosPromise} from 'axios';
     * import axios from 'axios';
     * @default axios
     */
    axiosImportPath?: string;

    /**
     * 请求路径的参数名称
     * @default path
     */
    requestPathArgName?: string;

    /**
     * 请求参数的参数名称
     * @default params
     */
    requestQueryArgName?: string;

    /**
     * 请求体的参数名称
     * @default data
     */
    requestBodyArgName?: string;

    /**
     * 请求配置的参数名称
     * @default config
     */
    requestConfigArgName?: string;
}
export type StrictPrinterOptions = Required<PrinterOptions>;
