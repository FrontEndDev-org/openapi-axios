import path from 'node:path';

export const templatesDir = path.join(__dirname, '../templates');
export const axiosImportDefault = `import { Axios } from 'axios';
const axios = new Axios();`;
export const helpersImport = `import { formatHeaders, formatBody } from 'oas-gen-ts/client'`;
