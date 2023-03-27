import chalk from 'chalk';
import path from 'path';
import * as process from 'process';
import { defineConfig } from './configure';
import { generate } from './generator';
import { UserConfig } from './types';
import { exitError, isFile, normalizeError, tryCatch } from './utils';

interface StartConfig {
  // 指定配置文件绝对路径
  configFile?: string;
}

export const startConfigFiles = ['openapi.config.cjs', 'openapi.config.js', 'openapi.json'];

export async function resolveConfigFile(cwd: string, configFile?: string) {
  if (configFile) {
    if (!(await isFile(path.join(configFile)))) {
      throw new Error(`指定配置文件 "${configFile}" 不存在`);
    }

    return configFile;
  }

  for (const file of startConfigFiles.values()) {
    if (await isFile(path.join(cwd, file))) {
      return file;
    }
  }
}

export async function start(startConfig?: StartConfig) {
  const configFile = await resolveConfigFile(process.cwd(), startConfig?.configFile);

  if (!configFile) {
    return exitError(`配置文件未找到，配置文件可以为 ${startConfigFiles.join('、')} 之一`);
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const [err, config] = await tryCatch<UserConfig>(require(configFile));

  if (err) {
    return exitError(err.message);
  }

  if (!config) {
    return exitError('配置文件内容可能为空');
  }

  const strictConfig = defineConfig(config);

  try {
    await generate(strictConfig, (generated, info) => {
      const { oasItem } = generated;
      const { index, length, done, start, end } = info;
      const width = Math.min(String(length).length, 2);
      const stepText = String(index + 1).padStart(width, '0');

      if (done) {
        const past = end - start;
        console.log(
          chalk.cyanBright(`[${stepText}/${length}]`),
          'generated ',
          chalk.yellowBright(oasItem.name),
          chalk.gray(`${past}ms`)
        );
      } else {
        console.log(
          chalk.cyanBright(`[${stepText}/${length}]`),
          'generating',
          chalk.yellowBright(oasItem.name),
          chalk.gray('...')
        );
      }
    });
  } catch (err) {
    exitError(normalizeError(err).message);
  }
}
