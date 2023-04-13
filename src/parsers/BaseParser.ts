import { OpenAPIV3 } from 'openapi-types';
import { Named } from './Named';
import { ParseOptions } from './types';

export class BaseParser {
  named = new Named();

  static defaults: ParseOptions = {
    okCode: 200,
    okMediaType: 'application/json',
  };

  options: ParseOptions;

  constructor(protected readonly document: OpenAPIV3.Document, options?: Partial<ParseOptions>) {
    this.options = Object.assign({}, BaseParser.defaults, options);
  }

  protected isReference(
    object: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | OpenAPIV3.ParameterObject | OpenAPIV3.RequestBodyObject
  ): object is OpenAPIV3.ReferenceObject {
    return '$ref' in object;
  }
}
