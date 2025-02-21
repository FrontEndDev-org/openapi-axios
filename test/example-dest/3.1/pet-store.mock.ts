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

import { generateMock } from "@anatine/zod-mock";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import {faker as faker} from "@faker-js/faker";
import {zUpdatePetResponse,zAddPetResponse} from "./pet-store.zod.ts";

export default function enableMock() {
const mock = new AxiosMockAdapter(axios);
mock.onPut("/pet").reply(() => {
return [200, generateMock(zUpdatePetResponse, {faker: faker})];
});
mock.onPost("/pet").reply(() => {
return [200, generateMock(zAddPetResponse, {faker: faker})];
});
mock.onGet(/^\/pet\/[^/]+$/).reply(() => {
return [200];
});
}