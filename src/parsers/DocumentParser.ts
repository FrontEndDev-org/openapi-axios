import { PathsParser } from './PathsParser';
import { TypeDocument } from './types';

export class DocumentParser extends PathsParser {
  parseDocument(): TypeDocument {
    const components = this.parseComponents();
    const paths = this.parsePaths();
    const { info, servers } = this.document!;
    const firstServer = servers?.at(0);
    const baseURL = firstServer && firstServer.url;
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
