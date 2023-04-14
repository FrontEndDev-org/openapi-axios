import { OpenAPIV3 } from 'openapi-types';
import { Named } from './Named';
import { ReaderOptions, StrictReaderOptions } from './types';

export class BaseReader {
  named = new Named();

  static defaults: ReaderOptions = {
    okCode: 200,
    okMediaType: 'application/json',
  };

  options: StrictReaderOptions;

  constructor(protected readonly document: OpenAPIV3.Document, options?: ReaderOptions) {
    this.options = Object.assign({}, BaseReader.defaults, options) as StrictReaderOptions;
  }

  protected isReference(
    object: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | OpenAPIV3.ParameterObject | OpenAPIV3.RequestBodyObject
  ): object is OpenAPIV3.ReferenceObject {
    return '$ref' in object;
  }
}
