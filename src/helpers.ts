import { ContentKind } from './types';

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
  return contentType ? { 'content-type': contentType } : undefined;
}

/**
 * 格式化请求体
 * @param {string} contentKind
 * @param body
 * @returns {FormData | string}
 */
export function formatBody(contentKind: ContentKind, body: any) {
  switch (contentKind) {
    case ContentKind.URL_ENCODED:
      return new URLSearchParams(body).toString();

    case ContentKind.FORM_DATA: {
      return Object.keys(body).reduce((fd, key) => {
        const val = body[key];
        const isFileType = val instanceof Blob || val instanceof File;
        const isString = typeof val === 'string' || typeof val === 'number';
        fd.append(key, isFileType ? val : isString ? String(val) : JSON.stringify(val));
        return fd;
      }, new FormData());
    }

    default:
      return JSON.stringify(body);
  }
}
