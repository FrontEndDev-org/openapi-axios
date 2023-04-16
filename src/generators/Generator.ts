import fs from 'fs';
import path from 'path';
import * as process from 'process';
import { DocumentParser } from '../parsers/DocumentParser';
import { DocumentPrinter } from '../printers/DocumentPrinter';
import { Reader } from './Reader';
import { GeneratorOptions, OpenAPIOptions, StrictGeneratorOptions } from './types';

export class Generator {
  static defaults: StrictGeneratorOptions = {
    cwd: process.cwd(),
    dest: '/src/apis',
    openAPIs: [],
  };

  options: StrictGeneratorOptions;
  constructor(options: GeneratorOptions) {
    this.options = Object.assign({}, Generator.defaults, options) as StrictGeneratorOptions;
  }

  async generate() {
    for (const openAPI of this.options.openAPIs) {
      await this.generateOpenAPI(openAPI, this.options);
    }
  }

  protected async generateOpenAPI(openAPIOptions: OpenAPIOptions, generatorOptions: StrictGeneratorOptions) {
    const { cwd, dest, parser: globalParser, printer: globalPrinter } = generatorOptions;
    const { name, document, parser: scopeParser, printer: scopePrinter } = openAPIOptions;

    // 1. 参数合并
    const parserOptions = Object.assign({}, globalParser, scopeParser);
    const printerOptions = Object.assign({}, globalPrinter, scopePrinter);

    // 2. 读取
    const reader = new Reader();
    reader.cwd = cwd;
    const openAPIV3Document = await reader.read(document);

    // 3. 解析
    const parser = new DocumentParser(openAPIV3Document, parserOptions);
    const types = parser.parse();

    // 4. 输出
    const printer = new DocumentPrinter(types, printerOptions);
    const text = printer.print();

    // 5. 生成
    const fileName = `${name}.ts`;
    const filePath = path.join(cwd, dest, fileName);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, text, 'utf8');
  }
}
