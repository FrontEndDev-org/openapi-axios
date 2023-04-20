# openapi-axios

OpenAPI ➡️ Axios

[![code-review](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/code-review.yml/badge.svg)](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/code-review.yml)
[![dependency-review](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/dependency-review.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4fa1acaeb717469caddfe21a84c50bb2)](https://app.codacy.com/gh/FrontEndDev-org/openapi-axios/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/4fa1acaeb717469caddfe21a84c50bb2)](https://app.codacy.com/gh/FrontEndDev-org/openapi-axios/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![npm version](https://badge.fury.io/js/openapi-axios.svg)](https://npmjs.com/package/openapi-axios)

将 OpenAPI 规范声明文件转换为类型声明和可执行函数（基于 Axios）。与其他同类工具相比，具有以下特点：

- 😆 支持 [openAPI](https://www.openapis.org/) v3（当前仅）
- 😉 每个 API 都是一个函数，用于在构建时轻松进行 tree shaking
- 😎 与最流行的 HTTP 客户端 [axios](https://axios-http.com/) 进行适配
- 🤗 轻松与本地请求客户端集成，例如在本地项目中创建的 Axios 实例（通常我们在本地都是需要自定义一些拦截器什么的）
- 😁 易于使用，易于学习，类型安全

# 安装

```shell
npm i -D openapi-axios
yarn add --dev openapi-axios
```

# 使用

## 命令行

在项目根目录下创建配置文件，配置文件的搜索顺序是 `openapi.config.cjs`、`openapi.config.js`。

```js
// openapi.config.cjs
const { defineConfig } = require('openapi-axios');

module.exports = defineConfig({
  openAPIs: [
    {
      // 将会生成 src/apis/swagger/petStore3.ts 文件
      name: 'swagger/petStore3',
      // 可以是一个 URL 链接或者本地路径，或者一个 OPENAPI3 文档对象
      document: 'https://petstore3.swagger.io/api/v3/openapi.json',
    },
  ],
});
```

```shell
# 根据配置文件生成typescript文件
npx openapi-axios

# 将会生成 src/apis/swagger/petStore3.ts 文件
```

<details>
<summary>【点击展开】生成的文件将导出为一个函数和一个操作，如下所示</summary>

```ts
// src/apis/swagger/petStore3.ts

import type { OneOf } from 'openapi-axios/helpers';
import type { AxiosPromise, AxiosRequestConfig } from 'axios';
import {
  DELETE,
  GET,
  HEAD,
  OPTIONS,
  PATCH,
  POST,
  PUT,
  resolveURL,
} from 'openapi-axios/helpers';
import { Axios } from 'axios';
const axios = new Axios();

const request = axios.request;
const BASE_URL = '/api/v3';

// ...

export type Pet = {
  category?: Category;
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /**
   * @example doggie
   */
  name: string;
  photoUrls: Array<string>;
  /**
   * @description pet status in the store
   */
  status?: 'available' | 'pending' | 'sold';
  tags?: Array<Tag>;
};

// ...

export type AddPetReqData = Pet;
export type AddPetResData = Pet;
/**
 * @title Add a new pet to the store
 * @description Add a new pet to the store
 */
export async function addPet(
  data: AddPetReqData,
  config?: AxiosRequestConfig
): AxiosPromise<AddPetResData> {
  return request({
    url: resolveURL(BASE_URL, `/pet`),
    method: POST,
    data,
    ...config,
  });
}

// ...
```
</details>

然后你可以直接导入一个函数并使用它。 调用接口就像调用本地函数一样简单，是不是类似于 RPC（remote procedure call）。

```ts
import { addPet } from '@/apis/swagger/petStore3';

// 类型安全
const { data: pet } = await addPet({
  name: 'MyCat',
  photoUrls: ['photo1', 'photo2']
});

// 类型安全
console.log(pet);
```


# openapi.config

| 参数名           | 类型                 | 可选性     | 描述                         | 默认值                         |
|---------------|--------------------|---------|----------------------------|-----------------------------|
| `cwd`         | `string`           | `false` | 当前工作路径                     | `process.cwd()`             |
| `dest`        | `string`           | `false` | 目标目录                       | `src/apis`                  |
| `parser`      | `ParserOptions`    | `false` | 解析配置                       | `undefined`                 |
| `printer`     | `PrinterOptions`   | `false` | 输出配置                       | `undefined`                 |
| `openAPIs`    | `OpenAPIOptions[]` | `true`  | OpenAPIOptions 列表，至少需要配置一个 | 无                           |

## `ParserOptions` 签名：
| 参数名                    | 类型       | 可选性     | 描述         | 默认值                |
|------------------------|----------|---------|------------|--------------------|
| `cwd`                  | `string` | `false` | 当前工作路径     | `process.cwd()`    |
| `okCode`               | `number` | `false` | ok 的响应码    | `200`              |
| `okMediaType`          | `number` | `false` | ok 的响应类型   | `application/json` |
| `requestPathTypeName`  | `string` | `false` | 请求路径参数类型名称 | `ReqPath`          |
| `requestQueryTypeName` | `string` | `false` | 请求查询参数类型名称 | `ReqParams`        |
| `requestBodyTypeName`  | `string` | `false` | 请求体参数类型名称  | `ReqData`          |
| `responseBodyTypeName` | `string` | `false` | 响应体参数类型名称  | `ResData`          |

## `PrinterOptions` 签名：
| 参数名                   | 类型       | 可选性     | 描述                                  | 默认值                         |
|-----------------------|----------|---------|-------------------------------------|-----------------------------|
| `axiosImport`         | `string` | `false` | axios 导入内容                          | 默认从官方 Axios 导入，可以使用自己实现的客户端 |
| `prettier`            | `object` | `false` | [prettier](https://prettier.io/) 配置 | `{ singleQuote: true }`     |
| `requestPathArgName`  | `string` | `false` | 请求路径参数入参名称                          | `path`                      |
| `requestQueryArgName` | `string` | `false` | 请求查询参数入参名称                          | `params`                    |
| `requestBodyArgName`  | `string` | `false` | 请求体参数入参名称                           | `data`                      |
| `responseTypeName`    | `string` | `false` | 响应类型名称                              | `AxiosPromise`              |

## `OpenAPIOptions` 签名:

| 名称         | 类型                        | 可选 | 描述                                               | 默认值         |
|------------|---------------------------|----|--------------------------------------------------|-------------|
| `name`     | `string`                  | 必须 | openapi 的名称，将会生成 ${name}.ts 文件                   | `undefined` |
| `document` | `string,OpenAPI3Document` | 必须 | openapi 文档，可以是一个 URL 链接或者本地路径，或者一个 OPENAPI3 文档对象 | `undefined` |


