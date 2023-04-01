import path from 'path';
import { start } from '../src';
import { test } from 'vitest';

import { cleanDir } from '../src/utils/fs2';

test('start', async () => {
  await start({
    configFile: path.join(__dirname, './openapi.config.cjs'),
  });
  await cleanDir(path.resolve('dist-test'));
});
