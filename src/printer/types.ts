import type { OpenAPILatest } from '../types/openapi';
import type { OpenApiLatest_Media, OpenApiLatest_Request, OpenApiLatest_Response } from './helpers';

export interface RequestContentContext {
  method: string;
  url: string;
  operation: OpenAPILatest.OperationObject;
  content: OpenApiLatest_Media;
}

export interface ResponsesContext {
  method: string;
  url: string;
  operation: OpenAPILatest.OperationObject;
  responses: OpenAPILatest.ResponsesObject;
  response: OpenApiLatest_Response;
}

export interface ResponseContentContext {
  method: string;
  url: string;
  operation: OpenAPILatest.OperationObject;
  responses: OpenAPILatest.ResponsesObject;
  response: OpenAPILatest.ResponseObject;
  content: OpenApiLatest_Media;
}

// TODO 请求类型组件
export interface ComponentRequestContentContext {
  name: string;
  requestBody: OpenApiLatest_Request;
  content: OpenApiLatest_Media;
}

export interface OperationContext {
  method: string;
  url: string;
  operation: OpenAPILatest.OperationObject;
}

export type RequestContentTypeMatch = (contentType: string, context: RequestContentContext) => boolean;
export type RequestStatusCodeMatch = (statusCode: string, context: ResponsesContext) => boolean;
export type ResponseContentTypeMatch = (contentType: string, context: ResponseContentContext) => boolean;
export type OperationIdNormalize = (context: OperationContext) => string;

export interface RuntimeValidate {
  /**
   * 响应数据属性
   * @default ['data']
   */
  responseDataProps?: string[];
}

export interface RuntimeMock {
  /**
   * 启用条件
   * @default process.env.NODE_ENV !== 'production'
   */
  enableCondition?: string;
};

export interface PrinterOptions {
  /**
   * axios 导入名称，为空字符串时默认导入
   * axios 部分兼容 https://www.npmjs.com/package/axios
   * @default ""
   * @example
   * // 具名导入
   * import { axios } from 'path/to/axios';
   * // 默认导入（非具名导入）
   * import axios from 'path/to/axios';
   */
  axiosImportName?: string;

  /**
   * faker 导入名称，为空字符串时默认导入
   * faker 部分兼容 https://www.npmjs.com/package/@faker-js/faker
   * @default "faker"
   * @example
   * // 具名导入 fakerImportName=faker
   * import { faker } from 'path/to/faker';
   * // 默认导入（非具名导入）
   * import faker from 'path/to/faker';
   */
  fakerImportName?: string;

  /**
   * axios 模块的导入文件
   * @default axios
   */
  axiosImportFile?: string;

  /**
   * faker 模块的导入文件
   * @default @faker-js/faker
   */
  fakerImportFile?: string;

  /**
   * 请求内容类型判断
   */
  requestContentType?: string | RequestContentTypeMatch;

  /**
   * 响应状态判断
   */
  responseStatusCode?: string | RequestStatusCodeMatch;

  /**
   * 响应内容类型判断
   */
  responseContentType?: string | ResponseContentTypeMatch;

  /**
   * 处理请求 ID
   * @param {OperationContext} context
   * @returns {string}
   */
  operationIdNormalize?: OperationIdNormalize;

  /**
   * 生成文件的头部信息
   */
  header?: string;

  /**
   * 生成文件的尾部信息
   */
  footer?: string;

  /**
   * 是否需要在运行时验证接口的出入参
   */
  runtimeValidate?: boolean | RuntimeValidate;

  /**
   * 是否需要在运行时生成接口的模拟数据
   */
  runtimeMock?: boolean | RuntimeMock;

  /**
   * 是否生成 schema
   */
  writeSchema?: boolean;
}

export interface PrinterConfigs {
  /**
   * 文档名称
   */
  document?: string;

  /**
   * file cwd
   */
  cwd?: string;

  /**
   * file path
   */
  mainFile?: string;
  typeFile?: string;
  zodFile?: string;
  mockFile?: string;

  hideHeaders?: boolean;
  hideFooters?: boolean;
  hideAlert?: boolean;
  hideInfo?: boolean;
  hideImports?: boolean;
  hideSchemas?: boolean;
  hidePaths?: boolean;
}

export interface PrintResult {
  lang: 'ts' | 'json';
  code: string;
  errors: string[];
}

export interface PrintResults {
  main: PrintResult;
  type: PrintResult;
  zod: PrintResult;
  mock: PrintResult;
}
