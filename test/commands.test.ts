import path from 'path';
import { start } from '../src';
import { test } from 'vitest';
import { cleanDir } from '../src/utils';

test('start', async () => {
  await start({
    configFile: path.join(__dirname, './oas.config.cjs'),
  });
  await cleanDir(path.resolve('dist-test'));
});
