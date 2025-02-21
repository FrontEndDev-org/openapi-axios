/**
 * 由 pkg-name-for-test@pkg-version-for-test 生成，建议忽略此文件的格式校验
 */

/**
 * @title Swagger Petstore
 * @version 1.0.0
 * @contact <apiteam@swagger.io>
 * @description This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.
 */

import { generateMock } from "@anatine/zod-mock";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import {faker as faker} from "@faker-js/faker";
import {zFindPetsByStatusResponse,zFindPetsByTagsResponse,zGetPetByIdResponse,zUploadFileResponse,zGetInventoryResponse,zPlaceOrderResponse,zGetOrderByIdResponse,zLoginUserResponse,zGetUserByNameResponse} from "./pet-store.zod.ts";

export default function enableMock() {
const mock = new AxiosMockAdapter(axios);
mock.onPost("/pet").reply(() => {
return [200];
});
mock.onPut("/pet").reply(() => {
return [200];
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
mock.onPost("/user/createWithArray").reply(() => {
return [200];
});
mock.onPost("/user/createWithList").reply(() => {
return [200];
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