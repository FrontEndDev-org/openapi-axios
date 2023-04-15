import { OpenAPIV3 } from 'openapi-types';
import { ComponentsReader } from './ComponentsReader';
import { methods } from './const';
import { TypeList, TypeOperation, TypeOperations, TypeOrigin } from './types';

export class PathsReader extends ComponentsReader {
  parsingUrl = '';
  parsingMethod: OpenAPIV3.HttpMethods = OpenAPIV3.HttpMethods.GET;

  parsePaths(): TypeOperations {
    const { paths } = this.document;
    const types: TypeOperations = [];

    Object.entries(paths)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([url, pathItem]) => {
        if (!pathItem) return;

        this.parsingUrl = url;
        types.push(...this.parsePathItem(pathItem));
      });

    this.named.resolveAlias();
    return types;
  }

  protected parsePathItem(pathItem: OpenAPIV3.PathItemObject) {
    const types: TypeOperations = [];

    methods.forEach((method) => {
      const operation = pathItem[method];

      if (!operation) return;

      this.parsingMethod = method;
      types.push(this.parseOperation(operation));
    });

    return types;
  }

  parseOperation(operation: OpenAPIV3.OperationObject): TypeOperation {
    const { parameters, requestBody: requestBodySchema } = operation;
    const { pathTypes, queryTypes } = this.parseOperationParameters(parameters);
    const name = this.named.nextOperationId(this.parsingMethod, this.parsingUrl, operation.operationId);
    const requestPathTypeName = this.named.nextTypeName(name + 'RequestPath', '');
    const requestQueryTypeName = this.named.nextTypeName(name + 'RequestQuery', '');
    const requestBodyTypeName = this.named.nextTypeName(name + 'RequestBody', '');
    const responseBodyTypeName = this.named.nextTypeName(name + 'ResponseBody', '');
    const requestBody = this.parseOperationRequest(requestBodyTypeName, requestBodySchema);

    return {
      name,
      method: this.parsingMethod,
      url: this.parsingUrl,
      title: operation.summary,
      description: operation.description,
      deprecated: operation.deprecated,
      request: {
        path: this.wrapParameters(requestPathTypeName, pathTypes),
        query: this.wrapParameters(requestQueryTypeName, queryTypes),
        body: requestBody,
      },
      response: {
        body: this.parseOperationResponse(responseBodyTypeName, operation.responses),
      },
    };
  }

  protected wrapParameters(name: string, types?: TypeList): TypeOrigin | undefined {
    if (!types) return;
    if (types.length === 0) return;

    return {
      kind: 'origin',
      name,
      type: 'object',
      required: true,
      children: types,
    };
  }

  protected parseOperationParameters(parameters: OpenAPIV3.OperationObject['parameters'] = []) {
    const pathTypes: TypeList = [];
    const queryTypes: TypeList = [];

    parameters.forEach((parameter) => {
      const t = this.parseOperationParameter(parameter);

      if (!t) return;

      if ('in' in parameter && parameter.in === 'path') {
        pathTypes.push(t);
      } else {
        queryTypes.push(t);
      }
    });

    return { pathTypes, queryTypes };
  }

  protected parseOperationParameter(parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject) {
    if (this.isReference(parameter)) return;

    const { schema, name, required = false } = parameter;
    if (!schema) return;

    return this.isReference(schema) ? this.parseReference(name, schema) : this.parseSchema(name, required, schema);
  }

  parseOperationRequest(name: string, body: OpenAPIV3.OperationObject['requestBody']) {
    if (!body) return;
    if (this.isReference(body)) return;

    const { content } = body;
    const okMedia = content[this.options.okMediaType];
    if (!okMedia) return;

    return this.parseOperationMedia(name, okMedia);
  }

  protected parseOperationResponse(name: string, responses: NonNullable<OpenAPIV3.ResponsesObject>) {
    const okResponse = responses[this.options.okCode];

    if (!okResponse) return;
    if (this.isReference(okResponse)) return;

    const { content } = okResponse;
    if (!content) return;

    const okMedia = content[this.options.okMediaType];
    if (!okMedia) return;

    return this.parseOperationMedia(name, okMedia);
  }

  protected parseOperationMedia(name: string, media: OpenAPIV3.MediaTypeObject) {
    const { schema } = media;

    if (!schema) return this.parseSchemaNever(name, true, {});

    return this.isReference(schema)
      ? this.parseReference(name, schema)
      : this.parseSchema(name, schema.nullable === false, schema);
  }
}
