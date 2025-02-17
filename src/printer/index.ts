import type { OpenAPILatest } from '../types/openapi';
import type {
  OpenApiLatest_Media,
  OpenApiLatest_Operation,
  OpenApiLatest_Parameter,
  OpenApiLatest_PathItem,
  OpenApiLatest_Request,
  OpenApiLatest_Response,
  OpenApiLatest_Schema,
} from './helpers';
import type { PrinterConfigs, PrinterOptions, PrintResults } from './types';
import { pkgName, pkgVersion } from '../const';
import { OpenAPIVersion } from '../types/openapi';
import { toImportPath, toRelative } from '../utils/path';
import { isBoolean, isString, isUndefined } from '../utils/type-is';
import { Arg } from './Arg';
import { Args } from './Args';
import {
  AXIOS_IMPORT_FILE,
  AXIOS_IMPORT_NAME,
  AXIOS_PARAM_TRANSFORM_RESPONSE_NAME,
  AXIOS_REQUEST_TYPE_NAME,
  AXIOS_RESPONSE_NAME,
  AXIOS_RESPONSE_TYPE_NAME,
  AXIOS_TYPE_IMPORT_FILE,
  TYPE_FILE_EXPORT_NAME,
  ZOD_IMPORT_FILE,
  ZOD_IMPORT_NAME,
} from './const';
import { Content } from './Content';
import {
  isRefMedia,
  isRefOperation,
  isRefParameter,
  isRefPathItem,
  isRefRequest,
  isRefResponse,
  isRefSchema,
  toImportString,
  toZodName,
} from './helpers';
import { JsDoc } from './JsDoc';
import { Named } from './Named';
import { Parser } from './Parser';

const allowMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
const parameterTypes = ['query', 'header', 'path', 'cookie'];

type RequestMediaMatch = (contentType: string, content: OpenApiLatest_Media) => boolean;
type ResponseMediaMatch = (
  contentType: string,
  content: OpenApiLatest_Media,
  response: OpenAPILatest.ResponseObject,
) => boolean;

type ResponseMatch = (statusCode: string, response: OpenApiLatest_Response) => boolean;

type WithId<T> = T & {
  nodeId: string;
  namedId?: string;
};
type SchemaInfo = WithId<{
  position: 'root' | 'anchor';
  schema: OpenApiLatest_Schema;
  typeName: string;
  nodeName: string;
}>;
type RequestBodyInfo = WithId<{ requestBody: OpenApiLatest_Request }>;
type ParameterInfo = WithId<{ parameter: OpenApiLatest_Parameter }>;
type ResponseInfo = WithId<{ response: OpenApiLatest_Response }>;
type PathItemInfo = WithId<{ pathItem: OpenApiLatest_PathItem }>;

export class Printer {
  named = new Named({ internalVars: true, internalTypes: true });

  #mainContent = new Content();
  #typeContent = new Content();
  #zodContent = new Content();

  private configs: PrinterConfigs = {};

  constructor(
    private readonly document: OpenAPILatest.Document,
    private options?: PrinterOptions,
  ) {
    const { openapi } = document;

    if (!openapi)
      throw new Error('未找到 openapi 版本号');
    if (!openapi.startsWith(OpenAPIVersion.V3_1)) {
      throw new Error(`当前仅支持 openapi ${OpenAPIVersion.V3_1}，当前版本为 ${openapi}`);
    }

    this.registerComponents();
  }

  schemas: Record<string /** nodeId */, SchemaInfo> = {};
  // anchorSchemas: Record<string /** nodeId */, WithId<{ schema: OpenApiLatest_Schema; typeName: string }>> = {};
  requestBodies: Record<string /** nodeId */, RequestBodyInfo> = {};
  parameters: Record<string /** nodeId */, ParameterInfo> = {};
  responses: Record<string /** nodeId */, ResponseInfo> = {};
  pathItems: Record<string /** nodeId */, PathItemInfo> = {};

  argumentZodNames = new Set<string>();

