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

import {z as z} from "zod";

export const zOrder = z.object({
"id": z.optional(z.number()),
"petId": z.optional(z.number()),
"quantity": z.optional(z.number()),
"shipDate": z.optional(z.string()),
"status": z.optional(z.union([z.literal("placed"),z.literal("approved"),z.literal("delivered")])),
"complete": z.optional(z.boolean()),
});
export const zAddress = z.object({
"street": z.optional(z.string()),
"city": z.optional(z.string()),
"state": z.optional(z.string()),
"zip": z.optional(z.string()),
});
export const zCustomer = z.object({
"id": z.optional(z.number()),
"username": z.optional(z.string()),
"address": z.optional(z.array(zAddress)),
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
"name": z.string(),
"category": z.optional(zCategory),
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
export const zAddPetResponse = zPet;
export const zUpdatePetData = zPet;
export const zUpdatePetResponse = zPet;
export const zFindPetsByStatusParams = z.union([z.literal("available"),z.literal("pending"),z.literal("sold")]);
export const zFindPetsByStatusResponse = z.array(zPet);
export const zFindPetsByTagsParams = z.array(z.string());
export const zFindPetsByTagsResponse = z.array(zPet);
export const zGetPetByIdPath = z.number();
export const zGetPetByIdResponse = zPet;
export const zUpdatePetWithFormPath = z.number();
export const zUpdatePetWithFormParams = z.object({
"name": z.optional(z.string()),
"status": z.optional(z.string()),
});
export const zDeletePetPath = z.number();
export const zDeletePetHeaders = z.string();
export const zUploadFilePath = z.number();
export const zUploadFileData = z.instanceof(Blob);
export const zUploadFileParams = z.string();
export const zUploadFileResponse = zApiResponse;
export const zGetInventoryResponse = z.record(z.string(), z.number());
export const zPlaceOrderData = zOrder;
export const zPlaceOrderResponse = zOrder;
export const zGetOrderByIdPath = z.number();
export const zGetOrderByIdResponse = zOrder;
export const zDeleteOrderPath = z.number();
export const zCreateUserData = zUser;
export const zCreateUsersWithListInputData = z.array(zUser);
export const zCreateUsersWithListInputResponse = zUser;
export const zLoginUserParams = z.object({
"username": z.optional(z.string()),
"password": z.optional(z.string()),
});
export const zLoginUserResponse = z.string();
export const zGetUserByNamePath = z.string();
export const zGetUserByNameResponse = zUser;
export const zDeleteUserPath = z.string();
export const zUpdateUserPath = z.string();
export const zUpdateUserData = zUser;