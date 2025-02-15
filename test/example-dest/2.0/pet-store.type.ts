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

/**
 * @name Order
 */
export type Order = {
/**
 * @format int64
 */
"id"?:number;
/**
 * @format int64
 */
"petId"?:number;
/**
 * @format int32
 */
"quantity"?:number;
/**
 * @format date-time
 */
"shipDate"?:string;
/**
 * @description Order Status
 */
"status"?:("placed"|"approved"|"delivered");
"complete"?:boolean;
};
/**
 * @name Category
 */
export type Category = {
/**
 * @format int64
 */
"id"?:number;
"name"?:string;
};
/**
 * @name User
 */
export type User = {
/**
 * @format int64
 */
"id"?:number;
"username"?:string;
"firstName"?:string;
"lastName"?:string;
"email"?:string;
"password"?:string;
"phone"?:string;
/**
 * @description User Status
 * @format int32
 */
"userStatus"?:number;
};
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
/**
 * @name Pet
 */
export type Pet = {
/**
 * @format int64
 */
"id"?:number;
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
};
/**
 * @name ApiResponse
 */
export type ApiResponse = {
/**
 * @format int32
 */
"code"?:number;
"type"?:string;
"message"?:string;
};
export type AddPetData = Pet;
export type UpdatePetData = Pet;
export type FindPetsByStatusParams = Array<("available"|"pending"|"sold")>;
export type FindPetsByStatusResponse = Array<Pet>;
export type FindPetsByTagsParams = Array<string>;
export type FindPetsByTagsResponse = Array<Pet>;
export type GetPetByIdPath = number;
export type GetPetByIdResponse = Pet;
export type UpdatePetWithFormPath = number;
export type UpdatePetWithFormData = {
/**
 * @description Updated name of the pet
 */
"name"?:string;
/**
 * @description Updated status of the pet
 */
"status"?:string;
};
export type DeletePetPath = number;
export type DeletePetHeaders = string;
export type UploadFilePath = number;
export type UploadFileData = {
/**
 * @description Additional data to pass to server
 */
"additionalMetadata"?:string;
/**
 * @description file to upload
 * @format binary
 */
"file"?:Blob;
};
export type UploadFileResponse = ApiResponse;
export type GetInventoryResponse = Record<string, number>;
export type PlaceOrderData = Order;
export type PlaceOrderResponse = Order;
export type GetOrderByIdPath = number;
export type GetOrderByIdResponse = Order;
export type DeleteOrderPath = number;
export type CreateUserData = User;
export type CreateUsersWithArrayInputData = Array<User>;
export type CreateUsersWithListInputData = Array<User>;
export type LoginUserParams = {
/**
 * @description The user name for login
 */
"username":string;
/**
 * @description The password for login in clear text
 */
"password":string;
};
export type LoginUserResponse = string;
export type GetUserByNamePath = string;
export type GetUserByNameResponse = User;
export type DeleteUserPath = string;
export type UpdateUserPath = string;
export type UpdateUserData = User;