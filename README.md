# oas-gen-ts

OpenAPI Specification ➡️ TypeScript

# Install

```shell
npm i -D oas-gen-ts
```

# Usage

## CLI

Create oas.config.js or oas.json in the root directory of the project, and refer to [cosmiconfig](https://www.npmjs.com/package/cosmiconfig) for the file name specification.

```ts
// oas.config.mjs
export default defineConfig({
  axiosImport: `import { axios } from '@/util/axios';`,
  list: [
    {
      name: 'pet',
      url: 'https://petstore3.swagger.io/api/v3/openapi.json',
    },
  ],
});
```

```shell
# Generate typescript files based on configuration files
npx oas-gen-ts

# The `src/apis/pet.ts` file will be generated
```

## API

```ts
import { generate } from 'oas-gen-ts';

generate({
  // ...
});
```
