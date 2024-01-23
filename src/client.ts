export * from './const';

// @ref https://github.com/drwpow/openapi-typescript/blob/bc52343c44f9dab4006e04c27411e405fb67a739/src/index.ts#L215
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
export type OneOf<T extends unknown[]> = T extends [infer Only] ? Only : T extends [infer A, infer B, ...infer Rest] ? OneOf<[XOR<A, B>, ...Rest]> : never;

export const DELETE = 'DELETE';
export const GET = 'GET';
export const HEAD = 'HEAD';
export const OPTIONS = 'OPTIONS';
export const PATCH = 'PATCH';
export const POST = 'POST';
export const PUT = 'PUT';
export const TRACE = 'TRACE';

export function resolveURL(baseURL: string, url: string) {
    // @ref https://github.com/FrontEndDev-org/openapi-axios/security/code-scanning/1
    return baseURL.replace(/(?<!\/)\/+$/, '') + '/' + url.replace(/^\/+/, '');
}
