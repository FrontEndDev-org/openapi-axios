import type { OrderlyItem } from './helpers';
import { isArray } from '../utils/type-is';
import { sortingByDeps } from './helpers';

const contentTypes = [
  'header',
  'alert',
  'info',
  'import',
  'block',
  'footer',
] as const;
export type ContentType = typeof contentTypes[number];
export interface OrderlyCode extends OrderlyItem {
  code: string;
}

export class Content {
  parts = new Map<ContentType, string[]>();
  orderlyCodes: OrderlyCode[] = [];

  push(type: ContentType, code: string | string[]) {
    const part = this.parts.get(type) || [];
    part.push(...isArray(code) ? code : [code]);
    this.parts.set(type, part);
  }

  unshift(type: ContentType, code: string | string[]) {
    const part = this.parts.get(type) || [];
    part.unshift(...isArray(code) ? code : [code]);
    this.parts.set(type, part);
  }

  add(orderlyCode: OrderlyCode) {
    this.orderlyCodes.push(orderlyCode);
  }

  print() {
    this.unshift('block', sortingByDeps(this.orderlyCodes).map(i => i.code));
    this.orderlyCodes.length = 0;
    const parts = [...contentTypes].map(t => this.parts.get(t)).filter(Boolean) as string[][];
    return parts.map(p => p.join('\n')).join('\n\n');
  }

  errors: string[] = [];
  pushError(message: string) {
    this.errors.push(message);
  }
}
