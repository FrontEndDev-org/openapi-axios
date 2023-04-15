import { TypeAlias, TypeDocument, TypeItem } from '../readers/types';
import { joinSlices } from '../utils/string';
import { StrictWriterOptions, WriterOptions } from './types';
import prettier from 'prettier';

export class BaseWriter {
  static defaults: StrictWriterOptions = {
    axiosImport: `import { Axios } from 'axios';
const axios = new Axios();`,
    prettier: {
      singleQuote: true,
    },
    requestPathArgName: 'path',
    requestQueryArgName: 'params',
    requestBodyArgName: 'data',
    responseTypeName: 'AxiosPromise',
  };

  options: StrictWriterOptions;
  constructor(readonly document: TypeDocument, options?: WriterOptions) {
    this.options = Object.assign({}, BaseWriter.defaults, options) as StrictWriterOptions;
    this.init();
  }

  init() {
    //
  }

  protected isTypeAlias(type: TypeItem): type is TypeAlias {
    return type.kind === 'alias';
  }

  protected format(text: string) {
    return prettier.format(text, {
      ...this.options.prettier,
      parser: 'typescript',
    });
  }

  // 头部声明
  statements: string[] = [];

  // 头部导入
  imports: string[] = [];

  // 帮助类型
  helpers: string[] = [];

  writeStatements() {
    return joinSlices(this.statements);
  }

  writeImports() {
    return this.format(joinSlices(this.imports));
  }

  writeHelpers() {
    return this.format(joinSlices(this.helpers));
  }
}
