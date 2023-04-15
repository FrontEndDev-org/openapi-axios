import { buildName, findOrigin, refToType } from '../utils/string';
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
      const info = refToType(a.ref);
      a.target = this.getName(info.base);
      a.props = info.props;

      // 指向另外一个地址
      const { root, name, target } = a;
      if (root) {
        this.aliasRelationMap.set(name, target);
      }
    });

    this.unresolvedAliasList.forEach((a) => {
      a.origin = findOrigin(a.root ? a.name : a.target, this.aliasRelationMap);
    });

    this.unresolvedAliasList.length = 0;
  }

  nameCountMap = new Map<string /*name*/, number /*count*/>();
  nameRefMap = new Map<string /*name*/, string /*ref*/>();
  refNameMap = new Map<string /*ref*/, string /*name*/>();

  nextTypeName(name: string, refAble = false) {
    const ref = refAble ? `#/components/schemas/${name}` : '';
    const typeName = buildName(name, true);
    const count = this.nameCountMap.get(typeName) || 0;
    const nextCount = count + 1;
    const returnName = (typeName: string) => {
      if (ref) {
        this.nameRefMap.set(typeName, ref);
        this.refNameMap.set(ref, typeName);
      }

      return typeName;
    };

    this.nameCountMap.set(typeName, nextCount);
    return nextCount === 1 ? returnName(typeName) : returnName(typeName + nextCount);
  }

  getName(ref: string) {
    return this.refNameMap.get(ref) || '';
  }

  operationIdCountMap = new Map<string /*operationId*/, number /*count*/>();

  nextOperationId(method: string, url: string, operationId?: string) {
    operationId = operationId || buildName([method, url.split('/').pop()!].join('_'));
    const count = this.operationIdCountMap.get(operationId) || 0;
    const nextCount = count + 1;

    this.operationIdCountMap.set(operationId, nextCount);
    return nextCount === 1 ? operationId : operationId + nextCount;
  }
}
