import fs from 'fs';
import path from 'path';
import * as process from 'process';
import { Emitter } from 'strict-event-emitter';
import { normalizeError } from 'try-flatten';
import { DocumentParser } from '../parsers/DocumentParser';
import { DocumentPrinter } from '../printers/DocumentPrinter';
import { Reader } from './Reader';
import {
  GeneratingOptions,
  GeneratingStep,
  GeneratorOptions,
  OpenAPIGenerating,
  OpenAPIOptions,
  StrictGeneratorOptions,
} from './types';

export class Generator extends Emitter<{
  // 所有开始
  start: [];
  // 所有结束
  end: [];
  // 处理中
  processing: [OpenAPIGenerating];
  error: [Error];
}> {
  static defaults: StrictGeneratorOptions = {
    cwd: process.cwd(),
    dest: '/src/apis',
    openAPIs: [],
  };

  options: StrictGeneratorOptions;
  constructor(options: GeneratorOptions) {
    super();
    this.options = Object.assign({}, Generator.defaults, options) as StrictGeneratorOptions;
  }

  async generate() {
    this.emit('start');

    try {
      let index = 0;
      const count = this.options.openAPIs.length;
      for (const openAPI of this.options.openAPIs) {
        await this.generateOpenAPI(index, count, openAPI, this.options);
        index++;
      }
    } catch (cause) {
      const err = normalizeError(cause);
      this.emit('error', err);
      throw err;
    }

    this.emit('end');
  }

  protected async generateOpenAPI(
    index: number,
    count: number,
    openAPIOptions: OpenAPIOptions,
    generatorOptions: StrictGeneratorOptions
  ) {
    const { cwd, dest, parser: globalParser, printer: globalPrinter } = generatorOptions;
    const { name, document, parser: scopeParser, printer: scopePrinter } = openAPIOptions;
    const fileName = `${name}.ts`;
    const filePath = path.join(cwd, dest, fileName);

    // 1. 参数合并
    const parserOptions = Object.assign({}, globalParser, scopeParser);
    const printerOptions = Object.assign({}, globalPrinter, scopePrinter);
    const options: GeneratingOptions = {
      cwd,
      dest,
      ...openAPIOptions,
      parser: parserOptions,
      printer: printerOptions,
    };
    const makeArg = (step: GeneratingStep): OpenAPIGenerating => ({
      index,
      count,
      step,
      options,
      filePath,
    });

    // 2. 读取
    this.emit('processing', makeArg('reading'));
    const reader = new Reader();
    reader.cwd = cwd;
    const openAPIV3Document = await reader.read(document);

    // 3. 解析
    this.emit('processing', makeArg('parsing'));
    const parser = new DocumentParser(openAPIV3Document, parserOptions);
    const types = parser.parse();

    // 4. 输出
    this.emit('processing', makeArg('printing'));
    const printer = new DocumentPrinter(types, printerOptions);
    const text = printer.print();

    // 5. 写入
    this.emit('processing', makeArg('writing'));
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, text, 'utf8');

    this.emit('processing', makeArg('generated'));
  }
}
