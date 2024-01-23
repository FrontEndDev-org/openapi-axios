import { joinSlices } from '../utils/string';
import { PathsPrinter } from './PathsPrinter';

export class DocumentPrinter extends PathsPrinter {
    print() {
        return joinSlices([
            //
            this.printStatements(),
            this.printImports(),
            this.printHelpers(),
            this.printComponents(),
            this.printPaths(),
        ]);
    }
}
