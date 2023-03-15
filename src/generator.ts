import { cosmiconfig } from 'cosmiconfig';
import fs from 'node:fs/promises';
import path from 'node:path';
import { generateApi } from 'swagger-typescript-api';
import { axiosImportDefault, helpersImport, templatesDir } from './const';
import { Config, Oas } from './types';

export async function generateItem(oas: Oas, config: Config) {
  const { name, url, spec, axiosImport: axiosImportScope } = oas;
  const { cwd, dest, axiosImport: axiosImportGlobal } = config;
  const axiosImport = axiosImportScope || axiosImportGlobal || axiosImportDefault;
  const { files } = await generateApi({
    name,
    url,
    spec,
    output: false,
    httpClientType: 'axios',
    templates: templatesDir,
  });

  for (const { content, name: filename } of files) {
    const contentFinal = [axiosImport, helpersImport, content].join('\n');
    const file = path.join(cwd, dest, filename);
    await fs.writeFile(file, contentFinal);
  }
}

export async function generate(config: Config) {
  const { list } = config;

  for (const oas of list) {
    await generateItem(oas, config);
  }
}

export async function start() {
  const explorer = cosmiconfig('oas');
  const result = await explorer.search();

  if (!result) {
    throw new Error('Could not find an oas config file');
  }

  const config = result.config as Config;
  await generate(config);
}
