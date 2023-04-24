import type { TypeAlias, TypeDocument, TypeItem } from '../parsers/types';
import { joinSlices } from '../utils/string';
import type { StrictPrinterOptions, PrinterOptions } from './types';
import prettier from 'prettier';

export class BasePrinter {
  static defaults: StrictPrinterOptions = {
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

  options: StrictPrinterOptions;
  constructor(readonly document: TypeDocument, options?: PrinterOptions) {
    this.options = Object.assign({}, BasePrinter.defaults, options) as StrictPrinterOptions;
    this.init();
  }

  protected init() {
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

  protected printStatements() {
    return joinSlices(this.statements);
  }

  protected printImports() {
    return this.format(joinSlices(this.imports));
  }

  protected printHelpers() {
    return this.format(joinSlices(this.helpers));
  }
}
