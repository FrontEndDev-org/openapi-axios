interface OpenApiSpecBase {
  name: string;

  /**
   * 全局导入 axios 客户端，优先级低于每个 oas 配置，默认从 axios 官方导入，导入名称必须为 axios，例如
   * ```
   * import { axios } from '@/utils/axios';
   * ```
   */
  axiosImport?: string;
}

export interface OpenApiSpecAsRemote extends OpenApiSpecBase {
  url: string;
}

export type Spec = import('swagger-schema-official').Spec;

export interface OpenApiSpecAsLocal extends OpenApiSpecBase {
  spec: Spec;
}

export type OpenApiSpec = OpenApiSpecAsRemote | OpenApiSpecAsLocal;

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
   * 单个 oas 生成后回调
   * @param {Generated} generated
   */
  onGenerated?: (generated: Generated) => any;

  /**
   * OpenApiSpec 列表
   */
  list: OpenApiSpec[];
}

export type StrictConfig = Required<UserConfig>;

export enum ContentKind {
  JSON = 'JSON',
  URL_ENCODED = 'URL_ENCODED',
  FORM_DATA = 'FORM_DATA',
  TEXT = 'TEXT',
  OTHER = 'OTHER',
}

export interface Generated {
  files: string[];
  oasItem: OpenApiSpec;
  config: StrictConfig;
}

export type GenerateInfo = {
  index: number;
  length: number;
  done: boolean;
  start: number;
  end: number;
};
export type GeneratedCallback = (generated: Generated, info: GenerateInfo) => any;
