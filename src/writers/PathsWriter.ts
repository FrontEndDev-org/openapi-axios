import { AxiosRequestConfig } from 'axios';
import { TypeItem, TypeList, TypeOperation, TypeOperations } from '../readers/types';
import { joinSlices, nextUniqueName, varString } from '../utils/string';
import { isString } from '../utils/type-is';
import { ComponentsWriter } from './ComponentsWriter';

const { stringify } = JSON;

export class PathsWriter extends ComponentsWriter {
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
    return this.format(this.document.paths.map(this.writeOperation.bind(this)).join('\n\n'));
  }

  protected writeOperation(type: TypeOperation) {
    return [this.writeOperationTypes(type), this.writeOperationAxios(type)].join('\n');
  }

  protected writeOperationTypes(type: TypeOperation) {
    const {
      request: { path, query, body: reqBody },
      response: { body: resBody },
    } = type;

    return ([path, query, reqBody, resBody].filter(Boolean) as TypeList).map(this.writeRootType.bind(this)).join('\n');
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
    const args_ = joinSlices(
      [
        //
        this.writeArg(requestPathArgName, path),
        this.writeArg(requestQueryArgName, query),
        this.writeArg(requestBodyArgName, reqBody),
        this.writeArg(configArgName, 'AxiosRequestConfig', true),
      ],
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

  protected writeArg(name: string, type?: TypeItem | string, optional?: boolean) {
    if (!type) return;

    const typeName = isString(type) ? type : type.name;
    const equal = optional ? '?:' : ':';
    return `${name}${equal}${typeName}`;
  }

  protected toURL(type: TypeOperation, requestPathArgName: string) {
    const leading = `${requestPathArgName}.`;
    const url = stringify(varString(type.url, leading)).replace(/"/g, '`');

    if (!this.document.info.baseURL) return url;

    return `resolveURL(BASE_URL, ${url})`;
  }
}
