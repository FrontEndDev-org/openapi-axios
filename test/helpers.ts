import type { PrinterConfigs, PrintResults } from '../src';
import type { OpenAPILatest } from '../src/types/openapi';
import * as crypto from 'node:crypto';
import fs from 'node:fs';
import * as os from 'node:os';
import path from 'node:path';
import { pkgName, pkgVersion } from '../src';
import { isString } from '../src/utils/type-is';

export function writeFile(name: string, data: string | Record<keyof unknown, unknown>) {
  fs.writeFileSync(path.join(__dirname, 'files', name), isString(data) ? data : JSON.stringify(data), 'utf8');
}

/**
 * 创建临时目录【必存在】
 */
export function createTempDirname() {
  const d = path.join(os.tmpdir(), pkgName, pkgVersion, `${crypto.randomUUID()}.d`);
  fs.mkdirSync(d, { recursive: true });
  return [
    d,
    () => {
      try {
        fs.rmSync(d, { force: true });
      }
      catch {
        // ignore
      }
    },
  ] as const;
}

export function exampleTest(version: string, name: string, test: (document: OpenAPILatest.Document, configs: PrinterConfigs) => PrintResults) {
  const src = path.join(__dirname, 'example-json', version, `${name}.json`);
  const dir = path.join(__dirname, 'example-dest', version);
  const document = fs.readFileSync(src, 'utf8');

  const mainFile = path.join(dir, `${name}.ts`);
  const typeFile = path.join(dir, `${name}.type.ts`);
  const zodFile = path.join(dir, `${name}.zod.ts`);

  const { main, type, zod } = test(JSON.parse(document), {
    mainFile,
    typeFile,
    zodFile,
  });

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(mainFile, main.code);
  fs.writeFileSync(typeFile, type.code);
  fs.writeFileSync(zodFile, zod.code);
}
