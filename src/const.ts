import * as path from 'path';

export const pkgName = process.env.PKG_NAME!;
export const pkgVersion = process.env.PKG_VERSION!;

const dirname = __dirname;

export const templatesDir = path.join(dirname, '../templates');
export const axiosImportDefault = `import { Axios } from 'axios';
const axios = new Axios();`;
export const helpersImport = `import { formatHeaders, formatBody } from 'openapi-axios/helpers';`;

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
