import * as fs from 'fs/promises';
import * as path from 'path';
import { generateApi, GenerateApiParams } from 'swagger-typescript-api';
import { OpenapiConfig, StrictConfig } from './configure';
import { axiosImportDefault, helpersImport, templatesDir } from './const';
import { isBoolean, isString, isUrl } from './utils/type-is';

export function generateParams(openapiConfig: OpenapiConfig, config: StrictConfig): GenerateApiParams {
  const { name, schema, unwrapResponseData: unwrapResponseDataScope } = openapiConfig;
  const { unwrapResponseData: unwrapResponseDataGlobal } = config;
  const unwrapResponseData = isBoolean(unwrapResponseDataScope) ? unwrapResponseDataScope : unwrapResponseDataGlobal;
  const common: Omit<GenerateApiParams, 'url' | 'input' | 'spec'> = {
    name,
    output: false,
    httpClientType: 'axios',
    templates: templatesDir,
    silent: true,
    unwrapResponseData,
  };

  if (isString(schema)) {
    if (isUrl(schema)) {
      return {
        ...common,
        url: schema,
      };
    } else {
      return {
        ...common,
        input: schema,
      };
    }
  } else {
    return {
      ...common,
      spec: schema,
    };
  }
}

export interface Generated {
  files: string[];
  openapi: OpenapiConfig;
  config: StrictConfig;
}

export type GenerateInfo = {
  index: number;
  length: number;
  done: boolean;
  start: number;
  end: number;
};

export type GeneratedCallback = (generated: Generated, info: GenerateInfo) => any;

export async function generateItem(openapiConfig: OpenapiConfig, config: StrictConfig): Promise<Generated> {
  const { axiosImport: axiosImportScope, schema } = openapiConfig;
  const { cwd, dest, axiosImport: axiosImportGlobal, unwrapResponseData } = config;
  const axiosImport = axiosImportScope || axiosImportGlobal || axiosImportDefault;
  const params = generateParams(openapiConfig, config);
  const { files } = await generateApi(params);
  const generated: Generated = {
    files: [],
    openapi: openapiConfig,
    config,
  };

  for (const { content, name: filename } of files) {
    const contentFinal = [axiosImport, helpersImport, content].join('\n');
    const file = path.join(cwd, dest, filename);
    const dir = path.dirname(file);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(file, contentFinal);

    generated.files.push(file);
  }

  return generated;
}

export async function generate(config: StrictConfig, callback?: GeneratedCallback): Promise<Generated[]> {
  const { apis } = config;
  let index = 0;
  const length = apis.length;
  const generatedList: Generated[] = [];

  for (const oasItem of apis) {
    const start = Date.now();
    callback?.(
      {
        files: [],
        openapi: oasItem,
        config,
      },
      { index, length, done: false, start, end: start }
    );
    const generated = await generateItem(oasItem, config);
    generatedList.push(generated);
    callback?.(generated, { index, length, done: true, start, end: Date.now() });
    index++;
  }

  return generatedList;
}
