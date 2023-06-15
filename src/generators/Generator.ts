import fs from 'fs';
import path from 'path';
import process from 'process';
import { Emitter } from 'strict-event-emitter';
import { normalizeError } from 'try-flatten';
import { DocumentParser } from '../parsers/DocumentParser';
import { DocumentPrinter } from '../printers/DocumentPrinter';
import { Reader } from './Reader';
import type {
  GeneratingOptions,
  GeneratingStage,
  GeneratorEmits,
  GeneratorOptions,
  GeneratingPayload,
  OpenAPIOptions,
  StrictGeneratorOptions,
  GeneratorPayload,
} from './types';

export class Generator extends Emitter<GeneratorEmits> {
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
    const count = this.options.openAPIs.length;
    const payload: GeneratorPayload = { count };
    this.emit('start', payload);

    try {
      let index = 0;
      for (const openAPI of this.options.openAPIs) {
        await this.generateOpenAPI(index, count, openAPI, this.options);
        index++;
      }
    } catch (cause) {
      const err = normalizeError(cause);
      this.emit('error', err, payload);
      throw err;
    }

    this.emit('end', payload);
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
      ...openAPIOptions,
      cwd,
      dest,
      parser: parserOptions,
      printer: printerOptions,
    };
    const makePayload = (step: GeneratingStage): GeneratingPayload => ({
      index,
      count,
      stage: step,
      options,
      filePath,
    });

    // 2. 读取
    this.emit('process', makePayload('reading'));
    const reader = new Reader();
    reader.cwd = cwd;
    const openAPIV3Document = await reader.read(document);

    // 3. 解析
    this.emit('process', makePayload('parsing'));
    const parser = new DocumentParser(openAPIV3Document, parserOptions);
    const types = parser.parse();

    // 4. 输出
    this.emit('process', makePayload('printing'));
    const printer = new DocumentPrinter(types, printerOptions);
    const text = printer.print();

    // 5. 写入
    this.emit('process', makePayload('writing'));
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, text, 'utf8');

    this.emit('process', makePayload('generated'));
  }
}
