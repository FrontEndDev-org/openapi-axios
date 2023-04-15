import { OpenAPIV3 } from 'openapi-types';
import { ComponentsReader } from './ComponentsReader';
import { methods } from './const';
import { TypeList, TypeOperation, TypeOperations, TypeOrigin } from './types';

export class PathsReader extends ComponentsReader {
  readingUrl = '';
  readingMethod: OpenAPIV3.HttpMethods = OpenAPIV3.HttpMethods.GET;

  readPaths(): TypeOperations {
    const { paths } = this.document;
    const types: TypeOperations = [];

    Object.entries(paths)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([url, pathItem]) => {
        if (!pathItem) return;

        this.readingUrl = url;
        types.push(...this.readPathItem(pathItem));
      });

    this.named.resolveAlias();
    return types;
  }

  protected readPathItem(pathItem: OpenAPIV3.PathItemObject) {
    const types: TypeOperations = [];

    methods.forEach((method) => {
      const operation = pathItem[method];

      if (!operation) return;

      this.readingMethod = method;
      types.push(this.readOperation(operation));
    });

    return types;
  }

  readOperation(operation: OpenAPIV3.OperationObject): TypeOperation {
    const { parameters, requestBody: requestBodySchema } = operation;
    const { pathTypes, queryTypes } = this.readOperationParameters(parameters);
    const name = this.named.nextOperationId(this.readingMethod, this.readingUrl, operation.operationId);
    const requestPathTypeName = this.named.nextTypeName(name + this.options.requestPathTypeName);
    const requestQueryTypeName = this.named.nextTypeName(name + this.options.requestQueryTypeName);
    const requestBodyTypeName = this.named.nextTypeName(name + this.options.requestBodyTypeName);
    const responseBodyTypeName = this.named.nextTypeName(name + this.options.responseBodyTypeName);
    const requestBody = this.readOperationRequest(requestBodyTypeName, requestBodySchema);

    return {
      name,
      method: this.readingMethod,
      url: this.readingUrl,
      title: operation.summary,
      description: operation.description,
      deprecated: operation.deprecated,
      request: {
        path: this.wrapParameters(requestPathTypeName, pathTypes),
        query: this.wrapParameters(requestQueryTypeName, queryTypes),
        body: requestBody,
      },
      response: {
        body: this.readOperationResponse(responseBodyTypeName, operation.responses),
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
      // 有一个必填属性时，则该对象必填
      required: types.some((type) => (this.isTypeAlias(type) ? true : type.required)),
      children: types,
    };
  }

  protected readOperationParameters(parameters: OpenAPIV3.OperationObject['parameters'] = []) {
    const pathTypes: TypeList = [];
    const queryTypes: TypeList = [];

    parameters.forEach((parameter) => {
      const t = this.readOperationParameter(parameter);

      if (!t) return;

      if ('in' in parameter && parameter.in === 'path') {
        pathTypes.push(t);
      } else {
        queryTypes.push(t);
      }
    });

    return { pathTypes, queryTypes };
  }

  protected readOperationParameter(parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject) {
    if (this.isReference(parameter)) return;

    const { schema, name, required = false, deprecated, description, example } = parameter;
    if (!schema) return;

    return this.isReference(schema)
      ? this.readReference(name, schema)
      : this.readSchema(name, required, {
          deprecated,
          description,
          example,
          ...schema,
        });
  }

  readOperationRequest(name: string, body: OpenAPIV3.OperationObject['requestBody']) {
    if (!body) return;
    if (this.isReference(body)) return;

    const { content } = body;
    const okMedia = content[this.options.okMediaType];
    if (!okMedia) return;

    return this.readOperationMedia(name, okMedia);
  }

  protected readOperationResponse(name: string, responses: NonNullable<OpenAPIV3.ResponsesObject>) {
    const okResponse = responses[this.options.okCode];

    if (!okResponse) return;
    if (this.isReference(okResponse)) return;

    const { content } = okResponse;
    if (!content) return;

    const okMedia = content[this.options.okMediaType];
    if (!okMedia) return;

    return this.readOperationMedia(name, okMedia);
  }

  protected readOperationMedia(name: string, media: OpenAPIV3.MediaTypeObject) {
    const { schema } = media;

    if (!schema) return this.readSchemaNever(name, true, {});

    return this.isReference(schema)
      ? this.readReference(name, schema)
      : this.readSchema(name, schema.nullable === false, schema);
  }
}
