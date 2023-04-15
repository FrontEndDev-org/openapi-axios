import axios from 'axios';
import fs from 'fs';
import path from 'path';
import * as process from 'process';
import { INTERNAL_TYPE_NAMES, JSON_MIME } from '../const';
import { OpenAPIV3Document, OpenAPIV3 } from '../types/openapi';
import { isString } from '../utils/type-is';
import { Named } from './Named';
import { AcceptDocument, ParserOptions, StrictParserOptions, TypeAlias, TypeItem } from './types';

export class BaseParser {
  named = new Named();

  static defaults: StrictParserOptions = {
    cwd: process.cwd(),
    okCode: 200,
    okMediaType: JSON_MIME,
    requestPathTypeName: 'ReqPath',
    requestQueryTypeName: 'ReqParams',
    requestBodyTypeName: 'ReqData',
    responseBodyTypeName: 'ResData',
  };

  document?: OpenAPIV3Document;
  options: StrictParserOptions;

  constructor(options?: ParserOptions) {
    this.options = Object.assign({}, BaseParser.defaults, options) as StrictParserOptions;
    INTERNAL_TYPE_NAMES.forEach(this.named.internalName.bind(this.named));
    this.init();
  }

  async read(document: AcceptDocument) {
    if (isString(document)) {
      if (/^https?:/i.test(document)) {
        this.document = await this.readRemote(document);
      } else {
        this.document = this.readLocal(document);
      }
    } else {
      this.document = this.readObject(document);
    }
  }

  protected readLocal(file: string) {
    const data = fs.readFileSync(path.resolve(this.options.cwd, file), 'utf8');
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

  init() {
    //
  }

  protected isReference(
    object: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | OpenAPIV3.ParameterObject | OpenAPIV3.RequestBodyObject
  ): object is OpenAPIV3.ReferenceObject {
    return '$ref' in object;
  }

  protected isTypeAlias(type: TypeItem): type is TypeAlias {
    return type.kind === 'alias';
  }
}
