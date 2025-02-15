/**
 * 由 pkg-name-for-test@pkg-version-for-test 生成，参考下述文档链接，忽略此文件的格式校验
 *
 * - [ESLint](https://eslint.org/docs/latest/use/configure/ignore)
 * - [Prettier](https://prettier.io/docs/en/ignore.html)
 * - [Biome](https://biomejs.dev/guides/configure-biome/#ignore-files)
 */

/**
 * @title Swagger Petstore
 * @version 1.0.0
 * @contact <apiteam@swagger.io>
 * @description This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.
 */

import {z as z} from "zod";

export const zOrder = z.object({
"id": z.optional(z.number()),
"petId": z.optional(z.number()),
"quantity": z.optional(z.number()),
"shipDate": z.optional(z.string()),
"status": z.optional(z.union([z.literal("placed"),z.literal("approved"),z.literal("delivered")])),
"complete": z.optional(z.boolean()),
});
export const zCategory = z.object({
"id": z.optional(z.number()),
"name": z.optional(z.string()),
});
export const zUser = z.object({
"id": z.optional(z.number()),
"username": z.optional(z.string()),
"firstName": z.optional(z.string()),
"lastName": z.optional(z.string()),
"email": z.optional(z.string()),
"password": z.optional(z.string()),
"phone": z.optional(z.string()),
"userStatus": z.optional(z.number()),
});
export const zTag = z.object({
"id": z.optional(z.number()),
"name": z.optional(z.string()),
});
export const zPet = z.object({
"id": z.optional(z.number()),
"category": z.optional(zCategory),
"name": z.string(),
"photoUrls": z.array(z.string()),
"tags": z.optional(z.array(zTag)),
"status": z.optional(z.union([z.literal("available"),z.literal("pending"),z.literal("sold")])),
});
export const zApiResponse = z.object({
"code": z.optional(z.number()),
"type": z.optional(z.string()),
"message": z.optional(z.string()),
});
export const zAddPetData = zPet;
export const zUpdatePetData = zPet;
export const zFindPetsByStatusParams = z.array(z.union([z.literal("available"),z.literal("pending"),z.literal("sold")]));
export const zFindPetsByStatusResponse = z.array(zPet);
export const zFindPetsByTagsParams = z.array(z.string());
export const zFindPetsByTagsResponse = z.array(zPet);
export const zGetPetByIdPath = z.number();
export const zGetPetByIdResponse = zPet;
export const zUpdatePetWithFormPath = z.number();
export const zUpdatePetWithFormData = z.object({
"name": z.optional(z.string()),
"status": z.optional(z.string()),
});
export const zDeletePetPath = z.number();
export const zDeletePetHeaders = z.string();
export const zUploadFilePath = z.number();
export const zUploadFileData = z.object({
"additionalMetadata": z.optional(z.string()),
"file": z.optional(z.instanceof(Blob)),
});
export const zUploadFileResponse = zApiResponse;
export const zGetInventoryResponse = z.record(z.string(), z.number());
export const zPlaceOrderData = zOrder;
export const zPlaceOrderResponse = zOrder;
export const zGetOrderByIdPath = z.number();
export const zGetOrderByIdResponse = zOrder;
export const zDeleteOrderPath = z.number();
export const zCreateUserData = zUser;
export const zCreateUsersWithArrayInputData = z.array(zUser);
export const zCreateUsersWithListInputData = z.array(zUser);
export const zLoginUserParams = z.object({
"username": z.string(),
"password": z.string(),
});
export const zLoginUserResponse = z.string();
export const zGetUserByNamePath = z.string();
export const zGetUserByNameResponse = zUser;
export const zDeleteUserPath = z.string();
export const zUpdateUserPath = z.string();
export const zUpdateUserData = zUser;