import path from 'node:path';
import { expect } from 'vitest';
import { OpenAPIVersion } from '../../src';
import { Reader } from '../../src/generator/Reader';

it('read local', async () => {
  const reader = new Reader();
  reader.cwd = path.resolve(__dirname, '../example-json/3.0');
  const migrated = await reader.read('pet-store.json');

  expect(migrated).toHaveLength(2);
  expect(migrated[0].version).toEqual(OpenAPIVersion.V3_0);
  expect(migrated[1].version).toEqual(OpenAPIVersion.V3_1);
});

it('read remote', async () => {
  const reader = new Reader();
  const migrated = await reader.read('https://petstore31.swagger.io/api/v31/openapi.json');

  expect(migrated).toHaveLength(1);
  expect(migrated[0].version).toEqual(OpenAPIVersion.V3_1);
});

it('read object', async () => {
  const reader = new Reader();
  const migrated = await reader.read({
    info: {
      title: 'test',
      version: '1',
    },
    openapi: '3.0.0',
    paths: {},
  });

  expect(migrated).toHaveLength(2);
  expect(migrated[0].version).toEqual(OpenAPIVersion.V3_0);
  expect(migrated[1].version).toEqual(OpenAPIVersion.V3_1);
});
