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
  props: string[];
}

export function refToTypeName(ref: string): RefInfo {
  // #/components/schemas/{type}/{...prop}
  const segs = ref.split('/').slice(3);

  return {
    type: segs.at(0)!,
    props: segs.slice(1),
  };
}
