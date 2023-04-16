import { OpenAPIV3 } from 'openapi-types';

export const HTTP_METHODS: OpenAPIV3.HttpMethods[] = [
  OpenAPIV3.HttpMethods.DELETE,
  OpenAPIV3.HttpMethods.GET,
  OpenAPIV3.HttpMethods.HEAD,
  OpenAPIV3.HttpMethods.OPTIONS,
  OpenAPIV3.HttpMethods.PATCH,
  OpenAPIV3.HttpMethods.POST,
  OpenAPIV3.HttpMethods.PUT,
  OpenAPIV3.HttpMethods.TRACE,
];

export const JSON_MIME = 'application/json';
export const BLOB_MIME = 'application/octet-stream';

// 内部类型名称，文档里如果重复了会生成新的唯一值
export const INTERNAL_TYPE_NAMES = [
  // native
  'Blob',
  // @ref ComponentsWriter
  'OneOf',
  // @ref PathsWriter
  'axios',
  'request',
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'PATCH',
  'POST',
  'PUT',
  'TRACE',
  'resolveURL',
  'BASE_URL',
  'AxiosPromise',
  'AxiosRequestConfig',
];
