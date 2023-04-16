import { AcceptDocument, ParserOptions } from '../parsers/types';
import { PrinterOptions } from '../printers/types';

type RequiredWith<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export interface OpenAPIOptions {
  /**
   * openapi 的名称，将会生成 ${name}.ts 文件
   */
  name: string;

  /**
   * openapi 的 document，可以是一个链接地址，也可以是本地路径，也可以是一个对象
   */
  document: AcceptDocument;

  /**
   * 解析配置，优先级高于全局配置
   */
  parser?: ParserOptions;

  /**
   * 输出配置，优先级高于全局配置
   */
  printer?: PrinterOptions;
}

export interface GeneratorOptions {
  /**
   * 工作目录，默认为 process.cwd()
   */
  cwd?: string;

  /**
   * 生成文件目的地，默认为 src/apis
   */
  dest?: string;

  /**
   * 解析配置
   */
  parser?: ParserOptions;

  /**
   * 输出配置
   */
  printer?: PrinterOptions;

  /**
   * openapi 配置列表
   */
  openAPIs: OpenAPIOptions[];
}
export type StrictGeneratorOptions = RequiredWith<GeneratorOptions, 'cwd' | 'dest'>;

export type GeneratingStep = 'reading' | 'parsing' | 'printing' | 'writing' | 'generated';
export type GeneratingOptions = OpenAPIOptions & Pick<StrictGeneratorOptions, 'cwd' | 'dest'>;

export interface OpenAPIGenerating {
  index: number;
  count: number;
  step: GeneratingStep;
  options: GeneratingOptions;
  filePath: string;
}
