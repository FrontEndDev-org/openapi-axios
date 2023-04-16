import path from 'path';
import { Reader } from '../../src/generators/Reader';

test('read local', async () => {
  const reader = new Reader();
  reader.cwd = path.resolve(__dirname, '../files');
  const document = await reader.read('petStore3.openapi.json');
  expect(document.openapi).toBeTypeOf('string');
});

test('read remote', async () => {
  const reader = new Reader();
  const document = await reader.read('https://gw.alipayobjects.com/os/antfincdn/LyDMjDyIhK/1611471979478-opa.json');
  expect(document.openapi).toBeTypeOf('string');
});

test('read object', async () => {
  const reader = new Reader();
  const document = await reader.read({
    info: {
      title: 'test',
      version: '1',
    },
    openapi: '3.0.0',
    paths: {},
  });
  expect(document.openapi).toBeTypeOf('string');
});
