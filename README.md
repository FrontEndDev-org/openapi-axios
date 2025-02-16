# openapi-axios

OpenAPI(2.0/3.0/3.1) Schema → Type-safe Axios

[![code-review](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/code-review.yml/badge.svg)](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/code-review.yml)
[![dependency-review](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/dependency-review.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4fa1acaeb717469caddfe21a84c50bb2)](https://app.codacy.com/gh/FrontEndDev-org/openapi-axios/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/4fa1acaeb717469caddfe21a84c50bb2)](https://app.codacy.com/gh/FrontEndDev-org/openapi-axios/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![npm version](https://badge.fury.io/js/openapi-axios.svg)](https://npmjs.com/package/openapi-axios)

将 OpenAPI 规范声明文件转换为类型安全的基于 Axios 的函数。

- 😆 同时支持 [openAPI](https://www.openapis.org/) 2.0、3.0、3.1 规范
- 😎 与最流行的 HTTP 客户端 [axios](https://axios-http.com/) 进行适配，可轻松与本地 Axios 实例集成
- 😉 生成的每个 API 都是一个类型安全的函数，用于在构建时轻松进行 tree shaking
- 🤔 基于 [zod](https://zod.dev/) 支持了接口出入参的校验（可选）
- 😋 支持生成原 Schema 文件以及中间处理的 Schema 文件（可选）
- 🤗 支持接口 Mock（待完成）

# 安装

```shell
npm i -D openapi-axios@latest
npm i axios
```

# 使用

## 创建配置文件
```shell
npx openapi-axios init
```
将在项目根目录下创建配置文件 openapi.config.cjs：
```js
const { defineConfig } = require('openapi-axios');

/**
 * openapi-axios config
 * @ref https://github.com/FrontEndDev-org/openapi-axios
 */
module.exports = defineConfig({
  documents: {
    petStore3: 'https://petstore3.swagger.io/api/v3/openapi.json'
  },
});
```

## 生成 OpenAPI 相关文件
```shell
# 根据配置文件生成typescript文件
npx openapi-axios

# 将会生成 src/apis/petStore3.ts 文件
# 将会生成 src/apis/petStore3.type.ts 文件
```

<details>
<summary>src/apis/petStore3.ts【点击展开】</summary>

```ts
/**
 * @title Swagger Petstore - OpenAPI 3.0
 * @version 1.0.19
 * @contact <apiteam@swagger.io>
 * @description This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more about
 * Swagger at [http://swagger.io](http://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!
 * You can now help us improve the API whether it's by making changes to the definition itself or to the code.
 * That way, with time, we can improve the API in general, and expose some of the new features in OAS3.
 *
 * Some useful links:
 * - [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)
 * - [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)
 */

import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type * as Type from './pet-store.type.ts';
import axios from 'axios';

/**
 * @description Add a new pet to the store
 * @summary Add a new pet to the store
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Create a new pet in the store
 * @param [config] request config
 * @returns Successful operation
 */
export async function addPet(data: Type.AddPetData, config?: AxiosRequestConfig): Promise<AxiosResponse<Type.AddPetResponse>> {
  return axios({
    method: 'POST',
    url: `/pet`,
    data,
    ...config
  });
}

// ... 省略 ...
```
</details>

<details>
<summary>src/apis/petStore3.type.ts【点击展开】</summary>

```ts
/**
 * @title Swagger Petstore - OpenAPI 3.0
 * @version 1.0.19
 * @contact <apiteam@swagger.io>
 * @description This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more about
 * Swagger at [http://swagger.io](http://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!
 * You can now help us improve the API whether it's by making changes to the definition itself or to the code.
 * That way, with time, we can improve the API in general, and expose some of the new features in OAS3.
 *
 * Some useful links:
 * - [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)
 * - [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)
 */

// ... 省略 ...

export interface Pet {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /**
   * @example doggie
   */
  name: string;
  category?: Category;
  photoUrls: Array<string>;
  tags?: Array<Tag>;
  /**
   * @description pet status in the store
   */
  status?: ('available' | 'pending' | 'sold');
}

// ... 省略 ...

export type AddPetData = Pet;
export type AddPetResponse = Pet;

// ... 省略 ...
```
</details>

然后你可以直接导入一个函数来使用它：

```ts
import { addPet } from '@/apis/.petStore3';

// 类型安全
const { data: pet } = await addPet({
  name: 'MyCat',
});

// 类型安全
console.log(pet);
```
