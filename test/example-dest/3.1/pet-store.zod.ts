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

import { z } from "zod";

export const zCategory = z.object({
"id": z.optional(z.number()),
"name": z.optional(z.string()),
});
export const zPetDetails = z.object({
"id": z.optional(z.number()),
"category": z.optional(zCategory),
"tag": z.optional(zTag),
});
export const zPetDetailsPetDetailsId = z.number();
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
"availableInstances": z.optional(z.number()),
"petDetailsId": z.optional(zPetDetailsPetDetailsId),
"petDetails": z.optional(zPetDetails),
});
export const zUpdatePetData = zPet;
export const zUpdatePetResponse = zPet;
export const zAddPetData = zPet;
export const zAddPetResponse = zPet;
export const zGetPetByIdPath = z.number();