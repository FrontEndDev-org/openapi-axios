import type { TypeAlias, TypeDocument, TypeItem } from '../parsers/types';
import { joinSlices } from '../utils/string';
import type { StrictPrinterOptions, PrinterOptions } from './types';

export class BasePrinter {
    static defaults: StrictPrinterOptions = {
        axiosImport: `import axios from 'axios';`,
        requestPathArgName: 'path',
        requestQueryArgName: 'params',
        requestBodyArgName: 'data',
        responseTypeName: 'AxiosPromise',
    };

    options: StrictPrinterOptions;
    constructor(
        readonly document: TypeDocument,
        options?: PrinterOptions,
    ) {
        this.options = Object.assign({}, BasePrinter.defaults, options) as StrictPrinterOptions;
        this.init();
    }

    protected init() {
        //
    }

    protected isTypeAlias(type: TypeItem): type is TypeAlias {
        return type.kind === 'alias';
    }

    // 头部声明
    statements: string[] = [];

    // 头部导入
    imports: string[] = [];

    // 帮助类型
    helpers: string[] = [];

    protected printStatements() {
        return joinSlices(this.statements);
    }

    protected printImports() {
        return joinSlices(this.imports);
    }

    protected printHelpers() {
        return joinSlices(this.helpers);
    }
}
