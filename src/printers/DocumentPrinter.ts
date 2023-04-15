import { joinSlices } from '../utils/string';
import { PathsPrinter } from './PathsPrinter';

export class DocumentPrinter extends PathsPrinter {
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
