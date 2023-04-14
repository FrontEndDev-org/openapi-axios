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
    const aliasTargetList: TypeAlias[] = [];
    this.unresolvedAliasList.forEach((a) => {
      const info = refToType(a.ref);
      a.target = this.pathNameMap.get(info.base) || '';
      a.props = info.props;

      // 指向另外一个地址
      const { name, target } = a;
      if (name && target) {
        this.aliasRelationMap.set(name, target);
        aliasTargetList.push(a);
      }
    });

    aliasTargetList.forEach((a) => {
      a.origin = findOrigin(a.name, this.aliasRelationMap);
    });

    this.unresolvedAliasList.length = 0;
  }

  nameCountMap = new Map<string /*name*/, number /*count*/>();
  namePathMap = new Map<string /*name*/, string /*path*/>();
  pathNameMap = new Map<string /*path*/, string /*name*/>();

  nextTypeName(name: string) {
    const ref = `#/components/schemas/${name}`;
    const typeName = buildName(name, true);
    const count = this.nameCountMap.get(typeName) || 0;
    const nextCount = count + 1;
    const returnName = (typeName: string) => {
      this.namePathMap.set(typeName, ref);
      this.pathNameMap.set(ref, typeName);
      return typeName;
    };

    this.nameCountMap.set(typeName, nextCount);
    return nextCount === 1 ? returnName(typeName) : returnName(typeName + nextCount);
  }

  getName(path: string) {
    return this.pathNameMap.get(path) || '';
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
