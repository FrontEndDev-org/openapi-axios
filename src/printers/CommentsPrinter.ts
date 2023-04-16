import { TypeComments, TypeItem } from '../parsers/types';
import { joinSlices } from '../utils/string';
import { isUndefined } from '../utils/type-is';
import { BasePrinter } from './BasePrinter';

export class CommentsPrinter extends BasePrinter {
  printComments(type: TypeComments, trailingEndOfLine = false) {
    const orders: (keyof TypeComments)[] = ['title', 'description', 'format', 'default', 'example'];
    const mainLines = joinSlices([
      type.deprecated ? ' * @deprecated' : '',
      ...orders.map((key) => {
        const val = type[key];

        if (isUndefined(val)) return '';

        const [firstLine, ...restLines] = String(val).split('\n');
        return joinSlices([`@${key} ${firstLine}`, ...restLines].map((line) => ` * ${line}`));
      }),
    ]);

    if (mainLines.length === 0) return '';

    return (
      '/**\n' + //////////////////////////////////////
      mainLines +
      '\n */' +
      (trailingEndOfLine ? '\n' : '')
    );
  }
}
