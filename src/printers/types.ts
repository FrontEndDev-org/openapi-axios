export interface PrinterOptions {
    /**
     * axios 导入，必须有名称 axios，且 axios.request 是一个请求方法
     * @default import axios from 'axios';
     */
    axiosImport?: string;

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
     * 自定义响应包装类型
     * @default AxiosPromise
     */
    responseTypeName?: 'Promise' | 'AxiosPromise' | string;
}
export type StrictPrinterOptions = Required<PrinterOptions>;
