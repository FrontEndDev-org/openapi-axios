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

/**
 * @name Order
 */
export type Order = {
/**
 * @format int64
 * @example 10
 */
"id"?:number;
/**
 * @format int64
 * @example 198772
 */
"petId"?:number;
/**
 * @format int32
 * @example 7
 */
"quantity"?:number;
/**
 * @format date-time
 */
"shipDate"?:string;
/**
 * @description Order Status
 * @example approved
 */
"status"?:("placed"|"approved"|"delivered");
"complete"?:boolean;
};
/**
 * @name Customer
 */
export type Customer = {
/**
 * @format int64
 * @example 100000
 */
"id"?:number;
/**
 * @example fehguy
 */
"username"?:string;
"address"?:Array<Address>;
};
/**
 * @name Address
 */
export type Address = {
/**
 * @example 437 Lytton
 */
"street"?:string;
/**
 * @example Palo Alto
 */
"city"?:string;
/**
 * @example CA
 */
"state"?:string;
/**
 * @example 94301
 */
"zip"?:string;
};
/**
 * @name Category
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
 * @name User
 */
export type User = {
/**
 * @format int64
 * @example 10
 */
"id"?:number;
/**
 * @example theUser
 */
"username"?:string;
/**
 * @example John
 */
"firstName"?:string;
/**
 * @example James
 */
"lastName"?:string;
/**
 * @example john@email.com
 */
"email"?:string;
/**
 * @example 12345
 */
"password"?:string;
/**
 * @example 12345
 */
"phone"?:string;
/**
 * @description User Status
 * @format int32
 * @example 1
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
 * @example 10
 */
"id"?:number;
/**
 * @example doggie
 */
"name":string;
"category"?:Category;
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
export type AddPetResponse = Pet;
export type UpdatePetData = Pet;
export type UpdatePetResponse = Pet;
export type FindPetsByStatusParams = ("available"|"pending"|"sold");
export type FindPetsByStatusResponse = Array<Pet>;
export type FindPetsByTagsParams = Array<string>;
export type FindPetsByTagsResponse = Array<Pet>;
export type GetPetByIdPath = number;
export type GetPetByIdResponse = Pet;
export type UpdatePetWithFormPath = number;
export type UpdatePetWithFormParams = {
/**
 * @description Name of pet that needs to be updated
 */
"name"?:string;
/**
 * @description Status of pet that needs to be updated
 */
"status"?:string;
};
export type DeletePetPath = number;
export type DeletePetHeaders = string;
export type UploadFilePath = number;
export type UploadFileData = Blob;
export type UploadFileParams = string;
export type UploadFileResponse = ApiResponse;
export type GetInventoryResponse = Record<string, number>;
export type PlaceOrderData = Order;
export type PlaceOrderResponse = Order;
export type GetOrderByIdPath = number;
export type GetOrderByIdResponse = Order;
export type DeleteOrderPath = number;
export type CreateUserData = User;
export type CreateUsersWithListInputData = Array<User>;
export type CreateUsersWithListInputResponse = User;
export type LoginUserParams = {
/**
 * @description The user name for login
 */
"username"?:string;
/**
 * @description The password for login in clear text
 */
"password"?:string;
};
export type LoginUserResponse = string;
export type GetUserByNamePath = string;
export type GetUserByNameResponse = User;
export type DeleteUserPath = string;
export type UpdateUserPath = string;
export type UpdateUserData = User;