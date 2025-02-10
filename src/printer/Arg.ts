import type { OpenAPILatest } from '../types/openapi';
import type { OpenApiLatest_Parameter } from './helpers';
import type { Named } from './Named';
import type { PrinterOptions } from './types';
import { fixVarName } from '../utils/string';
import { AXIOS_PARAM_CONFIG_NAME } from './const';
import { isRefParameter, requiredKeyStringify } from './helpers';
import { Schemata } from './Schemata';

export type ArgKind = 'path' | 'headers' | 'cookies' | 'params' | 'data' | 'config' | 'response';

export interface ArgProp {
  name: string;
  parameter: OpenAPILatest.ParameterObject;
  schema: OpenAPILatest.SchemaObject;
}

export class Arg {
  parameters: OpenApiLatest_Parameter[] = [];
  originName: string = '';

  /**
   * 作为属性的名称
   */
  propName = '';
  /**
   * 作为参数的注释名称
   */
  docName = '';
  /**
   * 作为参数的变量名称
   */
  argName = '';
  /**
   * 作为 schema 的变量名称
   */
  schemaName = '';
  /**
   * 是否必填
   */
  required = false;
  /**
   * 类型名称
   */
  typeName = '';
  /**
   * 类型值
   */
  typeValue = '';
  comments: Record<string, unknown> = {};
  props: ArgProp[] = [];

  constructor(
    readonly kind: ArgKind,
    readonly operationName: string,
    readonly docNamed: Named,
    readonly argNamed: Named,
    readonly schemata: Schemata,
    readonly printOptions: PrinterOptions,
    /**
     * 是否单参数（如 data、config、response）
     */
    readonly isSingle: boolean = false,
  ) {
    this.originName = kind;
    this.propName = kind === 'path' ? 'url' : kind;
    this.docName = kind;
    this.argName = '';
    this.typeName = docNamed.nextTypeName(`${operationName}-${kind}`);
    this.schemaName = docNamed.nextVarName(fixVarName(`${this.typeName}-schema`, false));
  }

  url: string = '';
  urlParams: string[] = [];
  setUrl(url: string) {
    this.url = url;
    url.replace(/\{(.*?)\}/g, (_, name) => {
      this.urlParams.push(name);
      return _;
    });
  }

  defaultType = '';
  setDefaultType(type: string) {
    this.defaultType = type;
  }

  add(parameter?: OpenApiLatest_Parameter) {
    if (!parameter)
      return;

    // 忽略 url 无参数的情况
    if (this.kind === 'path' && this.urlParams.length === 0)
      return;

    this.parameters.push(parameter);
  }

  parse(): Arg | null {
    const fixedParameters = this.parameters.filter(p => !isRefParameter(p) && 'schema' in p && p.schema) as OpenAPILatest.ParameterObject[];
    const propLength = fixedParameters.length;
    const requiredNames: string[] = [];

    fixedParameters.forEach((parameter) => {
      const { required, schema, name } = parameter;

      if (!schema)
        return;

      if (required || parameter.in === 'path') {
        requiredNames.push(name);
        parameter.required = true;
      }

      this.props.push({
        parameter,
        name,
        schema: schema!,
      });
    });

    switch (propLength) {
      case 0: {
        switch (this.kind) {
          case 'path':
            this.required = true;
            this.typeValue = this.defaultType;
            this.argName = this.argNamed.nextVarName(this.docName);
            return this;

          case 'config':
            this.typeValue = this.defaultType;
            this.argName = AXIOS_PARAM_CONFIG_NAME;
            this.comments = {
              [`param [${this.argName}]`]: `request ${this.propName}`,
            };
            return this;
        }
        return null;
      }

      case 1: {
        // prop0: type0
        const [firstArg] = this.props;
        const { parameter, schema } = firstArg;
        const result = this.schemata.print(schema);
        const isResponse = this.kind === 'response';
        const required = parameter.required || result.required || false;

        this.originName = firstArg.name;
        this.argName = this.argNamed.nextVarName(firstArg.name);
        this.required = required;
        this.typeValue = Schemata.toString(result);
        this.comments = isResponse
          ? {
              returns: parameter.description || schema.description || false,
            }
          : {
              [
              `param ${requiredKeyStringify(this.argName, required)}`]: parameter.description || schema.description
                || (this.kind === 'data' ? 'request data' : `request ${this.docName} ${JSON.stringify(firstArg.name)}`),
            };
        return this;
      }

      default: {
        // name: {prop0: type0, prop1: type1, ...}
        const rootSchema: OpenAPILatest.SchemaObject = {
          type: 'object',
          properties: this.props.reduce(
            (acc, { parameter, schema, name: originName }) => {
              acc[originName] = {
                ...schema,
                description: parameter.description || schema.description,
                deprecated: parameter.deprecated || schema.deprecated,
              };
              return acc;
            },
            {} as Record<string, OpenAPILatest.SchemaObject>,
          ),
          required: requiredNames,
        };
        const result = this.schemata.print(rootSchema);
        const required = requiredNames.length > 0;

        this.required = required;
        this.typeValue = Schemata.toString(result);
        this.argName = this.argNamed.nextVarName(this.docName);
        this.comments = this.kind === 'response'
          ? {
              returns: result.comments.description,
            }
          : {
              [`param ${requiredKeyStringify(this.docName, required)}`]: `request ${this.docName}`,
            };
        return this;
      }
    }
  }
}
