import { PathsReader } from './PathsReader';
import { TypeDocument } from './types';

export class DocumentReader extends PathsReader {
  parse(): TypeDocument {
    this.init();
    const components = this.parseComponents();
    const paths = this.parsePaths();
    return {
      info: this.document.info,
      servers: this.document.servers,
      components,
      paths,
    };
  }
}
