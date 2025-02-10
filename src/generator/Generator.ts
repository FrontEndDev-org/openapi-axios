import type { PrintResult } from '../printer/types';
import type {
  GeneratingOptions,
  GeneratingPayload,
  GeneratingStage,
  GeneratorEmits,
  GeneratorOptions,
  GeneratorPayload,
  OpenAPIOptions,
  StrictGeneratorOptions,
} from './types';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { Emitter } from 'strict-event-emitter';
import { normalizeError } from 'try-flatten';
import { Printer } from '../printer';
import { isString } from '../utils/type-is';
import { Reader } from './Reader';

export class Generator extends Emitter<GeneratorEmits> {
  static defaults: StrictGeneratorOptions = {
    cwd: process.cwd(),
    dest: '/src/apis',
    documents: {},
  };

  options: StrictGeneratorOptions;
  constructor(options: GeneratorOptions) {
    super();
    this.options = Object.assign({}, Generator.defaults, options) as StrictGeneratorOptions;
  }

  async generate() {
    const entries = Object.entries(this.options.documents);
    const count = entries.length;
    const payload: GeneratorPayload = { count };
    this.emit('start', payload);

    try {
      let index = 0;
      for (const [name, module] of entries) {
        const openAPI: OpenAPIOptions = isString(module) ? { document: module } : module;
        await this.#generateOpenAPI({ index, count, name }, openAPI);
        index++;
      }
    }
    catch (cause) {
      const err = normalizeError(cause);
      this.emit('error', err, payload);
      throw err;
    }

    this.emit('end', payload);
  }

  async #generateOpenAPI({ index, count, name }: { index: number; count: number; name: string }, openAPIOptions: OpenAPIOptions) {
    const { cwd, dest, ...globalPrinter } = this.options;
    const { document, fileName = `${name}.ts`, ...scopePrinter } = openAPIOptions;
    const mainFile = path.join(cwd, dest, fileName);
    const typeFile = mainFile.replace(/\.ts$/, '.type.ts');
    const schemaFile = mainFile.replace(/\.ts$/, '.schema.ts');

    // 1. 参数合并
    const printerOptions = Object.assign({}, globalPrinter, scopePrinter);
    const options: GeneratingOptions = {
      ...openAPIOptions,
      cwd,
      dest,
      ...printerOptions,
    };
    const makePayload = (stage: GeneratingStage): GeneratingPayload => ({
      index,
      count,
      name,
      stage,
      options,
      file: mainFile,
    });

    // 2. 读取
    this.emit('process', makePayload('reading'));
    const reader = new Reader();
    reader.cwd = cwd;
    const openAPIV3Document = await reader.read(document);

    // 3. 输出
    this.emit('process', makePayload('printing'));
    const printer = new Printer(openAPIV3Document, printerOptions);
    const { type, main, schema } = printer.print({ document: name, cwd, mainFile, typeFile, schemaFile });

    // 4. 写入
    this.emit('process', makePayload('writing'));
    fs.mkdirSync(path.dirname(mainFile), { recursive: true });

    this.#writePrintResult('main', mainFile, main);
    this.#writePrintResult('type', typeFile, type);
    this.#writePrintResult('schema', schemaFile, schema);

    this.emit('process', makePayload('generated'));
  }

  #writePrintResult(type: string, file: string, printResult: PrintResult) {
    if (!printResult.code)
      return;

    const { cwd } = this.options;

    fs.writeFileSync(file, printResult.code, 'utf8');

    if (printResult.errors.length) {
      const p = path.relative(cwd, file);
      console.warn(`[${type}] 发现了 ${printResult.errors.length} 处错误，请检查文件 ${p}，可能会出现非预期错误`);
      printResult.errors.forEach((error) => {
        console.warn(error);
      });
    }
  }
}
