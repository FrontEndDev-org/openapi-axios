import { axiosImportDefault } from './const';
import { Generated } from './generator';

export type OpenapiSpec = import('swagger-schema-official').Spec;
export type OpenapiConfig = {
  /**
   * openapi 的名称，将会生成 ${name}.ts 文件
   */
  name: string;

  /**
   * 导入 axios 客户端，默认从 axios 官方导入，导入名称必须为 axios，优先级高于全局配置，例如
   * ```
   * import { axios } from '@/utils/axios';
   * ```
   */
  axiosImport?: string;

  /**
   * 是否取消包装 data，默认 undefined，优先级高于全局配置
   * false = 返回值就是响应（response），response.data 才是实际值
   * true = 返回值就是数据
   */
  unwrapResponseData?: boolean;

  /**
   * openapi 的 schema，可以是一个链接地址，也可以是本地路径，也可以是一个对象
   */
  schema: string | OpenapiSpec;
};

export interface UserConfig {
  /**
   * 工作目录，默认为 process.cwd()
   */
  cwd?: string;

  /**
   * 生成文件目的地，默认为 src/apis
   */
  dest?: string;

  /**
   * 默认从 axios 官方导入，导入名称必须为 axios，例如
   * ```
   * import { axios } from '@/utils/axios';
   * ```
   */
  axiosImport?: string;

  /**
   * 是否取消包装 data，默认 false
   * false = 返回值就是响应（response），response.data 才是实际值
   * true = 返回值就是数据
   * @default false
   */
  unwrapResponseData?: boolean;

  /**
   * OpenapiConfig 列表
   */
  apis: OpenapiConfig[];
}

export type StrictConfig = Required<UserConfig>;
export const defaults: StrictConfig = {
  cwd: process.cwd(),
  dest: 'src/apis',
  axiosImport: axiosImportDefault,
  unwrapResponseData: false,
  apis: [],
};

export function defineConfig(config: UserConfig) {
  return Object.assign({}, defaults, config) as StrictConfig;
}
