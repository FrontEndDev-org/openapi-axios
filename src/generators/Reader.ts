import axios from 'axios';
import fs from 'fs';
import path from 'path';
import process from 'process';
import type { AcceptDocument } from '../parsers/types';
import type { OpenAPIV3Document } from '../types/openapi';
import { isString } from '../utils/type-is';

export class Reader {
  cwd = process.cwd();

  async read(document: AcceptDocument): Promise<OpenAPIV3Document> {
    if (isString(document)) {
      if (/^https?:/i.test(document)) {
        return await this.readRemote(document);
      } else {
        return this.readLocal(document);
      }
    } else {
      return this.readObject(document);
    }
  }

  static validate(document: AcceptDocument) {
    // TODO
  }

  protected readLocal(file: string) {
    const data = fs.readFileSync(path.resolve(this.cwd, file), 'utf8');
    return JSON.parse(data) as OpenAPIV3Document;
  }

  protected async readRemote(url: string) {
    const { data } = await axios.request<OpenAPIV3Document>({
      url,
      method: 'get',
    });
    return data;
  }

  protected readObject(document: OpenAPIV3Document) {
    return document;
  }
}
