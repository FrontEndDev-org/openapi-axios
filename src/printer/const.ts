// @ref https://github.com/microsoft/TypeScript/issues/2536
export const KEYWORD_VARS = [
  // 保留字
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'new',
  'null',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  // 严格保留字
  'as',
  'implements',
  'interface',
  'let',
  'package',
  'private',
  'protected',
  'public',
  'static',
  'yield',
  'namespace',
  'async',
  'await',
  // // 上下文关键字
  // 'any',
  // 'boolean',
  // 'constructor',
  // 'declare',
  // 'get',
  // 'module',
  // 'require',
  // 'number',
  // 'set',
  // 'string',
  // 'symbol',
  // 'type',
  // 'from',
  // 'of',
];

export const AXIOS_IMPORT_NAME = 'axios';
export const ZOD_IMPORT_NAME = 'z';
export const AXIOS_IMPORT_FILE = 'axios';
export const ZOD_IMPORT_FILE = 'zod';
export const AXIOS_PARAM_CONFIG_NAME = 'config';
export const AXIOS_RESPONSE_NAME = 'resp';
export const AXIOS_PARAM_TRANSFORM_RESPONSE_NAME = 'transformResponse';
export const AXIOS_TYPE_IMPORT_FILE = 'axios';
export const AXIOS_REQUEST_TYPE_NAME = 'AxiosRequestConfig';
export const INTERNAL_VARS = [
  // config
  AXIOS_IMPORT_NAME,
  ZOD_IMPORT_NAME,
  AXIOS_PARAM_CONFIG_NAME,
  AXIOS_RESPONSE_NAME,
];
/**
 * 合并导出类型名称
 */
export const TYPE_FILE_EXPORT_NAME = 'Type';
export const INTERNAL_TYPES = [
  // native
  'Blob',
  'Array',
  'Object',
  // typeScript
  'string',
  'number',
  'boolean',
  'any',
  'unknown',
  'void',
  'never',
  'null',
  'undefined',
  'object',
  'symbol',
  'bigint',
  'Record',
  // axios
  AXIOS_REQUEST_TYPE_NAME,
  // type
  TYPE_FILE_EXPORT_NAME,
];
