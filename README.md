# oas-gen-ts

OpenAPI Specification ➡️ TypeScript

# Install

```shell
npm i -D oas-gen-ts
```

or

```shell
yarn add --dev oas-gen-ts
```

# Usage

## CLI

Create oas.config.js or oas.json in the root directory of the project, and refer to [cosmiconfig](https://www.npmjs.com/package/cosmiconfig) for the file name specification.

The search order for configuration files is `oas.config.cjs`, `oas.config.js`, `oas.json`.

```javascript
const { defineConfig } = require('oas-gen-ts');
// oas.config.cjs
module.exports = defineConfig({
  axiosImport: `import { axios } from '@/util/axios';`,
  list: [
    {
      name: 'swagger/pet',
      url: 'https://petstore3.swagger.io/api/v3/openapi.json',
    },
  ],
});
```

```shell
# Generate typescript files based on configuration files
npx oas-gen-ts

# The `src/apis/swagger/pet.ts` file will be generated
```

The generated file will be exported as one function and one operation, like this:

```ts
// src/apis/swagger/pet.ts

import { axios } from '@/util/axios';

// ...

export interface Pet {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /** @example "doggie" */
  name: string;
  category?: Category;
  photoUrls: string[];
  tags?: Tag[];
  /** pet status in the store */
  status?: 'available' | 'pending' | 'sold';
}

// ...

/**
 * @summary Finds Pets by status
 * @description Multiple status values can be provided with comma separated strings
 * @tags pet
 * @request GET:/pet/findByStatus
 * @secure
 */
export async function findPetsByStatus(
  query?: {
    /**
     * Status values that need to be considered for filter
     * @default "available"
     */
    status?: 'available' | 'pending' | 'sold';
  },
  axiosRequestConfig?: AxiosRequestConfig
): AxiosReturn<Pet[]> {
  return axios.request({
    url: `${BASE_URL}/pet/findByStatus`,
    method: MethodType.GET,
    params: query,
    headers: formatHeaders(ContentKind.OTHER),
    responseType: ResponseType.Json,
    ...axiosRequestConfig,
  });
}

// ...
```

## API

```ts
import { generate } from 'oas-gen-ts';

generate({
  // ...
});
```

# Config

| Name                 | Type      | Required | Description                                | Default                                         |
| -------------------- | --------- | -------- | ------------------------------------------ | ----------------------------------------------- |
| `cwd`                | `string`  | `false`  | current working directory                  | `process.cwd()`                                 |
| `dest`               | `string`  | `false`  | Destination directory for generated files  | `src/apis`                                      |
| `axiosImport`        | `string`  | `false`  | axios import string                        | Import from the official and create an instance |
| `unwrapResponseData` | `boolean` | `false`  | unwrap the data item from the response     | `false`                                         |
| `list`               | `OAS[]`   | `false`  | List of OpenAPI Specification declarations | `[]`                                            |

`Oas`:

| Name          | Type     | Required | Description                                     | Default                                         |
| ------------- | -------- | -------- | ----------------------------------------------- | ----------------------------------------------- |
| `name`        | `string` | `true`   | filename, which can be a path                   | `process.cwd()`                                 |
| `axiosImport` | `string` | `false`  | axios import string, highest priority           | Import from the official and create an instance |
| `url`         | `string` | `false`  | The remote address of the OpenAPI Specification | `undefined`                                     |
| `spec`        | `Spec`   | `false`  | The local Objects of the OpenAPI Specification  | `undefined`                                     |

**At least one of `url` and `spec` exists**
