import type { Arg } from './Arg';
import { TYPE_FILE_EXPORT_NAME } from './const';
import { requiredTypeStringify } from './helpers';

export class Args {
  fixedArgs: Arg[];
  constructor(private args: (Arg | null)[]) {
    this.fixedArgs = this._sort();
  }

  private _sort() {
    const fixedArgs = this.args.filter(Boolean) as Arg[];
    return fixedArgs.sort((a, b) => Number(b.required) - Number(a.required));
  }

  toComments() {
    return this.fixedArgs.reduce(
      (acc, arg) => {
        return {
          ...acc,
          ...arg.comments,
        };
      },
      {} as Record<string, unknown>,
    );
  }

  printFormalParams() {
    return this.fixedArgs
      .filter(fixArg => fixArg.typeValue !== '')
      .map((fixArg) => {
        const typeValue = fixArg.kind === 'config' ? fixArg.typeValue : `${TYPE_FILE_EXPORT_NAME}.${fixArg.typeName}`;
        return `${fixArg.argName}${requiredTypeStringify(fixArg.required)}${typeValue}`;
      })
      .join(',');
  }

  filterValidateAble() {
    return this.fixedArgs
      .filter(fixArg => fixArg.typeValue !== '' && fixArg.kind !== 'config');
  }

  printSchemaTypes() {
    return this.filterValidateAble()
      .map(fixArg => `export type ${fixArg.typeName} = ${fixArg.typeValue};`);
  }

  printActualParams() {
    return this.fixedArgs
      .map((fixedArg) => {
        const { originName, argName: varName, propName, kind, props, url, isSingle } = fixedArg;

        switch (kind) {
          case 'config':
            return `...${varName}`;

          case 'path': {
            const pathNameInProps = props.reduce((acc, cur) => {
              acc[cur.name] = true;
              return acc;
            }, {} as Record<string, boolean>);
            const resolvedURL = url.replace(/\{(.*?)\}/g, (_, originName) => {
              if (!pathNameInProps[originName]) {
                throw new Error(`路径参数 ${originName} 未定义`);
              }

              // 只有一个路径参数时，路径值直接传入
              if (props.length === 1)
                return `\${${varName}}`;

              return `\${${varName}[${JSON.stringify(originName)}]}`;
            });
            return `url: \`${resolvedURL}\``;
          }

          default: {
            const value = props.length === 1 && !isSingle ? `{${JSON.stringify(originName)}: ${varName}}` : varName;
            return `${propName}: ${value}`;
          }
        }
      })
      .join(',\n');
  }
}
