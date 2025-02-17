import type { PrintResult } from '../printer/types';
import type { OpenAPILatest } from '../types/openapi';
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
import { OpenAPIVersion } from '../types/openapi';
import { formatTsCode } from '../utils/string';
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
    const zodFile = mainFile.replace(/\.ts$/, '.zod.ts');
    const schemaFiles: Record<OpenAPIVersion, string> = {
      [OpenAPIVersion.V2_0]: mainFile.replace(/\.ts$/, '.v2_0.json'),
      [OpenAPIVersion.V3_0]: mainFile.replace(/\.ts$/, '.v3_0.json'),
      [OpenAPIVersion.V3_1]: mainFile.replace(/\.ts$/, '.v3_1.json'),
    };

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
    const migrated = await reader.read(document);

    // 3. 输出
    this.emit('process', makePayload('printing'));
    const printer = new Printer(migrated.at(-1)!.document! as OpenAPILatest.Document, printerOptions);
    const { type, main, zod } = printer.print({ document: name, cwd, mainFile, typeFile, zodFile });

    // 4. 写入
    this.emit('process', makePayload('writing'));
    fs.mkdirSync(path.dirname(mainFile), { recursive: true });

    await this.#writePrintResult('main', mainFile, main);
    await this.#writePrintResult('type', typeFile, type);

    if (printerOptions.runtimeValidate) {
      await this.#writePrintResult('zod', zodFile, zod);
    }

    if (printerOptions.writeSchema) {
      for (const { version, document, errors } of migrated) {
        await this.#writePrintResult(`schema@${version}`, schemaFiles[version], {
          lang: 'json',
          code: JSON.stringify(document, null, 2),
          errors,
        });
      }
    }

    this.emit('process', makePayload('generated'));
  }

  async #writePrintResult(ns: string, file: string, printResult: PrintResult) {
    if (!printResult.code)
      return;

    const { cwd } = this.options;
    const { lang, code, errors } = printResult;
    const code2 = lang === 'ts' ? await formatTsCode(code) : code;

    fs.writeFileSync(file, code2, 'utf8');

    if (errors.length) {
      const p = path.relative(cwd, file);
      console.warn(`[${ns}] 发现了 ${errors.length} 处错误，请检查文件 ${p}，可能会出现非预期错误`);
      errors.forEach((error) => {
        console.warn(error);
      });
    }
  }
}
