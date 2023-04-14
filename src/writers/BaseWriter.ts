import { TypeAlias, TypeItem } from '../readers/types';
import { WriterOptions } from './types';
import prettier from 'prettier';

export class BaseWriter {
  static defaults: WriterOptions = {
    document: { components: [], paths: [] },
    prettier: {
      singleQuote: true,
    },
  };

  options: WriterOptions;
  constructor(options: WriterOptions) {
    this.options = Object.assign({}, BaseWriter.defaults, options);
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
}
