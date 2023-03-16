import chalk from 'chalk';
import { cosmiconfig } from 'cosmiconfig';
import fs from 'fs/promises';
import path from 'path';
import { generateApi } from 'swagger-typescript-api';
import { axiosImportDefault, helpersImport, templatesDir } from './const';
import { Config, Oas } from './types';
import { exitError, normalizeError, tryCatch } from './utils';

export async function generateItem(oas: Oas, config: Config) {
  const { name, url, spec, axiosImport: axiosImportScope } = oas;
  const { cwd, dest, axiosImport: axiosImportGlobal, unwrapResponseData } = config;
  const axiosImport = axiosImportScope || axiosImportGlobal || axiosImportDefault;
  const { files } = await generateApi({
    name,
    url,
    spec,
    output: false,
    httpClientType: 'axios',
    templates: templatesDir,
    silent: true,
    unwrapResponseData,
  });

  for (const { content, name: filename } of files) {
    const contentFinal = [axiosImport, helpersImport, content].join('\n');
    const file = path.join(cwd, dest, filename);
    const dir = path.dirname(file);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(file, contentFinal);
  }
}

export async function generate(config: Config) {
  const { list } = config;
  let step = 0;
  const length = list.length;
  const width = String(length).length;

  for (const oas of list) {
    step++;
    const stepText = String(step).padStart(width, '0');
    console.log(chalk.cyanBright(`[${stepText}/${length}]`), 'generating', chalk.yellow(oas.name));
    await generateItem(oas, config);
  }
}

export async function start() {
  const explorer = cosmiconfig('oas', {
    searchPlaces: ['oas.config.cjs', 'oas.config.js', 'oas.json'],
  });
  const [err1, result] = await tryCatch(explorer.search());

  if (err1) {
    return exitError('配置文件查找失败');
  }

  if (!result) {
    return exitError('配置文件未找到');
  }

  const config = result.config as Config;

  try {
    await generate(config);
  } catch (err) {
    exitError(normalizeError(err).message);
  }
}
