import chalk from 'chalk';
import path from 'path';
import * as process from 'process';
import { defineConfig } from './configure';
import { generate } from './generator';
import { UserConfig } from './types';
import { isFile, isString, isUrl, normalizeError, syncPromise, tryCatch } from './utils';

interface StartConfig {
  // 指定配置文件绝对路径
  configFile?: string;
}

export const startConfigFiles = ['openapi.config.cjs', 'openapi.config.js', 'openapi.json'];

export async function resolveConfigPath(cwd: string, configFile?: string) {
  if (configFile) {
    const configPath = path.join(configFile);

    if (!(await isFile(configPath))) {
      throw new Error(`指定配置文件 "${configFile}" 不存在`);
    }

    return configPath;
  }

  for (const file of startConfigFiles.values()) {
    const configPath = path.join(cwd, file);

    if (await isFile(configPath)) {
      return configPath;
    }
  }
}

export async function start(startConfig?: StartConfig) {
  const configPath = await resolveConfigPath(process.cwd(), startConfig?.configFile);

  if (!configPath) {
    throw new Error(`配置文件未找到，配置文件可以是 ${startConfigFiles.join('、')} 之一`);
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const [err, config] = await tryCatch<UserConfig>(syncPromise(() => require(configPath)));

  if (err) {
    throw new Error(err.message);
  }

  if (!config) {
    throw new Error('配置文件内容可能为空');
  }

  const strictConfig = defineConfig(config);

  await generate(strictConfig, (generated, info) => {
    const { openapi, files } = generated;
    const { name, schema } = openapi;
    const { index, length, done, start, end } = info;
    const width = Math.min(String(length).length, 2);
    const stepText = String(index + 1).padStart(width, '0');
    const stepWidth = 1 /*[*/ + width + 1 /*/*/ + width + 1; /*]*/
    const generated_ = ' generated';
    const generating = 'generating';
    const chalkLabel = (label: string) => ' '.repeat(stepWidth + generating.length - label.length + 1) + label;
    const chalkValue = (value: string) => chalk.magentaBright(value);

    if (done) {
      files.forEach((file) => {
        console.log(chalkLabel('created'), chalk.magentaBright(path.relative(process.cwd(), file)));
      });

      const past = end - start;
      console.log(
        chalk.cyanBright(`[${stepText}/${length}]`),
        generated_,
        chalk.yellowBright(name),
        chalk.gray(`${past}ms`)
      );
    } else {
      console.log(chalk.cyanBright(`[${stepText}/${length}]`), generating, chalk.yellowBright(name), chalk.gray('...'));

      if (isString(schema)) {
        console.log(chalkLabel(isUrl(schema) ? 'fetch' : 'use'), chalkValue(schema));
      } else {
        console.log(chalkLabel('specify'), chalkValue('specification'));
      }
    }
  });
}

export function run() {
  start()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      const error = normalizeError(err);
      console.log(chalk.redBright(error.message));
      process.exit(1);
    });
}
