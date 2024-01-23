export function isUndefined(any: unknown): any is undefined {
    return any === undefined;
}

export function isString(any: unknown): any is string {
    return typeof any === 'string';
}

export function isBoolean(any: unknown): any is boolean {
    return typeof any === 'boolean';
}

export function isNumber(any: unknown): any is number {
    return typeof any === 'number';
}

export function isObject(any: unknown): any is object {
    return typeof any === 'object' && any !== null;
}

export function isDate(any: unknown): any is Date {
    return Boolean(any && any instanceof Date);
}

export function isUrl(any: string): boolean {
    return /^https:\/\//i.test(any);
}

export function isVarName(varName: string) {
    return /^[a-z_$]\w*$/i.test(varName);
}
