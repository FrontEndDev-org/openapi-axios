import { PathsReader } from './PathsReader';
import { TypeDocument } from './types';

export class DocumentReader extends PathsReader {
  read(): TypeDocument {
    const components = this.readComponents();
    const paths = this.readPaths();
    const { info, servers } = this.document;
    const firstServer = servers?.at(0);
    const baseURL = firstServer ? firstServer.url : '/';
    const { title, description, version } = info;

    return {
      info: {
        title: title,
        description: description,
        version: version,
        baseURL,
      },
      components,
      paths,
    };
  }
}
