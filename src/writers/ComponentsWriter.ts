import { TypeItem, TypeOrigin } from '../parsers/types';
import { joinSlices, toTypePath } from '../utils/string';
import { BaseWriter } from './BaseWriter';
import { CommentsWriter } from './CommentsWriter';

export class ComponentsWriter extends CommentsWriter {
  init() {
    super.init();
    this.imports.push('import type { OneOf } from "openapi-axios/helpers"');
  }

  writeComponents() {
    return this.format(joinSlices(this.document.components.map(this.writeRootType.bind(this)), '\n\n'));
  }

  protected writeRootType(type: TypeItem) {
    const comments = this.writeComments(type, true);
    return `${comments}export type ${type.name} = ${this.writeType(type)};`;
  }

  private writeType(type: TypeItem): string {
    if (this.isTypeAlias(type)) return `${type.origin}${toTypePath(type.props)}`;

    switch (type.type) {
      case 'object':
        return this.writeObject(type);

      case 'array':
        return this.writeArray(type);

      default:
        return this.writePrimitive(type);
    }
  }

  private writePrimitive(type: TypeOrigin) {
    return type.enum ? type.enum.map((el) => JSON.stringify(el)).join('|') : `${type.type}`;
  }

  private writeObject(type: TypeOrigin) {
    const { children } = type;

    if (!children || !children.length) return '{[key: string]: never}';

    const kvList = children.map((type) => {
      const comments = this.writeComments(type, true);
      const key = type.name;
      const equal = type.required ? ':' : '?:';
      const value = this.writeType(type);
      return comments + key + equal + value + ';';
    });
    return '{' + joinSlices(kvList) + '}';
  }

  private writeArray(type: TypeOrigin) {
    const { children } = type;

    if (!children || !children.length) return 'never';

    const vList = children.map((type) => {
      const comments = this.writeComments(type, true);
      const value = this.writeType(type);
      return comments + value;
    });

    return `Array<${joinSlices(vList, '|')}>`;
  }
}
