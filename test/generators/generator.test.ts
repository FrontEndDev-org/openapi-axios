import fs from 'fs';
import path from 'path';
import { Generator } from '../../src/generators/Generator';
import { createTempDirname } from '../helpers';

test('Generator', async () => {
  const tempDir = createTempDirname();
  const generator = new Generator({
    cwd: tempDir,
    openAPIs: [
      {
        name: 'petStore3',
        document: path.join(__dirname, '../files/petStore3.openapi.json'),
      },
    ],
  });

  await generator.generate();
  console.log(tempDir);
  expect(fs.existsSync(path.join(tempDir, 'src/apis/petStore3.ts'))).toBe(true);
});
