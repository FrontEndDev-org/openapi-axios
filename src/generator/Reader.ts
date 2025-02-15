import type { OpenAPIAll } from '../types/openapi';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { bundleFromString, createConfig } from '@redocly/openapi-core';
import { migrate } from '../migrations';
import { isString } from '../utils/type-is';

type AcceptDocument = OpenAPIAll.Document | string;

export class Reader {
  cwd = process.cwd();

  async read(document: AcceptDocument) {
    const source = await this._read(document);
    const config = await createConfig({});
    const { problems, bundle } = await bundleFromString({ config, source });
    const errors: string[] = [];

    if (problems.length) {
      problems.forEach((p) => {
        errors.push(p.message);
      });
    }

    const migrated = migrate(bundle.parsed);
    migrated[0].errors.push(...errors);
    return migrated;
  }

  private async _read(document: AcceptDocument): Promise<string> {
    if (isString(document)) {
      if (/^https?:/i.test(document)) {
        return await this.readRemote(document);
      }
      else {
        return this.readLocal(document);
      }
    }
    else {
      return JSON.stringify(document);
    }
  }

  protected readLocal(file: string) {
    return fs.readFileSync(path.resolve(this.cwd, file), 'utf8');
  }

  protected async readRemote(url: string) {
    const resp = await fetch(url);
    if (resp.ok)
      return await resp.text();

    throw new Error(`${resp.status} ${resp.statusText}`);
  }

  protected readObject(document: OpenAPIAll.Document) {
    return document;
  }
}
