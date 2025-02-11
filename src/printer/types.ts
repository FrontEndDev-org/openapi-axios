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

export interface PrinterOptions {
  /**
   * axios 导入名称，为空字符串时默认导入
   * @default ""
   * @example
   * // 具名导入
   * import { axios } from 'axios';
   * // 默认导入（非具名导入）
   * import axios from 'axios';
   */
  axiosImportName?: string;

  /**
   * zod 导入名称，为空字符串时默认导入
   * @default "z"
   * @example
   * // 具名导入 zodImportName=z
   * import { z } from 'zod';
   * // 默认导入（非具名导入）
   * import z from 'zod';
   */
  zodImportName?: string;

  /**
   * axios 模块的导入文件
   * @default axios
   */
  axiosImportFile?: string;

  /**
   * zod 模块的导入文件
   * @default zod
   */
  zodImportFile?: string;

  /**
   * axios 相关类型的导入文件
   * @default axios
   */
  axiosTypeImportFile?: string;

  /**
   * 请求配置类型名称
   * @default AxiosRequestConfig
   */
  axiosRequestConfigTypeName?: string;

  /**
   * 响应类型名称
   * @default AxiosResponse
   */
  axiosResponseTypeName?: string;

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
  runtimeValidate?: boolean;
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

  hideHeaders?: boolean;
  hideFooters?: boolean;
  hideAlert?: boolean;
  hideInfo?: boolean;
  hideImports?: boolean;
  hideSchemas?: boolean;
  hidePaths?: boolean;
}

export interface PrintResult {
  errors: string[];
  code: string;
}
