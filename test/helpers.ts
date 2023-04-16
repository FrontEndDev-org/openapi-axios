import * as crypto from 'crypto';
import fs from 'fs';
import * as os from 'os';
import { pkgName, pkgVersion } from '../src';
import { isString } from '../src/utils/type-is';
import path from 'path';

export function writeFile(name: string, data: string | Record<string, any>) {
  fs.writeFileSync(path.join(__dirname, 'files', name), isString(data) ? data : JSON.stringify(data), 'utf8');
}

/**
 * 创建临时目录【必存在】
 * @returns {string}
 */
export function createTempDirname() {
  const d = path.join(os.tmpdir(), pkgName, pkgVersion, crypto.randomUUID() + '.d');
  fs.mkdirSync(d, { recursive: true });
  return [
    d,
    () => {
      try {
        fs.rmSync(d, { force: true });
      } catch (cause) {
        // ignore
      }
    },
  ] as const;
}
