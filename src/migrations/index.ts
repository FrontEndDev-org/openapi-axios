import type { OpenAPIAll, OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from '../types/openapi';
import { OpenAPIVersion } from '../types/openapi';
import { migrate_2_0To3_0 } from './openapi-2_0';
import { migrate_3_0To3_1 } from './openapi-3_0';

export function detectVersion(openapi: OpenAPIAll.Document): OpenAPIVersion {
  if ('swagger' in openapi) {
    return OpenAPIVersion.V2_0;
  }

  if (openapi.openapi.startsWith('3.0')) {
    return OpenAPIVersion.V3_0;
  }

  if (openapi.openapi.startsWith('3.1')) {
    return OpenAPIVersion.V3_1;
  }

  throw new Error(`Unsupported OpenAPI version: ${openapi.openapi}`);
}

const migrations = [
  //
  { from: OpenAPIVersion.V2_0, migrate: migrate_2_0To3_0 },
  { from: OpenAPIVersion.V3_0, migrate: migrate_3_0To3_1 },
  { from: OpenAPIVersion.V3_1 },
];

export interface MigratedV2_0 { version: OpenAPIVersion.V2_0; document: OpenAPIV2.Document; errors: string[] }
export interface MigratedV3_0 { version: OpenAPIVersion.V3_0; document: OpenAPIV3.Document; errors: string[] }
export interface MigratedV3_1 { version: OpenAPIVersion.V3_1; document: OpenAPIV3_1.Document; errors: string[] }

export function migrate(openapi: OpenAPIAll.Document) {
  const migrated: Array<MigratedV2_0 | MigratedV3_0 | MigratedV3_1> = [];

  migrations.reduce((acc, { from, migrate }) => {
    if (detectVersion(acc) === from) {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      const result = migrate?.(acc) || acc;
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      migrated.push({ version: from, document: acc, errors: [] });
      return result;
    }

    return acc;
  }, openapi);

  return migrated;
}
