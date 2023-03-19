# oas-gen-ts

[![code-review](https://github.com/cloudcome/oas-gen-ts/actions/workflows/code-review.yml/badge.svg)](https://github.com/cloudcome/oas-gen-ts/actions/workflows/code-review.yml)
[![dependency-review](https://github.com/cloudcome/oas-gen-ts/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/cloudcome/oas-gen-ts/actions/workflows/dependency-review.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/e788387e5e27472ba3b5003bf19aeea7)](https://app.codacy.com/gh/cloudcome/oas-gen-ts/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/e788387e5e27472ba3b5003bf19aeea7)](https://app.codacy.com/gh/cloudcome/oas-gen-ts/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
![npm](https://img.shields.io/npm/v/oas-gen-ts)
![release](https://img.shields.io/github/v/release/cloudcome/oas-gen-ts)
![license](https://img.shields.io/github/license/cloudcome/oas-gen-ts)

OpenAPI Specification ➡️ TypeScript

Convert OpenAPI Specification declaration files into type declarations and executable functions. Compared with other similar tools, it has the following characteristics

- Each API is a function for easy tree shaking at build time
- Easily integrate with local request clients, such as Axios instances created in local projects
- Easy to use, easy to learn, type safe

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

Create oas.config.js or oas.json in the root directory of the project. The search order for configuration files is `oas.config.cjs`, `oas.config.js`, `oas.json`.

```js
// oas.config.cjs
const { defineConfig } = require('oas-gen-ts');

module.exports = defineConfig({
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

Then you can directly import a function and use it. Calling an interface is as simple as calling a local function, is it similar to RPC (remote procedure call).

```ts
import { findPetsByStatus } from '@/apis/swagger/pet';

// There are type hints when calling functions and writing parameters, thanks to TypeScript.
const pets = await findPetsByStatus({
  status: ['avaliable'],
});
```

## API

```ts
import { generate } from 'oas-gen-ts';

generate({
  // ...config
});
```

# Config

| Name                 | Type        | Required | Description                                | Default                                         |
| -------------------- | ----------- | -------- | ------------------------------------------ | ----------------------------------------------- |
| `cwd`                | `string`    | `false`  | current working directory                  | `process.cwd()`                                 |
| `dest`               | `string`    | `false`  | Destination directory for generated files  | `src/apis`                                      |
| `axiosImport`        | `string`    | `false`  | axios import string                        | Import from the official and create an instance |
| `unwrapResponseData` | `boolean`   | `false`  | unwrap the data item from the response     | `false`                                         |
| `list`               | `OasItem[]` | `false`  | List of OpenAPI Specification declarations | `[]`                                            |

`OasItem`:

| Name          | Type     | Required | Description                                     | Default                                         |
| ------------- | -------- | -------- | ----------------------------------------------- | ----------------------------------------------- |
| `name`        | `string` | `true`   | filename, which can be a path                   | `process.cwd()`                                 |
| `axiosImport` | `string` | `false`  | axios import string, highest priority           | Import from the official and create an instance |
| `url`         | `string` | `false`  | The remote address of the OpenAPI Specification | `undefined`                                     |
| `spec`        | `Spec`   | `false`  | The local Objects of the OpenAPI Specification  | `undefined`                                     |

**At least one of `url` and `spec` exists**
