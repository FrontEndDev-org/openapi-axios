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

/**
 * @name Category
 * @description Category
 */
export type Category = {
/**
 * @format int64
 * @example 1
 */
"id"?:number;
/**
 * @example Dogs
 */
"name"?:string;
};
/**
 * @name Pet
 * @description Pet
 */
export type Pet = {
/**
 * @format int64
 * @example 10
 */
"id"?:number;
/**
 * @description Pet Category
 */
"category"?:Category;
/**
 * @example doggie
 */
"name":string;
"photoUrls":Array<string>;
"tags"?:Array<Tag>;
/**
 * @description pet status in the store
 */
"status"?:("available"|"pending"|"sold");
/**
 * @format int32
 * @example 7
 */
"availableInstances"?:number;
"petDetailsId"?:PetDetailsPetDetailsId;
"petDetails"?:PetDetails;
};
/**
 * @name PetDetails
 */
export type PetDetails = {
/**
 * @format int64
 * @example 10
 */
"id"?:number;
/**
 * @description PetDetails Category
 */
"category"?:Category;
"tag"?:Tag;
};
/**
 * @name #/components/schemas/PetDetails#pet_details_id
 * @format int64
 * @example 10
 */
export type PetDetailsPetDetailsId = number;
/**
 * @name Tag
 */
export type Tag = {
/**
 * @format int64
 */
"id"?:number;
"name"?:string;
};
export type UpdatePetData = Pet;
export type UpdatePetResponse = Pet;
export type AddPetData = Pet;
export type AddPetResponse = Pet;
export type GetPetByIdPath = number;