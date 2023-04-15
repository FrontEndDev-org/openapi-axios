import { OpenAPIV3 } from 'openapi-types';
import { INTERNAL_TYPE_NAMES, JSON_MIME } from '../const';
import { Named } from './Named';
import { ReaderOptions, StrictReaderOptions, TypeAlias, TypeItem } from './types';

export class BaseReader {
  named = new Named();

  static defaults: StrictReaderOptions = {
    okCode: 200,
    okMediaType: JSON_MIME,
    requestPathTypeName: 'ReqPath',
    requestQueryTypeName: 'ReqParams',
    requestBodyTypeName: 'ReqData',
    responseBodyTypeName: 'ResData',
  };

  options: StrictReaderOptions;

  constructor(readonly document: OpenAPIV3.Document, options?: ReaderOptions) {
    this.options = Object.assign({}, BaseReader.defaults, options) as StrictReaderOptions;
    INTERNAL_TYPE_NAMES.forEach(this.named.internalName.bind(this.named));
    this.init();
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
