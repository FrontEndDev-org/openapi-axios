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
  const type = segs.at(0)!;

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
