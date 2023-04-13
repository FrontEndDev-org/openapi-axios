import { buildName } from '../utils/string';

type Resolver = () => any;

export class Named {
  nameCountMap = new Map<string /*name*/, number /*count*/>();
  namePathMap = new Map<string /*name*/, string /*path*/>();
  pathNameMap = new Map<string /*path*/, string /*name*/>();

  /**
   * 添加待解决列表，名称与路径的映射，只有在全部解析完毕之后才能确定
   * @type {Resolver[]}
   */
  private resolverList: Resolver[] = [];
  willResolve(resolver: Resolver) {
    this.resolverList.push(resolver);
  }

  didResolve() {
    this.resolverList.forEach((resolver) => resolver());
    this.resolverList.length = 0;
  }

  nextTypeName(name: string, path = `#/components/schemas/${name}`) {
    const typeName = buildName(name, true);
    const count = this.nameCountMap.get(typeName) || 0;
    const nextCount = count + 1;
    const returnName = (typeName: string) => {
      this.namePathMap.set(typeName, path);
      this.pathNameMap.set(path, typeName);
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
