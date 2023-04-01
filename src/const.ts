import path from 'path';

export const pkgName = process.env.PKG_NAME!;
export const pkgVersion = process.env.PKG_VERSION!;

const dirname = __dirname;

export const templatesDir = path.join(dirname, '../templates');
export const axiosImportDefault = `import { Axios } from 'axios';
const axios = new Axios();`;
export const helpersImport = `import { formatHeaders, formatBody } from 'openapi-axios/helpers';`;
