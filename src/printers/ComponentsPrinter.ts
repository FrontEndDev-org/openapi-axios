import { TypeItem, TypeOrigin } from '../parsers/types';
import { joinSlices, toTypePath } from '../utils/string';
import { BasePrinter } from './BasePrinter';
import { CommentsPrinter } from './CommentsPrinter';

export class ComponentsPrinter extends CommentsPrinter {
  init() {
    super.init();
    this.imports.push('import type { OneOf } from "openapi-axios/helpers"');
  }

  printComponents() {
    return this.format(joinSlices(this.document.components.map(this.printRootType.bind(this)), '\n\n'));
  }

  protected printRootType(type: TypeItem) {
    const comments = this.printComments(type, true);
    return `${comments}export type ${type.name} = ${this.printType(type)};`;
  }

  private printType(type: TypeItem): string {
    if (this.isTypeAlias(type)) return `${type.origin}${toTypePath(type.props)}`;

    switch (type.type) {
      case 'object':
        return this.printObject(type);

      case 'array':
        return this.printArray(type);

      default:
        return this.printPrimitive(type);
    }
  }

  private printPrimitive(type: TypeOrigin) {
    return type.enum ? type.enum.map((el) => JSON.stringify(el)).join('|') : `${type.type}`;
  }

  private printObject(type: TypeOrigin) {
    const { children } = type;

    if (!children || !children.length) return '{[key: string]: never}';

    const kvList = children.map((type) => {
      const comments = this.printComments(type, true);
      const key = type.name;
      const equal = type.required ? ':' : '?:';
      const value = this.printType(type);
      return comments + key + equal + value + ';';
    });
    return '{' + joinSlices(kvList) + '}';
  }

  private printArray(type: TypeOrigin) {
    const { children } = type;

    if (!children || !children.length) return 'never';

    const vList = children.map((type) => {
      const comments = this.printComments(type, true);
      const value = this.printType(type);
      return comments + value;
    });

    return `Array<${joinSlices(vList, '|')}>`;
  }
}
