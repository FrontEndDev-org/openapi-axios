# openapi-axios

[![code-review](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/code-review.yml/badge.svg)](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/code-review.yml)
[![dependency-review](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/dependency-review.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4fa1acaeb717469caddfe21a84c50bb2)](https://app.codacy.com/gh/FrontEndDev-org/openapi-axios/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/4fa1acaeb717469caddfe21a84c50bb2)](https://app.codacy.com/gh/FrontEndDev-org/openapi-axios/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
![npm](https://img.shields.io/npm/v/openapi-axios)
![release](https://img.shields.io/github/v/release/FrontEndDev-org/openapi-axios)
![license](https://img.shields.io/github/license/FrontEndDev-org/openapi-axios)

OpenAPI ➡️ Axios

将 OpenAPI 规范声明文件转换为类型声明和可执行函数（基于 Axios）。与其他同类工具相比，具有以下特点：

- 每个 API 都是一个函数，用于在构建时轻松进行 tree shaking
- 轻松与本地请求客户端集成，例如在本地项目中创建的 Axios 实例
- 易于使用，易于学习，类型安全

# 安装

```shell
npm i -D openapi-axios
```

or

```shell
yarn add --dev openapi-axios
```

# 使用

## 命令行

在项目根目录下创建配置文件，配置文件的搜索顺序是 `openapi.config.cjs`、`openapi.config.js`、`openapi.json`。

```js
// openapi.config.cjs
const { defineConfig } = require('openapi-axios');

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
# 根据配置文件生成typescript文件
npx openapi-axios

# 将生成 `src/apis/swagger/pet.ts` 文件
```

生成的文件将导出为一个函数和一个操作，如下所示：

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

然后你可以直接导入一个函数并使用它。 调用接口就像调用本地函数一样简单，是不是类似于 RPC（remote procedure call）。

```ts
import { findPetsByStatus } from '@/apis/swagger/pet';

// 在调用函数和编写参数时，有类型提示，这要感谢 TypeScript
const pets = await findPetsByStatus({
  status: ['avaliable'],
});
```

## API

```ts
import { generate } from 'openapi-axios';

generate({
  // ...config
});
```

# 配置

| 参数名               | 类型            | 可选性  | 描述                                                                              | 默认值                                          |
| -------------------- | --------------- | ------- | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| `cwd`                | `string`        | `false` | 当前工作路径                                                                      | `process.cwd()`                                 |
| `dest`               | `string`        | `false` | 目标目录                                                                          | `src/apis`                                      |
| `axiosImport`        | `string`        | `false` | axios 导入内容                                                                    | 默认从官方 Axios 导入，可以使用自己实现的客户端 |
| `unwrapResponseData` | `boolean`       | `false` | 是否取消对 axios response 的包裹（即直接返回 ResponseData，而不是 AxiosResponse） | `false`                                         |
| `list`               | `OpenApiSpec[]` | `false` | OpenAPI 规范声明列表                                                              | `[]`                                            |

`OpenApiSpec` 签名:

| 名称          | 类型     | 可选项  | 描述                                   | 默认值          |
| ------------- | -------- | ------- | -------------------------------------- | --------------- |
| `name`        | `string` | `true`  | 文件名，可以包含路径，相当于 dest 配置 | `process.cwd()` |
| `axiosImport` | `string` | `false` | axios 导入内容，优先级更高             | 无              |
| `url`         | `string` | `false` | 远程 openApi 描述地址                  | `undefined`     |
| `spec`        | `Spec`   | `false` | 本地 OpenApi 描述文件                  | `undefined`     |

备注：`url` 属性和 `spec` 属性，至少有一个必须。

# 鸣谢

- [swagger-typescript-api](https://www.npmjs.com/package/swagger-typescript-api)
