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
    const { query, path } = parameters
      ? this.parseOperationParameters(parameters)
      : { query: undefined, path: undefined };
    const name = this.named.nextOperationId(this.parsingMethod, this.parsingUrl, operation.operationId);
    const requestBodyTypeName = this.named.nextTypeName(name + 'RequestBody', '');
    const responseBodyTypeName = this.named.nextTypeName(name + 'ResponseBody', '');
    const requestBody = requestBodySchema
      ? this.parseOperationRequest(requestBodyTypeName, requestBodySchema)
      : undefined;

    return {
      name,
      method: this.parsingMethod,
      url: this.parsingUrl,
      summary: operation.summary,
      description: operation.description,
      deprecated: operation.deprecated,
      request: {
        query,
        path,
        body: requestBody,
      },
      response: {
        body: this.parseOperationResponse(responseBodyTypeName, operation.responses),
      },
    };
  }

  protected parseOperationParameters(parameters: NonNullable<OpenAPIV3.OperationObject['parameters']>): TypeQueryPath {
    const query: TypeList = [];
    const path: TypeList = [];

    parameters.forEach((parameter) => {
      const t = this.parseOperationParameter(parameter);

      if (!t) return;

      if ('in' in parameter && parameter.in === 'path') {
        path.push(t);
      } else {
        query.push(t);
      }
    });

    return { query, path };
  }

  protected parseOperationParameter(parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject) {
    if (this.isReference(parameter)) return;

    const { schema, name, required = false } = parameter;
    if (!schema) return;

    return this.isReference(schema) ? this.parseReference(name, schema) : this.parseSchema(name, required, schema);
  }

  parseOperationRequest(name: string, body: NonNullable<OpenAPIV3.OperationObject['requestBody']>) {
    if (this.isReference(body)) return this.parseSchemaNever(name, true, {});
    const { content } = body;
    const okMedia = content[this.options.okMediaType];
    return this.parseOperationMedia(name, okMedia);
  }

  protected parseOperationResponse(name: string, responses: NonNullable<OpenAPIV3.ResponsesObject>) {
    const okResponse = responses[this.options.okCode];

    if (!okResponse) return;
    if (this.isReference(okResponse)) return;

    const { content } = okResponse;
    if (!content) return;

    const okMedia = content[this.options.okMediaType];
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
