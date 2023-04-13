import { OpenAPIV3 } from 'openapi-types';
import { ComponentsParser } from './ComponentsParser';
import { methods } from './const';
import { TypeItem, TypeList, TypeOperation, TypeOperations, TypeQueryPath } from './types';

export class PathsParser extends ComponentsParser {
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
    const { parameters, requestBody } = operation;
    const { query, path } = parameters
      ? this.parseOperationParameters(parameters)
      : { query: undefined, path: undefined };

    const name = this.named.nextOperationId(this.parsingMethod, this.parsingUrl, operation.operationId);
    const reqTypeName = this.named.nextTypeName(name + 'Request');
    const resTypeName = this.named.nextTypeName(name + 'Response');
    return {
      name,
      method: this.parsingMethod,
      url: this.parsingUrl,
      query,
      path,
      summary: operation.summary,
      description: operation.description,
      deprecated: operation.deprecated,
      body: requestBody ? this.parseOperationRequest(reqTypeName, requestBody) : undefined,
      resp: this.parseOperationResponse(resTypeName, operation.responses),
    };
  }

  protected parseOperationParameters(parameters: NonNullable<OpenAPIV3.OperationObject['parameters']>): TypeQueryPath {
    const query: TypeList = [];
    const path: TypeList = [];

    parameters.forEach((parameter) => {
      if (this.isReference(parameter)) return;

      const ti = this.parseOperationParameter(parameter);

      if ('in' in ti && ti.in === 'path') {
        path.push(ti);
      } else {
        query.push(ti);
      }
    });

    return { query, path };
  }

  protected parseOperationParameter(parameter: OpenAPIV3.ParameterObject): TypeItem {
    const { name, required = false, schema } = parameter;

    if (!schema) return this.parseSchemaNever(name, required, {});

    return this.isReference(schema) ? this.parseSchemaNever(name, true, {}) : this.parseSchema(name, required, schema);
  }

  parseOperationRequest(name: string, body: NonNullable<OpenAPIV3.OperationObject['requestBody']>) {
    if (this.isReference(body)) return this.parseSchemaNever(name, true, {});
    const { content } = body;
    const okMedia = content[this.options.okMediaType];
    return this.parseOperationMedia(name, okMedia);
  }

  protected parseOperationResponse(name: string, responses: NonNullable<OpenAPIV3.ResponsesObject>) {
    const okResponse = responses[this.options.okCode];

    if (!okResponse) return this.parseSchemaNever(name, true, {});
    if (this.isReference(okResponse)) return this.parseSchemaNever(name, true, {});

    const { content } = okResponse;
    if (!content) return this.parseSchemaNever(name, true, {});
    const okMedia = content[this.options.okMediaType];
    return this.parseOperationMedia(name, okMedia);
  }

  protected parseOperationMedia(name: string, media: OpenAPIV3.MediaTypeObject) {
    const { schema } = media;

    if (!schema) return this.parseSchemaNever(name, true, {});

    return this.isReference(schema)
      ? this.parseReference(schema)
      : this.parseSchema(name, schema.nullable === false, schema);
  }
}
