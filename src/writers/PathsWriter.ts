import { AxiosRequestConfig } from 'axios';
import { TypeItem, TypeList, TypeOperation, TypeOperations } from '../readers/types';
import { joinSlices, varString } from '../utils/string';
import { ComponentsWriter } from './ComponentsWriter';

const { stringify } = JSON;

export class PathsWriter extends ComponentsWriter {
  writePaths() {
    return this.format(this.options.document.paths.map(this.writeOperation.bind(this)).join('\n\n'));
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
    const { requestPathArgName, requestQueryArgName, requestBodyArgName, responseTypeName } = this.options;
    const comments = this.writeComments(type, true);
    const args_ = joinSlices(
      [
        //
        this.writeArg(requestPathArgName, path),
        this.writeArg(requestQueryArgName, query),
        this.writeArg(requestBodyArgName, reqBody),
      ],
      ', '
    );
    const return_ = `${responseTypeName}<${resBody?.name || 'never'}>`;

    const url_ = this.writeAxiosProp('url', stringify(varString(type.url, 'path.')).replace(/"/g, '`'));
    const method_ = this.writeAxiosProp('method', stringify(type.method));
    const params_ = this.writeAxiosProp('params', query ? requestQueryArgName : '');
    const data_ = this.writeAxiosProp('data', reqBody ? requestBodyArgName : '');
    const props = joinSlices([
      //
      url_,
      method_,
      params_,
      data_,
    ]);

    return `${comments}export async function ${name}(${args_}):${return_}  {
          return axios({
            ${props}
          });
        }`;
  }

  protected writeAxiosProp(prop: keyof AxiosRequestConfig, value?: string) {
    if (!value) return '';
    return prop === value ? `${prop},` : `${prop}: ${value},`;
  }

  protected writeArg(name: string, type?: TypeItem) {
    if (!type) return;

    return `${name}: ${type.name}`;
  }
}
