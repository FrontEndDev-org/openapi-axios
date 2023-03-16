import fs from 'fs/promises';
import path from 'path';
import { generateApi } from 'swagger-typescript-api';
import { axiosImportDefault, helpersImport, templatesDir } from './const';
import { Generated, GeneratedCallback, OasItem, OasItemAsSpec, OasItemAsUrl, StrictConfig } from './types';

export async function generateItem(oasItem: OasItem, config: StrictConfig): Promise<Generated> {
  const { name, axiosImport: axiosImportScope } = oasItem;
  const { cwd, dest, axiosImport: axiosImportGlobal, unwrapResponseData } = config;
  const axiosImport = axiosImportScope || axiosImportGlobal || axiosImportDefault;
  const { files } = await generateApi({
    name,
    url: (oasItem as OasItemAsUrl).url,
    spec: (oasItem as OasItemAsSpec).spec,
    output: false,
    httpClientType: 'axios',
    templates: templatesDir,
    silent: true,
    unwrapResponseData,
  });

  const generated: Generated = {
    files: [],
    oasItem,
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
  const { list, onGenerated } = config;
  let index = 0;
  const length = list.length;
  const generatedList: Generated[] = [];

  for (const oasItem of list) {
    const start = Date.now();
    callback?.(
      {
        files: [],
        oasItem,
        config,
      },
      { index, length, done: false, start, end: start }
    );
    const generated = await generateItem(oasItem, config);
    generatedList.push(generated);
    onGenerated(generated);
    callback?.(generated, { index, length, done: true, start, end: Date.now() });
    index++;
  }

  return generatedList;
}