  #parseRefComponent<T>(
    {
      kind,
      name,
      obj,
    }: {
      kind: keyof OpenAPILatest.ComponentsObject;
      name: string;
      obj: { $ref: string } | { $id?: string };
    },
    processor: (nodeId: string, namedId?: string) => unknown,
  ) {
    const nodeId = `#/components/${kind}/${name}`;
    const refId = '$ref' in obj ? obj.$ref : '';
    const namedId = '$ref' in obj ? '' : obj.$id;

    if (refId === nodeId) {
      throw new Error(`${kind}/${name} 引用了自身`);
    }

    processor(nodeId, namedId);
  }

  registerComponents() {
    const {
      schemas = {},
      requestBodies = {},
      parameters = {},
      responses = {},
      pathItems = {},
    } = this.document.components || {};

    for (const [name, schema] of Object.entries(schemas)) {
      this.#parseRefComponent(
        {
          kind: 'schemas',
          name,
          obj: schema,
        },
        (nodeId, namedId) => {
          if (this.schemas[nodeId]) {
            throw new Error(`重复的 schema 引用 id：${nodeId}`);
          }

          const typeName = this.named.nextRefType(name, nodeId);
          this.schemas[nodeId] = {
            position: 'root',
            typeName,
            schema,
            nodeId,
            namedId,
            nodeName: name,
          };
          this.#tryRegisterAnchors({ namedId, nodeId, typeName }, schema);

          if (namedId) {
            this.named.setRefType(namedId, typeName);
          }
        },
      );
    }

    for (const [name, requestBody] of Object.entries(requestBodies)) {
      this.#parseRefComponent(
        {
          kind: 'requestBodies',
          name,
          obj: requestBody,
        },
        (nodeId, namedId) => {
          if (this.requestBodies[nodeId]) {
            throw new Error(`重复的 requestBody 引用 id：${nodeId}`);
          }

          this.requestBodies[nodeId] = { nodeId, namedId, requestBody };
        },
      );
    }

    for (const [name, parameter] of Object.entries(parameters)) {
      this.#parseRefComponent(
        {
          kind: 'parameters',
          name,
          obj: parameter,
        },
        (nodeId, namedId) => {
          if (this.parameters[nodeId]) {
            throw new Error(`重复的 parameter 引用 id：${nodeId}`);
          }

          this.parameters[nodeId] = { nodeId, namedId, parameter };
        },
      );
    }

    for (const [name, response] of Object.entries(responses)) {
      this.#parseRefComponent(
        {
          kind: 'responses',
          name,
          obj: response,
        },
        (nodeId, namedId) => {
          if (this.responses[nodeId]) {
            throw new Error(`重复的 response 引用 id：${nodeId}`);
          }

          this.responses[nodeId] = { nodeId, namedId, response };
        },
      );
    }

    for (const [name, pathItem] of Object.entries(pathItems)) {
      this.#parseRefComponent(
        {
          kind: 'pathItems',
          name,
          obj: pathItem,
        },
        (nodeId, namedId) => {
          if (this.pathItems[nodeId]) {
            throw new Error(`重复的 pathItem 引用 id：${nodeId}`);
          }

          this.pathItems[nodeId] = { nodeId, namedId, pathItem };
        },
      );
    }
  }

  #tryRegisterAnchors(info: { nodeId: string; namedId?: string; typeName: string }, schema: OpenApiLatest_Schema) {
    const { nodeId, namedId, typeName } = info;

    if (isRefSchema(schema))
      return;

    if (schema.$anchor) {
      const anchorId = `${nodeId}#${schema.$anchor}`;

      if (this.schemas[anchorId]) {
        throw new Error(`重复的 anchor 引用 id：${anchorId}`);
      }

      const anchorNamedId = namedId && `${namedId}#${schema.$anchor}`;
      const anchorTypeName = this.named.nextTypeName(`${typeName}-${schema.$anchor}`);

      this.schemas[anchorId] = {
        position: 'anchor',
        nodeId: anchorId,
        namedId: anchorNamedId,
        typeName: anchorTypeName,
        schema,
        nodeName: anchorId,
      };

      this.named.setRefType(anchorId, anchorTypeName);
      anchorNamedId && this.named.setRefType(anchorNamedId, anchorTypeName);
    }

    if ('items' in schema && schema.items) {
      this.#tryRegisterAnchors(info, schema.items);
    }
    else if ('properties' in schema && schema.properties) {
      for (const [prop, property] of Object.entries(schema.properties)) {
        this.#tryRegisterAnchors(info, property);
      }
    }
  }

  print(configs?: PrinterConfigs): PrintResults {
    Object.assign(this.configs, configs);
    const {
      hideHeaders,
      hideFooters,
      hideAlert,
      hideInfo,
      hideSchemas,
      hideImports,
      hidePaths,
    } = this.configs;

    !hideInfo && this.#printInfo();
    !hideAlert && this.#printAlert();
    !hideSchemas && this.#printSchemas();
    !hidePaths && this.#printPaths();
    !hideHeaders && this.#printHeader();
    !hideFooters && this.#printFooter();
    // 一定要放在最后，因为在 printSchemas 和 printPaths 阶段有更新 zodName
    !hideImports && this.#printImports();

    return {
      main: {
        lang: 'ts',
        code: this.#mainContent.print(),
        errors: [],
      },
      type: {
        lang: 'ts',
        code: this.#typeContent.print(),
        errors: [],
      },
      zod: {
        lang: 'ts',
        code: this.#zodContent.print(),
        errors: [],
      },
    };
  }

  #printAlert() {
    const alert = [
      `/**`,
      ` * 由 ${pkgName}@${pkgVersion} 生成，建议忽略此文件的格式校验`,
      ` */`,
    ];

    this.#mainContent.push('alert', alert);
    this.#typeContent.push('alert', alert);
    this.#zodContent.push('alert', alert);
  }

  #printInfo() {
    const { contact, description, license, summary, termsOfService, title, version } = this.document.info;
    const { externalDocs } = this.document;
    const { name, email, url } = contact || {};

    const jsDoc = new JsDoc();
    const { document } = this.configs;
    document && jsDoc.addComments({ document });

    const extDoc = JsDoc.printExternalDoc(externalDocs);
    jsDoc.addComments({
      title,
      version,
      contact:
        name || url || email
          ? [name, email ? `<${email}>` : '', url ? `(${url})` : ''].filter(Boolean).join(' ')
          : undefined,
      description,
      summary,
      see: extDoc,
    });
    const code = jsDoc.print();

    this.#mainContent.push('info', code);
    this.#typeContent.push('info', code);
    this.#zodContent.push('info', code);
  }

  #printImports() {
    const {
      axiosImportName = '',
      axiosImportFile,
      axiosTypeImportFile,
      axiosRequestConfigTypeName = AXIOS_REQUEST_TYPE_NAME,
      axiosResponseTypeName = AXIOS_RESPONSE_TYPE_NAME,
      zodImportName = ZOD_IMPORT_NAME,
      zodImportFile = ZOD_IMPORT_FILE,
      runtimeValidate,
    } = this.options || {};
    const { cwd = '/', mainFile, typeFile = '.', zodFile = '.' } = this.configs;
    const axiosImportFile2 = axiosImportFile || AXIOS_IMPORT_FILE;
    const importPath = toImportPath(axiosImportFile2, cwd, mainFile);
    const axiosTypeImportFile2 = axiosTypeImportFile || axiosImportFile || AXIOS_TYPE_IMPORT_FILE;
    const importTypePath = toImportPath(axiosTypeImportFile2, cwd, mainFile);
    const zodImportPath = toImportPath(zodImportFile, cwd, mainFile);
    const zodNames = [...this.argumentZodNames.values()].join(',');

    this.#mainContent.push('import', [
      toImportString(AXIOS_IMPORT_NAME, axiosImportName, importPath),
      toImportString(AXIOS_REQUEST_TYPE_NAME, axiosRequestConfigTypeName, importTypePath, true),
      toImportString(AXIOS_RESPONSE_TYPE_NAME, axiosResponseTypeName, importTypePath, true),
      `import type * as ${TYPE_FILE_EXPORT_NAME} from "${toRelative(typeFile, mainFile)}";`,
    ]);

    if (runtimeValidate) {
      this.#mainContent.push('import', [
        `import {${zodNames}} from "${toRelative(zodFile, mainFile)}";`,
      ]);
    }

    this.#zodContent.push('import', toImportString(ZOD_IMPORT_NAME, zodImportName, zodImportPath));
  }

  #printHeader() {
    const { header } = this.options || {};
    header && this.#mainContent.push('header', header);
    header && this.#typeContent.push('header', header);
    header && this.#zodContent.push('header', header);
  }

  #printFooter() {
    const { footer } = this.options || {};
    footer && this.#mainContent.push('footer', footer);
    footer && this.#typeContent.push('footer', footer);
    footer && this.#zodContent.push('footer', footer);
  }

  #printSchemas() {
    Object.entries(this.schemas)
      .forEach(([nodeId, schemaInfo]) => {
        this.#printSchema(schemaInfo);
      });
  }

  #printSchema({ schema, nodeId, nodeName, typeName }: SchemaInfo) {
    if (isUndefined(typeName)) {
      throw new Error(`未发现 schema 引用：${nodeId}`);
    }

    const zodName = this.named.prepareVarName(toZodName(typeName));

    const { comments, deps, type, zod } = Parser.parse(this.named, schema);
    const jsDoc = new JsDoc();
    jsDoc.addComments({ name: nodeName });
    jsDoc.addComments(comments);

    this.#typeContent.push('block', [
      jsDoc.print(),
      `export type ${typeName} = ${type};`,
    ]);
    this.#zodContent.add({
      name: zodName,
      deps,
      code: `export const ${zodName} = ${zod};`,
    });
  }

  #printPaths() {
    Object.entries(this.document.paths || {})
      .forEach(([url, pathItem]) => {
        this.#printPathItem(url, pathItem);
      });
  }

  #printPathItem(
    url: string,
    pathItem: OpenApiLatest_PathItem,
  ) {
    if (isRefPathItem(pathItem)) {
      const refPathItem = this.pathItems[pathItem.$ref];

      if (isUndefined(refPathItem)) {
        throw new Error(`未发现 pathItem 引用：${pathItem.$ref}`);
      }

      this.#printPathItem(url, refPathItem.pathItem);
      return;
    }

    Object.entries(pathItem).forEach(([method, _operation]) => {
      // method === 'parameters'，migration 已忽略

      const isOperation = allowMethods.includes(method);
      if (!isOperation)
        return;

      // 转换后可能有 undefined 的情况
      if (isUndefined(_operation))
        return;

      // 已经约束了是 http method
      const operation = _operation as OpenApiLatest_Operation;
      this.#printOperation(method, url, operation);
    });
  }

  #printOperation(method: string, url: string, operation: OpenApiLatest_Operation) {
    if (isRefOperation(operation))
      return;

    const options = this.options || {};
    const { responseStatusCode, responseContentType, requestContentType, runtimeValidate } = options;
    const { parameters, requestBody, responses, operationId } = operation;

    const argNamed = new Named({
      keywordVars: true,
      internalVars: true,
      internalTypes: true,
    });
    argNamed.internalVarName(AXIOS_PARAM_TRANSFORM_RESPONSE_NAME);
    const operationName = this.named.nextOperationId(method, url, operationId);

    const header = new Arg('headers', operationName, this.named, argNamed, options);
    const cookie = new Arg('cookies', operationName, this.named, argNamed, options);
    const query = new Arg('params', operationName, this.named, argNamed, options);
    const path = new Arg('path', operationName, this.named, argNamed, options);
    const data = new Arg('data', operationName, this.named, argNamed, options, true);
    const config = new Arg('config', operationName, this.named, argNamed, options, true);
    const resp = new Arg('response', operationName, this.named, argNamed, options, true);

    path.setUrl(url); // 设置 url，用于解析 path 参数
    config.setDefaultType(AXIOS_REQUEST_TYPE_NAME);

    if (parameters) {
      for (const parameter of parameters) {
        this.#parseParameter(parameter, {
          header,
          cookie,
          path,
          query,
        });
      }
    }

    if (requestBody) {
      this.#parseRequestBody(data, requestBody, (contentType, content) => {
        if (isString(requestContentType))
          return requestContentType === contentType;
        if (!requestContentType)
          return true;

        return requestContentType(contentType, {
          content,
          method,
          operation,
          url,
        });
      });
    }

    if (responses) {
      this.#parseResponses(
        resp,
        responses,
        (statusCode, response) => {
          if (isString(responseStatusCode))
            return responseStatusCode === statusCode;
          if (!responseStatusCode)
            return statusCode.startsWith('2');

          return responseStatusCode(statusCode, {
            method,
            url,
            operation,
            response,
            responses,
          });
        },
        (contentType, content, response) => {
          if (isString(responseContentType))
            return responseContentType === contentType;
          if (!responseContentType)
            return true;

          return responseContentType(contentType, {
            content,
            method,
            operation,
            url,
            response,
            responses,
          });
        },
      );
    }

    const requestArgs = new Args([header.parse(), path.parse(), query.parse(), data.parse(), config.parse()]);
    const responseArgs = new Args([resp.parse()]);

    const formalParams = requestArgs.printFormalParams();
    const responseArg = responseArgs.fixedArgs.at(0);

    const validateAbleRequestArgs = requestArgs.filterValidateAble();

    // jsdoc
    {
      const jsDoc = new JsDoc(this.document.tags);
      const comments = JsDoc.fromOperation(operation);
      const { document: module } = this.configs;

      module && jsDoc.addComments({ module });
      jsDoc.addComments(comments);
      jsDoc.addComments(requestArgs.toComments());
      jsDoc.addComments(responseArgs.toComments());
      this.#mainContent.push('block', jsDoc.print());
    }

    let responseType = responseArg?.typeName;
    responseType = responseType ? `${TYPE_FILE_EXPORT_NAME}.${responseType}` : 'unknown';
    this.#mainContent.push('block', `export async function ${operationName}(${formalParams}) {`);

    // validate request
    if (runtimeValidate) {
      this.#mainContent.push('block', validateAbleRequestArgs.map(arg => `${arg.zodName}.parse(${arg.argName})`));
    }

    this.#mainContent.push('block', `const ${AXIOS_RESPONSE_NAME} = await ${AXIOS_IMPORT_NAME}<${AXIOS_RESPONSE_TYPE_NAME}<${responseType}>>({`);
    this.#mainContent.push('block', `  method: ${JSON.stringify(method.toUpperCase())},`);
    this.#mainContent.push('block', requestArgs.printActualParams());
    this.#mainContent.push('block', '});');

    // validate response
    if (runtimeValidate && responseArg) {
      const props = isBoolean(runtimeValidate) ? ['data'] : runtimeValidate.responseDataProps || ['data'];
      const propString = props.map(prop => `[${JSON.stringify(prop)}]`).join('');
      this.#mainContent.push('block', `${responseArg.zodName}.parse(${AXIOS_RESPONSE_NAME}${propString});`);
    }

    this.#mainContent.push('block', `return ${AXIOS_RESPONSE_NAME};`);
    this.#mainContent.push('block', '}');

    validateAbleRequestArgs.forEach((arg) => {
      this.argumentZodNames.add(arg.zodName);
      this.#zodContent.push('block', `export const ${arg.zodName} = ${arg.zodValue};`);
    });

    if (responseArg) {
      this.argumentZodNames.add(responseArg.zodName);
      this.#zodContent.push('block', `export const ${responseArg.zodName} = ${responseArg.zodValue};`);
    }

    this.#typeContent.push('block', requestArgs.printSchemaTypes());
    this.#typeContent.push('block', responseArgs.printSchemaTypes());
  }

  #parseContents(
    arg: Arg,
    contents: {
      [contentType: string]: OpenAPILatest.MediaTypeObject | OpenAPILatest.ReferenceObject;
    },
    comments: {
      description?: string;
      required?: boolean;
    },
    match: RequestMediaMatch,
  ) {
    const content = Object.entries(contents).find(([contentType, content]) => {
      return match(contentType, content);
    })?.[1];

    if (!content)
      return;

    this.#parseContent(arg, content, comments);
  }

  #parseContent(
    arg: Arg,
    content: OpenApiLatest_Media,
    comments: {
      description?: string;
      required?: boolean;
    },
  ) {
    if (isRefMedia(content)) {
      const { $ref } = content;
      const label = arg.kind === 'response' ? '响应' : '请求';

      throw new Error(`不支持引用${label}内容：${$ref}`);
    }

    arg.add({
      in: 'query',
      name: 'data',
      ...comments,
      schema: content.schema,
      required: true,
    });
  }

  #parseParameter(parameter: OpenApiLatest_Parameter, args: Record<OpenAPILatest.ParameterObject['in'], Arg>) {
    if (isRefParameter(parameter)) {
      const { $ref } = parameter;
      const refParameter = this.parameters[$ref];

      if (!refParameter) {
        throw new Error(`未发现 parameter 引用：${$ref}`);
      }

      this.#parseParameter(refParameter.parameter, args);
      return;
    }

    if (parameterTypes.includes(parameter.in)) {
      args[parameter.in].add(parameter);
    }
  }

  #parseRequestBody(arg: Arg, requestBody: OpenApiLatest_Request, match: RequestMediaMatch) {
    if (!requestBody)
      return;

    if (isRefRequest(requestBody)) {
      const { $ref } = requestBody;
      const refRequestBody = this.requestBodies[$ref];

      if (!refRequestBody)
        throw new Error(`未发现 requestBody 引用：${$ref}`);

      this.#parseRequestBody(arg, refRequestBody.requestBody, match);
      return;
    }

    this.#parseContents(arg, requestBody.content, requestBody, match);
  }

  #parseResponses(
    arg: Arg,
    responses: OpenAPILatest.ResponsesObject,
    responseMatch: ResponseMatch,
    contentMatch: ResponseMediaMatch,
  ) {
    const response = Object.entries(responses).find(([statusCode, response]) => {
      return responseMatch(statusCode, response);
    })?.[1];

    if (!response)
      return;

    this.#parseResponse(arg, response, contentMatch);
  }

  #parseResponse(arg: Arg, response: OpenApiLatest_Response, contentMatch: ResponseMediaMatch) {
    if (isRefResponse(response)) {
      const { $ref } = response;
      const refResponse = this.responses[$ref];

      if (!refResponse)
        throw new Error(`未发现 response 引用：${$ref}`);

      this.#parseResponse(arg, refResponse.response, contentMatch);
      return;
    }

    const { content } = response;
    if (!content)
      return;

    this.#parseContents(arg, content, response, (contentType, content) => contentMatch(contentType, content, response));
  }
}
