import { Config } from 'prettier';

export interface WriterOptions {
  axiosImport?: string;

  /**
   * 格式化配置
   */
  prettier?: Config;

  requestPathArgName?: string;
  requestQueryArgName?: string;
  requestBodyArgName?: string;

  responseTypeName?: 'Promise' | 'AxiosPromise' | string;
}
export type StrictWriterOptions = Required<WriterOptions>;
