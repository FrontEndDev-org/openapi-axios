export interface PathSlice {
  type: 'param' | 'segment';
  value: string;
};

export class VarPath {
  #slices: PathSlice[] = [];
  props: string[] = [];
  constructor(readonly path: string) {
    this.#slices = path.split('/').map((s) => {
      const type = s.startsWith('{') && s.endsWith('}') ? 'param' : 'segment';
      const value = type === 'segment' ? s : s.slice(1, -1);

      if (type === 'param')
        this.props.push(value);

      return { type, value };
    });
  }

  toString(vars: Record<string, string>) {
    if (!this.props.length) {
      return JSON.stringify(this.path);
    }

    const path = this.#slices.map(({ type, value }) => {
      if (type === 'segment')
        return value;

      const varName = vars[value];

      if (varName === undefined) {
        throw new Error(`路径参数 ${value} 未定义`);
      }

      return `\${${vars[value]}}`;
    }).join('/');
    return `\`${path}\``;
  }

  toPattern() {
    if (!this.props.length) {
      return JSON.stringify(this.path);
    }

    const main = this.#slices.map(({ type, value }) => {
      return type === 'segment' ? value : '[^/]+';
    }).join('\\/');
    return `/^${main}$/`;
  }
}
