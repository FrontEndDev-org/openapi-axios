import fs from 'fs';
import { isString } from '../src/utils/type-is';
import path from 'path';

export function writeFile(name: string, data: string | Record<string, any>) {
  fs.writeFileSync(path.join(__dirname, 'files', name), isString(data) ? data : JSON.stringify(data), 'utf8');
}
