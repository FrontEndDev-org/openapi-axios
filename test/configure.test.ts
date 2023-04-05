import { defaults, UserConfig, defineConfig } from '../src';

test('defaults', () => {
  expect(defaults.axiosImport).toBe(`import { Axios } from 'axios';
const axios = new Axios();`);
  expect(defaults.dest).toBe('src/apis');
  expect(defaults.cwd).toBe(process.cwd());
  expect(defaults.apis).toHaveLength(0);
  expect(defaults.unwrapResponseData).toBe(false);
});

test('defineConfig', () => {
  const userConfig: UserConfig = {
    apis: [],
  };
  const strictConfig = defineConfig(userConfig);

  expect(strictConfig).not.toBe(userConfig);
});
