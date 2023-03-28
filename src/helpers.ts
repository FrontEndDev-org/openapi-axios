import { ContentKind } from './types';
import { isBoolean, isDate, isNumber, isObject, isString } from './utils';

/**
 * 格式化请求头
 * @param {ContentKind} contentKind
 * @returns {{"content-type": string} | undefined}
 */
export function formatHeaders(contentKind: ContentKind) {
  const contentType = {
    [ContentKind.JSON]: 'application/json',
    [ContentKind.URL_ENCODED]: 'application/x-www-form-urlencoded',
    [ContentKind.FORM_DATA]: 'multipart/form-data',
    [ContentKind.TEXT]: 'text/plain',
    [ContentKind.OTHER]: '',
  }[contentKind];
  return contentType ? { 'Content-Type': contentType } : undefined;
}

/**
 * 判断是否为二进制
 * @param value
 * @returns {boolean}
 */
export function isBlob(value: unknown): value is Blob {
  if (typeof Blob !== 'undefined' && value instanceof Blob) return true;
  if (typeof File !== 'undefined' && value instanceof File) return true;

  return false;
}

export function toFormDataValue(value: unknown): string | Blob {
  if (isString(value) || isNumber(value) || isBoolean(value)) return String(value);
  if (isObject(value)) return JSON.stringify(value);
  if (isDate(value)) return value.toISOString();
  if (isBlob(value)) return value;
  return '';
}

/**
 * 格式化请求体
 * @param {string} contentKind
 * @param body
 * @returns {FormData | string}
 */
export function formatBody<D>(contentKind: ContentKind, body: D) {
  switch (contentKind) {
    case ContentKind.URL_ENCODED:
      return isObject(body) ? new URLSearchParams(body as Record<string, string>).toString() : '';

    case ContentKind.FORM_DATA: {
      const fd = new FormData();
      if (!isObject(body)) return fd;

      return Object.keys(body).reduce((fd, key) => {
        const val = body[key as keyof D];
        fd.append(key, toFormDataValue(val));
        return fd;
      }, fd);
    }

    default:
      return JSON.stringify(body);
  }
}
