import { TypeItem, TypeOrigin } from '../readers/types';
import { toTypePath } from '../utils/string';
import { BaseWriter } from './BaseWriter';
import { CommentsWriter } from './CommentsWriter';

export class ComponentsWriter extends CommentsWriter {
  writeComponents() {
    return this.format(this.document.components.map(this.writeRootType.bind(this)).join('\n\n'));
  }

  protected writeRootType(type: TypeItem) {
    const comments = this.writeComments(type, true);
    return `${comments}export type ${type.name} = ${this.writeType(type)};`;
  }

  private writeType(type: TypeItem): string {
    if (this.isTypeAlias(type)) return `${type.origin}${toTypePath(type.props)}`;

    switch (type.type) {
      case 'number':
      case 'string':
      case 'boolean':
      case 'never':
        return this.writePrimitive(type);

      case 'object':
        return this.writeObject(type);

      case 'array':
        return this.writeArray(type);
    }
  }

  private writePrimitive(type: TypeOrigin) {
    return type.enum ? type.enum.map((el) => JSON.stringify(el)).join('|') : `${type.type}`;
  }

  private writeObject(type: TypeOrigin) {
    const kvList = type.children!.map((t) => {
      const c = this.writeComments(t, true);
      const e = type.required ? ':' : '?:';
      const v = this.writeType(t);
      return `${c}${t.name}${e}${v};`;
    });
    return '{' + kvList.join('\n') + '}';
  }

  private writeArray(type: TypeOrigin) {
    const one = this.writeType(type.children!.at(0)!);
    return `Array<${one}>`;
  }
}
