import { TypeComments, TypeItem } from '../readers/types';
import { isUndefined } from '../utils/type-is';
import { BaseWriter } from './BaseWriter';

export class CommentsWriter extends BaseWriter {
  writeComments(type: TypeItem, trailingEndOfLine = false) {
    const orders: (keyof TypeComments)[] = ['title', 'description', 'format', 'default', 'example'];
    const mainLines = [
      type.deprecated ? ' * @deprecated' : '',
      ...orders.map((key) => {
        const val = type[key];

        if (isUndefined(val)) return '';

        const [firstLine, ...restLines] = String(val).split('\n');
        return [`@${key} ${firstLine}`, ...restLines].map((line) => ` * ${line}`).join('\n');
      }),
    ].filter(Boolean);

    if (mainLines.length === 0) return '';

    return (
      '/**\n' + //////////////////////////////////////
      mainLines.join('\n') +
      '\n */' +
      (trailingEndOfLine ? '\n' : '')
    );
  }
}
