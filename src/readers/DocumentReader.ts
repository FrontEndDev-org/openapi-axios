import { PathsReader } from './PathsReader';
import { TypeDocument } from './types';

export class DocumentReader extends PathsReader {
  parse(): TypeDocument {
    const components = this.parseComponents();
    const paths = this.parsePaths();
    return { components, paths };
  }
}
