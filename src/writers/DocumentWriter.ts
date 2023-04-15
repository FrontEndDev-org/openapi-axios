import { joinSlices } from '../utils/string';
import { PathsWriter } from './PathsWriter';

export class DocumentWriter extends PathsWriter {
  public init() {
    super.init();
    this.helpers.push('const BASE_URL = "";');
  }

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
