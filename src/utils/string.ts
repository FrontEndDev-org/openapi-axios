import { isVarName } from './type-is';

export function buildName(origin: string, bigger = false) {
    const name =
        origin
            .replace(/\W/g, '_')
            .replace(/(^_+|_+$)/g, '')
            .replace(/_(.)/g, ($0, $1: string) => $1.toUpperCase())
            .replace(/^\d+/, '') || 'unnamed';

    return (bigger ? name[0].toUpperCase() : name[0].toLowerCase()) + name.slice(1);
}

export interface RefInfo {
    type: string;
    base: string;
    props: string[];
}

export function refToType(ref: string): RefInfo {
    const segs = ref.split('/').slice(3);
    const type = segs[0]!;

    return {
        type,
        base: `#/components/schemas/${type}`,
        props: segs.slice(1),
    };
}

export function findOrigin(source: string, relation: Map<string, string>) {
    let origin = source;
    let target: string | undefined;

    while ((target = relation.get(origin))) {
        origin = target;
    }

    return origin;
}

export function varString(string: string, leading = ''): string {
    return string.replace(/\{([^}]+)\}/g, ($0, $1: string) => {
        const key = leading ? (isVarName($1) ? `${leading}.${$1}` : `${leading}[${JSON.stringify($1)}]`) : $1;
        return `$\{${key}}`;
    });
}

export function toTypePath(props: string[]): string {
    const path = props.map((p) => JSON.stringify(p)).join('][');
    return path ? '[' + path + ']' : '';
}

export function joinSlices(slices: Array<string | undefined>, separator = '\n') {
    return slices.filter(Boolean).join(separator);
}

export function nextUniqueName(refName: string, nameCountMap: Map<string, number>) {
    // abc123 -> abc
    const baseName = refName.replace(/\d+$/, '');
    const count = nameCountMap.get(baseName) || 0;
    const nextCount = count + 1;
    nameCountMap.set(baseName, nextCount);
    return nextCount === 1 ? baseName : baseName + nextCount;
}
