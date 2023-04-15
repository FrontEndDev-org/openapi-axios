import { PathsReader } from './PathsReader';
import { TypeDocument } from './types';

export class DocumentReader extends PathsReader {
  read(): TypeDocument {
    const components = this.readComponents();
    const paths = this.readPaths();
    return {
      info: this.document.info,
      servers: this.document.servers,
      components,
      paths,
    };
  }
}
