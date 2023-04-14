export type TypeKind = 'origin' | 'alias';
export type TypeUnit = 'number' | 'string' | 'boolean' | 'never' | 'object' | 'array';

export interface TypeComments {
  title?: string;
  description?: string;
  default?: any;
  example?: any;
  deprecated?: boolean;
  format?: string;
}

export interface TypeOrigin extends TypeComments {
  kind: TypeKind;
  name: string;
  type: TypeUnit;
  required: boolean;
  enum?: string[];
  children?: TypeList;
}

export interface TypeAlias extends TypeComments {
  kind: TypeKind;
  root: boolean;
  name: string;
  target: string;
  origin: string;
  props: string[];
  ref: string;
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
   * ok 的媒体类型
   * @default "application/json"
   */
  okMediaType?: string;
}

export type StrictReaderOptions = Required<ReaderOptions>;

export interface TypeOperation {
  method: string;
  url: string;
  name: string;
  summary?: string;
  description?: string;
  deprecated?: boolean;
  request: {
    query?: TypeList;
    path?: TypeList;
    body?: TypeItem;
  };
  response: {
    body?: TypeItem;
  };
}

export type TypeOperations = TypeOperation[];

export interface TypeQueryPath {
  query: TypeList;
  path: TypeList;
}

export interface TypeDocument {
  components: TypeList;
  paths: TypeOperations;
}
