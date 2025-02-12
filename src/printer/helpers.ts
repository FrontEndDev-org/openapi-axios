import type { OpenAPILatest } from '../types/openapi';
import { isString } from '../utils/type-is';

export type OpenApiLatest_Schema = OpenAPILatest.SchemaObject | OpenAPILatest.ReferenceObject;

export function isRefSchema(schema: OpenApiLatest_Schema): schema is OpenAPILatest.ReferenceObject {
  return '$ref' in schema && isString(schema.$ref);
}

export type OpenApiLatest_Parameter = OpenAPILatest.ReferenceObject | OpenAPILatest.ParameterObject;

export function isRefParameter(parameter: OpenApiLatest_Parameter): parameter is OpenAPILatest.ReferenceObject {
  return '$ref' in parameter && isString(parameter.$ref);
}

export type OpenApiLatest_Request = OpenAPILatest.ReferenceObject | OpenAPILatest.RequestBodyObject;

export function isRefRequest(request: OpenApiLatest_Request): request is OpenAPILatest.ReferenceObject {
  return '$ref' in request && isString(request.$ref);
}

export type OpenApiLatest_Media = OpenAPILatest.ReferenceObject | OpenAPILatest.MediaTypeObject;

export function isRefMedia(request: OpenApiLatest_Media): request is OpenAPILatest.ReferenceObject {
  return '$ref' in request && isString(request.$ref);
}

export type OpenApiLatest_PathItem = OpenAPILatest.PathItemObject | OpenAPILatest.ReferenceObject;

export function isRefPathItem(pathItem: OpenApiLatest_PathItem): pathItem is OpenAPILatest.ReferenceObject {
  return '$ref' in pathItem && isString(pathItem.$ref);
}

export type OpenApiLatest_Operation = OpenAPILatest.OperationObject | OpenAPILatest.ReferenceObject;

export function isRefOperation(operation: OpenApiLatest_Operation): operation is OpenAPILatest.ReferenceObject {
  return '$ref' in operation && isString(operation.$ref);
}

export type OpenApiLatest_Response = OpenAPILatest.ResponseObject | OpenAPILatest.ReferenceObject;

export function isRefResponse(response: OpenApiLatest_Response): response is OpenAPILatest.ReferenceObject {
  return '$ref' in response && isString(response.$ref);
}

export function requiredTypeStringify(required?: boolean) {
  return required ? ':' : '?:';
}

export function requiredKeyStringify(key: string, required: boolean) {
  return required ? key : `[${key}]`;
}

export function toImportString(id: string, name: string, path: string, isType = false) {
  const isDefault = name === '';
  const type = isType ? (isDefault ? ' type ' : 'type ') : (isDefault ? ' ' : '');
  return isDefault
  // 默认导入
    ? `import${type}${id} from "${path}";`
  // 具名导入
    : `import {${type}${name} as ${id}} from "${path}";`;
}

export function toZodName(typeName: string) {
  return `z-${typeName}`;
}

export interface DepItem {
  name: string;
  deps: string[];
}
/**
 * 根据依赖进行排序
 * @param depList
 * @returns
 */
export function sortingByDeps<T extends DepItem>(depList: T[]) {
  return depList.sort((a, b) => {
    if (a.deps.includes(b.name)) {
      return 1;
    }
    else if (b.deps.includes(a.name)) {
      return -1;
    }
    else {
      return 0;
    }
  });
}
