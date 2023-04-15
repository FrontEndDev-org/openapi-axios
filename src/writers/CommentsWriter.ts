import { TypeComments, TypeItem } from '../readers/types';
import { joinSlices } from '../utils/string';
import { isUndefined } from '../utils/type-is';
import { BaseWriter } from './BaseWriter';

export class CommentsWriter extends BaseWriter {
  writeComments(type: TypeComments, trailingEndOfLine = false) {
    const orders: (keyof TypeComments)[] = ['title', 'description', 'format', 'default', 'example'];
    const mainLines = joinSlices([
      type.deprecated ? ' * @deprecated' : '',
      ...orders.map((key) => {
        const val = type[key];

        if (isUndefined(val)) return '';

        const [firstLine, ...restLines] = String(val).split('\n');
        return [`@${key} ${firstLine}`, ...restLines].map((line) => ` * ${line}`).join('\n');
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
