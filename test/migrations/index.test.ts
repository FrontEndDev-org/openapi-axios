import { expect } from 'vitest';
import { OpenAPIVersion } from '../../src';
import { migrate } from '../../src/migrations';

it('migrate 2.0.0', () => {
  const migrated = migrate({
    swagger: '2.0.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {},
  });
  // console.log(v3_1);
  expect(migrated).toHaveLength(3);
  expect(migrated[0].version).toEqual(OpenAPIVersion.V2_0);
  expect(migrated[1].version).toEqual(OpenAPIVersion.V3_0);
  expect(migrated[2].version).toEqual(OpenAPIVersion.V3_1);
});

it('migrate 3.0.0', () => {
  const migrated = migrate({
    openapi: '3.0.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {},
  });
  // console.log(v3_1);
  expect(migrated).toHaveLength(2);
  expect(migrated[0].version).toEqual(OpenAPIVersion.V3_0);
  expect(migrated[1].version).toEqual(OpenAPIVersion.V3_1);
});

it('migrate 3.1.0', () => {
  const migrated = migrate({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {},
  });
  // console.log(v3_1);
  expect(migrated).toHaveLength(1);
  expect(migrated[0].version).toEqual(OpenAPIVersion.V3_1);
});
