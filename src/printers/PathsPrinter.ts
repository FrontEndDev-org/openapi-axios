import { AxiosRequestConfig } from 'axios';
import { groupBy } from 'lodash';
import { TypeItem, TypeList, TypeOperation, TypeOperations, TypeOrigin } from '../parsers/types';
import { joinSlices, nextUniqueName, varString } from '../utils/string';
import { isBoolean, isString } from '../utils/type-is';
import { ComponentsPrinter } from './ComponentsPrinter';

const { stringify } = JSON;

export class PathsPrinter extends ComponentsPrinter {
  init() {
    super.init();
    this.imports.push('import type { AxiosPromise, AxiosRequestConfig } from "axios";');
    this.imports.push(
      'import { DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT, resolveURL } from "openapi-axios/helpers";'
    );
    this.imports.push(this.options.axiosImport);
    this.helpers.push(`const request = axios.request;`);
    if (this.document.info.baseURL) this.helpers.push(`const BASE_URL = ${stringify(this.document.info.baseURL)};`);
  }

  writePaths() {
    return this.format(joinSlices(this.document.paths.map(this.writeOperation.bind(this)), '\n\n'));
  }

  protected writeOperation(type: TypeOperation) {
    return joinSlices([this.writeOperationTypes(type), this.writeOperationAxios(type)]);
  }

  protected writeOperationTypes(type: TypeOperation) {
    const {
      request: { path, query, body: reqBody },
      response: { body: resBody },
    } = type;

    return joinSlices(([path, query, reqBody, resBody].filter(Boolean) as TypeList).map(this.writeRootType.bind(this)));
  }

  protected writeOperationAxios(type: TypeOperation) {
    const {
      name,
      request: { path, query, body: reqBody },
      response: { body: resBody },
    } = type;
    const { responseTypeName } = this.options;
    const argNameCountMap = new Map<string, number>();
    const requestPathArgName = nextUniqueName(this.options.requestPathArgName, argNameCountMap);
    const requestQueryArgName = nextUniqueName(this.options.requestQueryArgName, argNameCountMap);
    const requestBodyArgName = nextUniqueName(this.options.requestBodyArgName, argNameCountMap);
    const configArgName = nextUniqueName('config', argNameCountMap);
    const comments = this.writeComments(type, true);
    const argsGroup = groupBy(
      [
        this.writeArg(requestPathArgName, path),
        this.writeArg(requestQueryArgName, query),
        this.writeArg(requestBodyArgName, reqBody),
        this.writeArg(configArgName, 'AxiosRequestConfig', false),
      ],
      (item) => item?.required
    );
    const args_ = joinSlices(
      [
        // 可能没有任何必填参数
        ...(argsGroup['true'] || []),
        // 至少有一个 config 可选参数
        ...argsGroup['false'],
      ].map((desc) => desc?.text),
      ', '
    );
    const return_ = `${responseTypeName}<${resBody?.name || 'never'}>`;
    const url_ = this.writeAxiosProp('url', this.toURL(type, requestPathArgName));
    const method_ = this.writeAxiosProp('method', type.method.toUpperCase());
    const params_ = this.writeAxiosProp('params', query ? requestQueryArgName : '');
    const data_ = this.writeAxiosProp('data', reqBody ? requestBodyArgName : '');
    const props = joinSlices([
      //
      url_,
      method_,
      params_,
      data_,
      `...${configArgName}`,
    ]);

    return `${comments}export async function ${name}(${args_}):${return_}  {
              return request({
                ${props}
              });
            }`;
  }

  protected writeAxiosProp(prop: keyof AxiosRequestConfig, value?: string) {
    if (!value) return '';
    return prop === value ? `${prop},` : `${prop}: ${value},`;
  }

  protected writeArg(name: string, type?: TypeItem | string, required?: boolean) {
    if (!type) return;

    const typeName = isString(type) ? type : type.name;
    required = isString(type) ? required : (type as TypeOrigin).required;
    const equal = required ? ':' : '?:';

    return {
      required,
      text: `${name}${equal}${typeName}`,
    };
  }

  protected toURL(type: TypeOperation, requestPathArgName: string) {
    const url = stringify(varString(type.url, requestPathArgName)).replace(/"/g, '`');

    if (!this.document.info.baseURL) return url;

    return `resolveURL(BASE_URL, ${url})`;
  }
}
