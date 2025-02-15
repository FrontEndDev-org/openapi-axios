/**
 * 由 pkg-name-for-test@pkg-version-for-test 生成，参考下述文档链接，忽略此文件的格式校验
 *
 * - [ESLint](https://eslint.org/docs/latest/use/configure/ignore)
 * - [Prettier](https://prettier.io/docs/en/ignore.html)
 * - [Biome](https://biomejs.dev/guides/configure-biome/#ignore-files)
 */

/**
 * @title Swagger Petstore - OpenAPI 3.1
 * @version 1.0.7
 * @contact <apiteam@swagger.io>
 * @description This is a sample Pet Store Server based on the OpenAPI 3.1 specification.
 * You can find out more about
 * Swagger at [http://swagger.io](http://swagger.io).
 * @summary Pet Store 3.1
 * @see {@link http://swagger.io Find out more about Swagger}
 */

import axios from "axios";
import {type AxiosRequestConfig as AxiosRequestConfig} from "axios";
import {type AxiosResponse as AxiosResponse} from "axios";
import type * as Type from "./pet-store.type.ts";
import {zUpdatePetData,zUpdatePetResponse,zAddPetData,zAddPetResponse,zGetPetByIdPath} from "./pet-store.zod.ts";

/**
 * @description Update an existing pet by Id
 * @summary Update an existing pet
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Pet object that needs to be updated in the store
 * @param [config] request config
 * @returns Successful operation
 */
export async function updatePet(data:Type.UpdatePetData,config?:AxiosRequestConfig): Promise<AxiosResponse<Type.UpdatePetResponse>> {
zUpdatePetData.parse(data)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => zUpdatePetResponse.parse(data),
],
};
return axios({
  method: "PUT",
url: `/pet`,
data: data,
...config
})
}
/**
 * @description Add a new pet to the store
 * @summary Add a new pet to the store
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Create a new pet in the store
 * @param [config] request config
 * @returns Successful operation
 */
export async function addPet(data:Type.AddPetData,config?:AxiosRequestConfig): Promise<AxiosResponse<Type.AddPetResponse>> {
zAddPetData.parse(data)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => zAddPetResponse.parse(data),
],
};
return axios({
  method: "POST",
url: `/pet`,
data: data,
...config
})
}
/**
 * @description Returns a pet when 0 < ID <= 10.  ID > 10 or nonintegers will simulate API error conditions
 * @summary Find pet by ID
 * @param petId ID of pet that needs to be fetched
 * @param [config] request config
 */
export async function getPetById(petId:Type.GetPetByIdPath,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
zGetPetByIdPath.parse(petId)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => data,
],
};
return axios({
  method: "GET",
url: `/pet/${petId}`,
...config
})
}