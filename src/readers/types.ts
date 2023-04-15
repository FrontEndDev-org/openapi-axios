export type TypeUnit = 'number' | 'string' | 'boolean' | 'never' | 'object' | 'array' | 'any';

export interface TypeComments {
  title?: string;
  description?: string;
  default?: any;
  example?: any;
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

export interface ReaderOptions {
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

  requestPathTypeName?: string;
  requestQueryTypeName?: string;
  requestBodyTypeName?: string;
  responseBodyTypeName?: string;
}

export type StrictReaderOptions = Required<ReaderOptions>;

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
