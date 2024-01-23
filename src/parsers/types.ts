import type { OpenAPIV3Document } from '../types/openapi';

export type TypeUnit = 'number' | 'string' | 'boolean' | 'never' | 'object' | 'array' | 'any';

export interface TypeComments {
    title?: string;
    description?: string;
    default?: unknown;
    example?: unknown;
    deprecated?: boolean;
    format?: string;
}

export interface TypeOrigin extends TypeComments {
    kind: 'origin';
    name: string;
    type: TypeUnit;
    required: boolean;
    enum?: string[];
    children?: TypeList;
}

export interface TypeAlias extends TypeComments {
    kind: 'alias';
    refAble: boolean;
    required: boolean;
    name: string;
    target: string;
    origin: string;
    props: string[];
    ref?: string;
}

export type TypeItem = TypeOrigin | TypeAlias;
export type TypeList = TypeItem[];

export interface NameFormatterProps {
    name: string;
    method: string;
    url: string;
    operationId?: string;
}

export interface ParserOptions {
    cwd?: string;

    /**
     * ok 的响应码
     * @default 200
     */
    okCode?: number;

    /**
     * ok 的响应类型
     * @default ["application/json"]
     */
    okMediaType?: string;

    /**
     * 自定义名称格式化
     * @param {NameFormatterProps} props
     * @returns {string}
     */
    nameFormatter?: (props: NameFormatterProps) => string;

    /**
     * 请求路径参数类型名称
     * @default ReqPath
     */
    requestPathTypeName?: string;

    /**
     * 请求查询参数类型名称
     * @default ReqParams
     */
    requestQueryTypeName?: string;

    /**
     * 请求体参数类型名称
     * @default ReqData
     */
    requestBodyTypeName?: string;

    /**
     * 响应体类型名称
     * @default ResData
     */
    responseBodyTypeName?: string;
}

export type StrictParserOptions = Required<ParserOptions>;

export interface TypeOperation extends TypeComments {
    method: string;
    url: string;
    name: string;
    request: {
        path?: TypeItem;
        query?: TypeItem;
        body?: TypeItem;
    };
    response: {
        body?: TypeItem;
    };
}

export type TypeOperations = TypeOperation[];

export interface TypeDocument {
    info: {
        title: string;
        description?: string;
        version: string;
        baseURL?: string;
    };
    components: TypeList;
    paths: TypeOperations;
}

export type AcceptDocument = OpenAPIV3Document | string;
