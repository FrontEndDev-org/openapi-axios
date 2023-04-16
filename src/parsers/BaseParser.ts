import * as process from 'process';
import { OpenAPIV3, OpenAPIV3Document } from '../types/openapi';
import { INTERNAL_TYPE_NAMES, JSON_MIME } from './const';
import { Named } from './Named';
import { ParserOptions, StrictParserOptions, TypeAlias, TypeItem } from './types';

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

  options: StrictParserOptions;

  constructor(protected document: OpenAPIV3Document, options?: ParserOptions) {
    this.options = Object.assign({}, BaseParser.defaults, options) as StrictParserOptions;
    INTERNAL_TYPE_NAMES.forEach(this.named.internalName.bind(this.named));
    this.init();
  }

  protected init() {
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
