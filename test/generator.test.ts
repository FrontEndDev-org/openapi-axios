import { random } from 'lodash-es';
import path from 'path';
import { cleanDir, isFile } from 'src/utils';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { generate, Generated, GenerateInfo, generateItem, Spec } from '../src';
import petstore3 from './petstore3.json';

describe('generate-item', () => {
  const cwd = process.cwd();
  const dest = 'dist-test';
  const config = { axiosImport: '', cwd, dest: dest, list: [], unwrapResponseData: false, onGenerated: () => 0 };

  afterEach(async () => {
    await cleanDir(path.join(cwd, dest));
  });

  test(
    'from url',
    async () => {
      const name = '/' + random(1, 1000) + '/' + random(1, 1000);
      const expectedFile = path.join(cwd, dest, name + '.ts');

      const generated = await generateItem(
        {
          name,
          url: 'https://petstore3.swagger.io/api/v3/openapi.json',
        },
        config
      );
      expect(generated.files).toHaveLength(1);
      const [generatedFile] = generated.files;
      expect(generatedFile).toBe(expectedFile);
      await expect(isFile(generatedFile)).toBeTruthy();
    },
    { timeout: -1 }
  );

  test('from sepc', async () => {
    const name = '/' + random(1, 1000) + '/' + random(1, 1000);
    const expectedFile = path.join(cwd, dest, name + '.ts');

    const generated = await generateItem(
      {
        name,
        spec: petstore3 as unknown as Spec,
      },
      config
    );
    expect(generated.files).toHaveLength(1);
    const [generatedFile] = generated.files;
    expect(generatedFile).toBe(expectedFile);
    await expect(isFile(generatedFile)).toBeTruthy();
  });
});

test('generate', async () => {
  const cwd = process.cwd();
  const dest = 'dist-test';
  const config = {
    axiosImport: '',
    cwd,
    dest: dest,
    list: [
      {
        name: random(1, 1000).toString(),
        spec: petstore3 as unknown as Spec,
      },
      {
        name: random(1, 1000).toString(),
        spec: petstore3 as unknown as Spec,
      },
    ],
    unwrapResponseData: false,
    onGenerated: () => 0,
  };
  const fn1 = vi.fn<[Generated, GenerateInfo]>();

  const generatedList = await generate(config, fn1);
  await cleanDir(path.join(cwd, dest));
  expect(generatedList).toHaveLength(2);
  expect(fn1).toHaveBeenCalledTimes(4);
  expect(fn1.mock.calls[0][1].index).toBe(0);
  expect(fn1.mock.calls[0][1].length).toBe(2);
  expect(fn1.mock.calls[1][1].index).toBe(0);
  expect(fn1.mock.calls[1][1].length).toBe(2);
  expect(fn1.mock.calls[2][1].index).toBe(1);
  expect(fn1.mock.calls[2][1].length).toBe(2);
  expect(fn1.mock.calls[3][1].index).toBe(1);
  expect(fn1.mock.calls[3][1].length).toBe(2);
});
