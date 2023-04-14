import { TypeItem, TypeOrigin } from '../readers/types';
import { toTypePath } from '../utils/string';
import { BaseWriter } from './BaseWriter';
import { CommentsWriter } from './CommentsWriter';

export class ComponentsWriter extends CommentsWriter {
  writeComponents() {
    const textList: string[] = [];
    this.options.document.components.forEach((type) => {
      const comments = this.writeComments(type, true);
      textList.push(`${comments}export type ${type.name} = ${this.writeType(type)};`);
    });
    return this.format(textList.join('\n\n'));
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
    return `${type.type}`;
  }

  private writeObject(type: TypeOrigin) {
    const kvList = type.children!.map((t) => {
      const c = this.writeComments(t, true);
      const v = this.writeType(t);
      return `${c}${t.name}: ${v};`;
    });
    return '{' + kvList.join('\n') + '}';
  }

  private writeArray(type: TypeOrigin) {
    const one = this.writeType(type.children!.at(0)!);
    return `Array<${one}>`;
  }
}
