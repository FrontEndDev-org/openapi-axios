import { Config } from 'prettier';
import { TypeDocument } from '../readers/types';

export interface WriterOptions {
  /**
   * 解析后的文档
   */
  document: TypeDocument;

  /**
   * 格式化配置
   */
  prettier?: Config;
}
