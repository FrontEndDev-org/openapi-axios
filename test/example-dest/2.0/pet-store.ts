/**
 * 由 pkg-name-for-test@pkg-version-for-test 生成，建议忽略此文件的格式校验
 */

/**
 * @title Swagger Petstore
 * @version 1.0.0
 * @contact <apiteam@swagger.io>
 * @description This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.
 */

import axios from "axios";
import {type AxiosRequestConfig as AxiosRequestConfig} from "axios";
import {type AxiosResponse as AxiosResponse} from "axios";
import type * as Type from "./pet-store.type.ts";
import {zAddPetData,zUpdatePetData,zFindPetsByStatusParams,zFindPetsByStatusResponse,zFindPetsByTagsParams,zFindPetsByTagsResponse,zGetPetByIdPath,zGetPetByIdResponse,zUpdatePetWithFormPath,zUpdatePetWithFormData,zDeletePetPath,zDeletePetHeaders,zUploadFilePath,zUploadFileData,zUploadFileResponse,zGetInventoryResponse,zPlaceOrderData,zPlaceOrderResponse,zGetOrderByIdPath,zGetOrderByIdResponse,zDeleteOrderPath,zCreateUserData,zCreateUsersWithArrayInputData,zCreateUsersWithListInputData,zLoginUserParams,zLoginUserResponse,zGetUserByNamePath,zGetUserByNameResponse,zDeleteUserPath,zUpdateUserPath,zUpdateUserData} from "./pet-store.zod.ts";

/**
 * @description 
 * @summary Add a new pet to the store
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Pet object that needs to be added to the store
 * @param [config] request config
 */
export async function addPet(data:Type.AddPetData,config?:AxiosRequestConfig) {
zAddPetData.parse(data)
const resp = await axios<AxiosResponse<unknown>>({
  method: "POST",
url: `/pet`,
data: data,
...config
});
return resp;
}
/**
 * @description 
 * @summary Update an existing pet
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Pet object that needs to be added to the store
 * @param [config] request config
 */
export async function updatePet(data:Type.UpdatePetData,config?:AxiosRequestConfig) {
zUpdatePetData.parse(data)
const resp = await axios<AxiosResponse<unknown>>({
  method: "PUT",
url: `/pet`,
data: data,
...config
});
return resp;
}
/**
 * @description Multiple status values can be provided with comma separated strings
 * @summary Finds Pets by status
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param status Status values that need to be considered for filter
 * @param [config] request config
 * @returns successful operation
 */
export async function findPetsByStatus(status:Type.FindPetsByStatusParams,config?:AxiosRequestConfig) {
zFindPetsByStatusParams.parse(status)
const resp = await axios<AxiosResponse<Type.FindPetsByStatusResponse>>({
  method: "GET",
url: `/pet/findByStatus`,
params: {"status": status},
...config
});
zFindPetsByStatusResponse.parse(resp["data"]);
return resp;
}
/**
 * @deprecated
 * @description Muliple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
 * @summary Finds Pets by tags
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param tags Tags to filter by
 * @param [config] request config
 * @returns successful operation
 */
export async function findPetsByTags(tags:Type.FindPetsByTagsParams,config?:AxiosRequestConfig) {
zFindPetsByTagsParams.parse(tags)
const resp = await axios<AxiosResponse<Type.FindPetsByTagsResponse>>({
  method: "GET",
url: `/pet/findByTags`,
params: {"tags": tags},
...config
});
zFindPetsByTagsResponse.parse(resp["data"]);
return resp;
}
/**
 * @description Returns a single pet
 * @summary Find pet by ID
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId ID of pet to return
 * @param [config] request config
 * @returns successful operation
 */
export async function getPetById(petId:Type.GetPetByIdPath,config?:AxiosRequestConfig) {
zGetPetByIdPath.parse(petId)
const resp = await axios<AxiosResponse<Type.GetPetByIdResponse>>({
  method: "GET",
url: `/pet/${petId}`,
...config
});
zGetPetByIdResponse.parse(resp["data"]);
return resp;
}
/**
 * @description 
 * @summary Updates a pet in the store with form data
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId ID of pet that needs to be updated
 * @param data request data
 * @param [config] request config
 */
export async function updatePetWithForm(petId:Type.UpdatePetWithFormPath,data:Type.UpdatePetWithFormData,config?:AxiosRequestConfig) {
zUpdatePetWithFormPath.parse(petId)
zUpdatePetWithFormData.parse(data)
const resp = await axios<AxiosResponse<unknown>>({
  method: "POST",
url: `/pet/${petId}`,
data: data,
...config
});
return resp;
}
/**
 * @description 
 * @summary Deletes a pet
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId Pet id to delete
 * @param [apiKey] request headers "api_key"
 * @param [config] request config
 */
export async function deletePet(petId:Type.DeletePetPath,apiKey?:Type.DeletePetHeaders,config?:AxiosRequestConfig) {
zDeletePetPath.parse(petId)
zDeletePetHeaders.parse(apiKey)
const resp = await axios<AxiosResponse<unknown>>({
  method: "DELETE",
url: `/pet/${petId}`,
headers: {"api_key": apiKey},
...config
});
return resp;
}
/**
 * @description 
 * @summary uploads an image
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId ID of pet to update
 * @param data request data
 * @param [config] request config
 * @returns successful operation
 */
export async function uploadFile(petId:Type.UploadFilePath,data:Type.UploadFileData,config?:AxiosRequestConfig) {
zUploadFilePath.parse(petId)
zUploadFileData.parse(data)
const resp = await axios<AxiosResponse<Type.UploadFileResponse>>({
  method: "POST",
url: `/pet/${petId}/uploadImage`,
data: data,
...config
});
zUploadFileResponse.parse(resp["data"]);
return resp;
}
/**
 * @description Returns a map of status codes to quantities
 * @summary Returns pet inventories by status
 * @see store Access to Petstore orders
 * @param [config] request config
 * @returns successful operation
 */
