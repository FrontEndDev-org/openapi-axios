import type { AxiosRequestConfig } from 'axios';
import { groupBy } from 'lodash';
import { pkgName } from '../const';
import { AXIOS_PROMISE_TYPE_NAME, AXIOS_QUEST_CONFIG_TYPE_NAME } from '../parsers/const';
import type { TypeItem, TypeList, TypeOperation, TypeOperations, TypeOrigin } from '../parsers/types';
import { joinSlices, nextUniqueName, varString } from '../utils/string';
import { isBoolean, isString } from '../utils/type-is';
import { ComponentsPrinter } from './ComponentsPrinter';

const { stringify } = JSON;

export class PathsPrinter extends ComponentsPrinter {
    protected init() {
        super.init();
        this.imports.push(`import { DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT, resolveURL } from "${pkgName}/client";`);
        this.imports.push(`import type {AxiosRequestConfig, AxiosPromise} from "${this.options.axiosImportPath}";`);
        this.imports.push(`import axios from "${this.options.axiosImportPath}";`);
        if (this.document.info.baseURL) this.helpers.push(`const BASE_URL = ${stringify(this.document.info.baseURL)};`);
    }

    printPaths() {
        return joinSlices(this.document.paths.map(this.printOperation.bind(this)), '\n\n');
    }

    protected printOperation(type: TypeOperation) {
        return joinSlices([this.printOperationTypes(type), this.printOperationAxios(type)]);
    }

    protected printOperationTypes(type: TypeOperation) {
        const {
            request: { path, query, body: reqBody },
            response: { body: resBody },
        } = type;

        return joinSlices(([path, query, reqBody, resBody].filter(Boolean) as TypeList).map(this.printRootType.bind(this)));
    }

    protected printOperationAxios(type: TypeOperation) {
        const {
            name,
            request: { path, query, body: reqBody },
            response: { body: resBody },
        } = type;
        const argNameCountMap = new Map<string, number>();
        const requestPathArgName = nextUniqueName(this.options.requestPathArgName, argNameCountMap);
        const requestQueryArgName = nextUniqueName(this.options.requestQueryArgName, argNameCountMap);
        const requestBodyArgName = nextUniqueName(this.options.requestBodyArgName, argNameCountMap);
        const requestConfigArgName = nextUniqueName(this.options.requestConfigArgName, argNameCountMap);
        const comments = this.printComments(type, true);
        const args = [
            //
            this.printArg(requestPathArgName, path),
            this.printArg(requestQueryArgName, query),
            this.printArg(requestBodyArgName, reqBody),
            this.printArg(requestConfigArgName, AXIOS_QUEST_CONFIG_TYPE_NAME, false),
        ];
        const argsGroup = groupBy(args, (item) => item?.required);
        const argStr = joinSlices(
            [
                // 可能没有任何必填参数
                ...(argsGroup['true'] || []),
                // 可能没有任何可选参数
                ...(argsGroup['false'] || []),
            ].map((desc) => desc?.text),
            ', ',
        );
        const return_ = `${AXIOS_PROMISE_TYPE_NAME}<${resBody?.name || 'never'}>`;
        const url_ = this.printAxiosProp('url', this.toURL(type, requestPathArgName));
        const method_ = this.printAxiosProp('method', type.method.toUpperCase());
        const params_ = this.printAxiosProp('params', query ? requestQueryArgName : '');
        const data_ = this.printAxiosProp('data', reqBody ? requestBodyArgName : '');
        const props = joinSlices([
            //
            url_,
            method_,
            params_,
            data_,
            `...${requestConfigArgName}`,
        ]);

        return `${comments}export async function ${name}(${argStr}): ${return_}  {
              return axios({
                ${props}
              });
            }`;
    }

    protected printAxiosProp(prop: keyof AxiosRequestConfig, value?: string) {
        if (!value) return '';
        return prop === value ? `${prop},` : `${prop}: ${value},`;
    }

    protected printArg(name: string, type?: TypeItem | string, required?: boolean) {
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
