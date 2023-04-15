import { buildName, findOrigin, nextUniqueName, refToType } from '../utils/string';
import { TypeAlias } from './types';

export class Named {
  private aliasRelationMap = new Map<string /*source*/, string /*target*/>();
  private unresolvedAliasList: TypeAlias[] = [];
  addAlias(a: TypeAlias): TypeAlias {
    this.unresolvedAliasList.push(a);
    return a;
  }
  resolveAlias() {
    this.unresolvedAliasList.forEach((a) => {
      if (!a.ref) return;

      const info = refToType(a.ref);
      a.target = this.getName(info.base);
      a.props = info.props;

      // 指向另外一个地址
      const { refAble, name, target } = a;
      if (refAble) {
        this.aliasRelationMap.set(name, target);
      }
    });

    this.unresolvedAliasList.forEach((a) => {
      a.origin = findOrigin(a.refAble ? a.name : a.target, this.aliasRelationMap);
    });

    this.unresolvedAliasList.length = 0;
  }

  nameCountMap = new Map<string /*name*/, number /*count*/>();
  nameRefMap = new Map<string /*name*/, string /*ref*/>();
  refNameMap = new Map<string /*ref*/, string /*name*/>();

  /**
   * 注册内部名称
   * @param {string} name
   */
  internalName(name: string) {
    this.nameCountMap.set(name, 1);
  }

  nextTypeName(name: string, refAble = false) {
    const ref = refAble ? `#/components/schemas/${name}` : '';
    const refTypeName = buildName(name, true);
    const uniqueTypeName = nextUniqueName(refTypeName, this.nameCountMap);

    if (ref) {
      this.nameRefMap.set(uniqueTypeName, ref);
      this.refNameMap.set(ref, uniqueTypeName);
    }

    return uniqueTypeName;
  }

  getName(ref: string) {
    return this.refNameMap.get(ref) || '';
  }

  nextOperationId(method: string, url: string, operationId?: string) {
    operationId = operationId || buildName([method, url.split('/').pop()!].join('_'));
    return nextUniqueName(operationId, this.nameCountMap);
  }
}
