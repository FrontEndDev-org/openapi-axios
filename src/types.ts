interface OasBase {
  name: string;

  /**
   * 全局导入 axios 客户端，优先级低于每个 oas 配置，默认从 axios 官方导入，导入名称必须为 axios，例如
   * ```
   * import { axios } from '@/utils/axios';
   * ```
   */
  axiosImport?: string;
}

export interface OasAsUrl extends OasBase {
  url: string;
}

export interface OasAsSpec extends OasBase {
  spec: import('swagger-schema-official').Spec;
}

export type Oas = OasAsUrl | OasAsSpec;

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
   * 导入 axios 客户端，优先级高于全局配置，默认从 axios 官方导入，导入名称必须为 axios，例如
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
   * oas 列表
   */
  list: Oas[];
}

export type StrictConfig = Required<UserConfig>;

export enum ContentKind {
  JSON = 'JSON',
  URL_ENCODED = 'URL_ENCODED',
  FORM_DATA = 'FORM_DATA',
  TEXT = 'TEXT',
  OTHER = 'OTHER',
}
