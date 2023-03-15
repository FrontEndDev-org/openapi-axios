import path from 'path';

const dirname = __dirname;

export const templatesDir = path.join(dirname, '../templates');
export const axiosImportDefault = `import { Axios } from 'axios';
const axios = new Axios();`;
export const helpersImport = `import { formatHeaders, formatBody } from 'oas-gen-ts/helpers';`;
