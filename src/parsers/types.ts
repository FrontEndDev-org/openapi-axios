import { OpenAPIV3 } from 'openapi-types';

export type TypeKind = 'origin' | 'alias';
export type TypeUnit = 'number' | 'string' | 'boolean' | 'never' | 'object' | 'array';

export interface TypeOrigin {
  kind: TypeKind;
  name: string;
  type: TypeUnit;
  required: boolean;
  title?: string;
  description?: string;
  default?: any;
  enum?: string[];
  example?: any;
  deprecated?: boolean;
  format?: string;
  children?: TypeList;
}

export interface TypeAlias {
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

export interface ParseOptions {
  okCode: number;
  okMediaType: string;
}

export interface TypeOperation {
  method: OpenAPIV3.HttpMethods;
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
