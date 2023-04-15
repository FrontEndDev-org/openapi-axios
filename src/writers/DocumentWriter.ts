import { joinSlices } from '../utils/string';
import { PathsWriter } from './PathsWriter';

export class DocumentWriter extends PathsWriter {
  write() {
    return joinSlices([
      //
      this.writeStatements(),
      this.writeImports(),
      this.writeHelpers(),
      this.writeComponents(),
      this.writePaths(),
    ]);
  }
}
