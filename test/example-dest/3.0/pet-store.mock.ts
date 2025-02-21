/**
 * 由 pkg-name-for-test@pkg-version-for-test 生成，建议忽略此文件的格式校验
 */

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

import { generateMock } from "@anatine/zod-mock";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import {faker as faker} from "@faker-js/faker";
import {zAddPetResponse,zUpdatePetResponse,zFindPetsByStatusResponse,zFindPetsByTagsResponse,zGetPetByIdResponse,zUploadFileResponse,zGetInventoryResponse,zPlaceOrderResponse,zGetOrderByIdResponse,zCreateUsersWithListInputResponse,zLoginUserResponse,zGetUserByNameResponse} from "./pet-store.zod.ts";

export default function enableMock() {
const mock = new AxiosMockAdapter(axios);
mock.onPost("/pet").reply(() => {
return [200, generateMock(zAddPetResponse, {faker: faker})];
});
mock.onPut("/pet").reply(() => {
return [200, generateMock(zUpdatePetResponse, {faker: faker})];
});
mock.onGet("/pet/findByStatus").reply(() => {
return [200, generateMock(zFindPetsByStatusResponse, {faker: faker})];
});
mock.onGet("/pet/findByTags").reply(() => {
return [200, generateMock(zFindPetsByTagsResponse, {faker: faker})];
});
mock.onGet(/^\/pet\/[^/]+$/).reply(() => {
return [200, generateMock(zGetPetByIdResponse, {faker: faker})];
});
mock.onPost(/^\/pet\/[^/]+$/).reply(() => {
return [200];
});
mock.onDelete(/^\/pet\/[^/]+$/).reply(() => {
return [200];
});
mock.onPost(/^\/pet\/[^/]+\/uploadImage$/).reply(() => {
return [200, generateMock(zUploadFileResponse, {faker: faker})];
});
mock.onGet("/store/inventory").reply(() => {
return [200, generateMock(zGetInventoryResponse, {faker: faker})];
});
mock.onPost("/store/order").reply(() => {
return [200, generateMock(zPlaceOrderResponse, {faker: faker})];
});
mock.onGet(/^\/store\/order\/[^/]+$/).reply(() => {
return [200, generateMock(zGetOrderByIdResponse, {faker: faker})];
});
mock.onDelete(/^\/store\/order\/[^/]+$/).reply(() => {
return [200];
});
mock.onPost("/user").reply(() => {
return [200];
});
mock.onPost("/user/createWithList").reply(() => {
return [200, generateMock(zCreateUsersWithListInputResponse, {faker: faker})];
});
mock.onGet("/user/login").reply(() => {
return [200, generateMock(zLoginUserResponse, {faker: faker})];
});
mock.onGet("/user/logout").reply(() => {
return [200];
});
mock.onGet(/^\/user\/[^/]+$/).reply(() => {
return [200, generateMock(zGetUserByNameResponse, {faker: faker})];
});
mock.onDelete(/^\/user\/[^/]+$/).reply(() => {
return [200];
});
mock.onPut(/^\/user\/[^/]+$/).reply(() => {
return [200];
});
}