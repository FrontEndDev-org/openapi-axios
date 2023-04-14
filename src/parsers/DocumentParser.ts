import { PathsParser } from './PathsParser';
import { TypeDocument } from './types';

export class DocumentParser extends PathsParser {
  parse(): TypeDocument {
    const components = this.parseComponents();
    const paths = this.parsePaths();
    return { components, paths };
  }
}
