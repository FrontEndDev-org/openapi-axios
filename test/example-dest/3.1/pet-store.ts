/**
 * 由 pkg-name-for-test@pkg-version-for-test 生成，建议忽略此文件的格式校验
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
import type * as Type from "./pet-store.type.ts";
import {zUpdatePetData,zUpdatePetResponse,zAddPetData,zAddPetResponse,zGetPetByIdPath} from "./pet-store.zod.ts";
import enableMock from "./pet-store.mock.ts";

if (process.env.NODE_ENV !== "production") {
enableMock();
}

type AxiosRequestConfig = Parameters<typeof axios.request>[0];

/**
 * @description Update an existing pet by Id
 * @summary Update an existing pet
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Pet object that needs to be updated in the store
 * @param [config] request config
 * @returns Successful operation
 */
export async function updatePet(data:Type.UpdatePetData,config?:AxiosRequestConfig) {
zUpdatePetData.parse(data);
const resp = await axios<Type.UpdatePetResponse>({
  method: "PUT",
url: "/pet",
data: data,
...config
});
zUpdatePetResponse.parse(resp["data"]);
return resp;
}
/**
 * @description Add a new pet to the store
 * @summary Add a new pet to the store
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Create a new pet in the store
 * @param [config] request config
 * @returns Successful operation
 */
export async function addPet(data:Type.AddPetData,config?:AxiosRequestConfig) {
zAddPetData.parse(data);
const resp = await axios<Type.AddPetResponse>({
  method: "POST",
url: "/pet",
data: data,
...config
});
zAddPetResponse.parse(resp["data"]);
return resp;
}
/**
 * @description Returns a pet when 0 < ID <= 10.  ID > 10 or nonintegers will simulate API error conditions
 * @summary Find pet by ID
 * @param petId ID of pet that needs to be fetched
 * @param [config] request config
 */
export async function getPetById(petId:Type.GetPetByIdPath,config?:AxiosRequestConfig) {
zGetPetByIdPath.parse(petId);
const resp = await axios<unknown>({
  method: "GET",
url: `/pet/${petId}`,
...config
});
return resp;
}