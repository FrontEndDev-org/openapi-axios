import fs from 'fs';
import path from 'path';
import { configFileNameOrder, resolveConfig, resolveConfigFile } from '../../src/generators/command';
import { createTempDirname } from '../helpers';

test('resolveConfigFile', async () => {
  const [cwd, clean] = createTempDirname();

  expect(resolveConfigFile(cwd)).toBeUndefined();

  [...configFileNameOrder].reverse().forEach((name, index) => {
    const file1 = path.join(cwd, name);
    const file2 = path.join(cwd, configFileNameOrder[configFileNameOrder.length - 1 - index]);
    fs.writeFileSync(file1, '', 'utf8');
    expect(resolveConfigFile(cwd)).toBe(file2);
  });

  clean();
});

test('resolveConfig', async () => {
  const [cwd, clean] = createTempDirname();

  expect(() => resolveConfig(cwd)).toThrow('配置文件未找到');

  const file1 = path.join(cwd, configFileNameOrder[0]);
  fs.writeFileSync(file1, '', 'utf8');
  expect(() => resolveConfig(cwd)).toThrow('#/openAPIs - Required');

  fs.writeFileSync(
    file1,
    `module.exports = {
    openAPIs: []
  };`,
    'utf8'
  );
  expect(() => resolveConfig(cwd)).toThrow('#/openAPIs - Array must contain at least 1 element(s)');

  fs.writeFileSync(
    file1,
    `module.exports = {
    openAPIs: [{name: "test"}]
  };`,
    'utf8'
  );
  expect(() => resolveConfig(cwd)).toThrow('#/openAPIs/0/document - Required');

  clean();
});