export async function getInventory(config?:AxiosRequestConfig) {
const resp = await axios<AxiosResponse<Type.GetInventoryResponse>>({
  method: "GET",
url: `/store/inventory`,
...config
});
zGetInventoryResponse.parse(resp["data"]);
return resp;
}
/**
 * @description 
 * @summary Place an order for a pet
 * @see store Access to Petstore orders
 * @param data order placed for purchasing the pet
 * @param [config] request config
 * @returns successful operation
 */
export async function placeOrder(data:Type.PlaceOrderData,config?:AxiosRequestConfig) {
zPlaceOrderData.parse(data)
const resp = await axios<AxiosResponse<Type.PlaceOrderResponse>>({
  method: "POST",
url: `/store/order`,
data: data,
...config
});
zPlaceOrderResponse.parse(resp["data"]);
return resp;
}
/**
 * @description For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
 * @summary Find purchase order by ID
 * @see store Access to Petstore orders
 * @param orderId ID of pet that needs to be fetched
 * @param [config] request config
 * @returns successful operation
 */
export async function getOrderById(orderId:Type.GetOrderByIdPath,config?:AxiosRequestConfig) {
zGetOrderByIdPath.parse(orderId)
const resp = await axios<AxiosResponse<Type.GetOrderByIdResponse>>({
  method: "GET",
url: `/store/order/${orderId}`,
...config
});
zGetOrderByIdResponse.parse(resp["data"]);
return resp;
}
/**
 * @description For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
 * @summary Delete purchase order by ID
 * @see store Access to Petstore orders
 * @param orderId ID of the order that needs to be deleted
 * @param [config] request config
 */
export async function deleteOrder(orderId:Type.DeleteOrderPath,config?:AxiosRequestConfig) {
zDeleteOrderPath.parse(orderId)
const resp = await axios<AxiosResponse<unknown>>({
  method: "DELETE",
url: `/store/order/${orderId}`,
...config
});
return resp;
}
/**
 * @description This can only be done by the logged in user.
 * @summary Create user
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param data Created user object
 * @param [config] request config
 */
export async function createUser(data:Type.CreateUserData,config?:AxiosRequestConfig) {
zCreateUserData.parse(data)
const resp = await axios<AxiosResponse<unknown>>({
  method: "POST",
url: `/user`,
data: data,
...config
});
return resp;
}
/**
 * @description 
 * @summary Creates list of users with given input array
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param data List of user object
 * @param [config] request config
 */
export async function createUsersWithArrayInput(data:Type.CreateUsersWithArrayInputData,config?:AxiosRequestConfig) {
zCreateUsersWithArrayInputData.parse(data)
const resp = await axios<AxiosResponse<unknown>>({
  method: "POST",
url: `/user/createWithArray`,
data: data,
...config
});
return resp;
}
/**
 * @description 
 * @summary Creates list of users with given input array
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param data List of user object
 * @param [config] request config
 */
export async function createUsersWithListInput(data:Type.CreateUsersWithListInputData,config?:AxiosRequestConfig) {
zCreateUsersWithListInputData.parse(data)
const resp = await axios<AxiosResponse<unknown>>({
  method: "POST",
url: `/user/createWithList`,
data: data,
...config
});
return resp;
}
/**
 * @description 
 * @summary Logs user into the system
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param params request params
 * @param [config] request config
 * @returns successful operation
 */
export async function loginUser(params:Type.LoginUserParams,config?:AxiosRequestConfig) {
zLoginUserParams.parse(params)
const resp = await axios<AxiosResponse<Type.LoginUserResponse>>({
  method: "GET",
url: `/user/login`,
params: params,
...config
});
zLoginUserResponse.parse(resp["data"]);
return resp;
}
/**
 * @description 
 * @summary Logs out current logged in user session
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param [config] request config
 */
export async function logoutUser(config?:AxiosRequestConfig) {
const resp = await axios<AxiosResponse<unknown>>({
  method: "GET",
url: `/user/logout`,
...config
});
return resp;
}
/**
 * @description 
 * @summary Get user by user name
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param username The name that needs to be fetched. Use user1 for testing. 
 * @param [config] request config
 * @returns successful operation
 */
export async function getUserByName(username:Type.GetUserByNamePath,config?:AxiosRequestConfig) {
zGetUserByNamePath.parse(username)
const resp = await axios<AxiosResponse<Type.GetUserByNameResponse>>({
  method: "GET",
url: `/user/${username}`,
...config
});
zGetUserByNameResponse.parse(resp["data"]);
return resp;
}
/**
 * @description This can only be done by the logged in user.
 * @summary Delete user
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param username The name that needs to be deleted
 * @param [config] request config
 */
export async function deleteUser(username:Type.DeleteUserPath,config?:AxiosRequestConfig) {
zDeleteUserPath.parse(username)
const resp = await axios<AxiosResponse<unknown>>({
  method: "DELETE",
url: `/user/${username}`,
...config
});
return resp;
}
/**
 * @description This can only be done by the logged in user.
 * @summary Updated user
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param username name that need to be updated
 * @param data Updated user object
 * @param [config] request config
 */
export async function updateUser(username:Type.UpdateUserPath,data:Type.UpdateUserData,config?:AxiosRequestConfig) {
zUpdateUserPath.parse(username)
zUpdateUserData.parse(data)
const resp = await axios<AxiosResponse<unknown>>({
  method: "PUT",
url: `/user/${username}`,
data: data,
...config
});
return resp;
}