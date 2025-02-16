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
export async function addPet(data:Type.AddPetData,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
zAddPetData.parse(data)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => data,
],
};
return axios({
  method: "POST",
url: `/pet`,
data: data,
...config
})
}
/**
 * @description 
 * @summary Update an existing pet
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Pet object that needs to be added to the store
 * @param [config] request config
 */
export async function updatePet(data:Type.UpdatePetData,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
zUpdatePetData.parse(data)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => data,
],
};
return axios({
  method: "PUT",
url: `/pet`,
data: data,
...config
})
}
/**
 * @description Multiple status values can be provided with comma separated strings
 * @summary Finds Pets by status
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param status Status values that need to be considered for filter
 * @param [config] request config
 * @returns successful operation
 */
export async function findPetsByStatus(status:Type.FindPetsByStatusParams,config?:AxiosRequestConfig): Promise<AxiosResponse<Type.FindPetsByStatusResponse>> {
zFindPetsByStatusParams.parse(status)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => zFindPetsByStatusResponse.parse(data),
],
};
return axios({
  method: "GET",
url: `/pet/findByStatus`,
params: {"status": status},
...config
})
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
export async function findPetsByTags(tags:Type.FindPetsByTagsParams,config?:AxiosRequestConfig): Promise<AxiosResponse<Type.FindPetsByTagsResponse>> {
zFindPetsByTagsParams.parse(tags)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => zFindPetsByTagsResponse.parse(data),
],
};
return axios({
  method: "GET",
url: `/pet/findByTags`,
params: {"tags": tags},
...config
})
}
/**
 * @description Returns a single pet
 * @summary Find pet by ID
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId ID of pet to return
 * @param [config] request config
 * @returns successful operation
 */
export async function getPetById(petId:Type.GetPetByIdPath,config?:AxiosRequestConfig): Promise<AxiosResponse<Type.GetPetByIdResponse>> {
zGetPetByIdPath.parse(petId)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => zGetPetByIdResponse.parse(data),
],
};
return axios({
  method: "GET",
url: `/pet/${petId}`,
...config
})
}
/**
 * @description 
 * @summary Updates a pet in the store with form data
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId ID of pet that needs to be updated
 * @param data request data
 * @param [config] request config
 */
export async function updatePetWithForm(petId:Type.UpdatePetWithFormPath,data:Type.UpdatePetWithFormData,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
zUpdatePetWithFormPath.parse(petId)
zUpdatePetWithFormData.parse(data)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => data,
],
};
return axios({
  method: "POST",
url: `/pet/${petId}`,
data: data,
...config
})
}
/**
 * @description 
 * @summary Deletes a pet
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId Pet id to delete
 * @param [apiKey] request headers "api_key"
 * @param [config] request config
 */
export async function deletePet(petId:Type.DeletePetPath,apiKey?:Type.DeletePetHeaders,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
zDeletePetPath.parse(petId)
zDeletePetHeaders.parse(apiKey)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => data,
],
};
return axios({
  method: "DELETE",
url: `/pet/${petId}`,
headers: {"api_key": apiKey},
...config
})
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
export async function uploadFile(petId:Type.UploadFilePath,data:Type.UploadFileData,config?:AxiosRequestConfig): Promise<AxiosResponse<Type.UploadFileResponse>> {
zUploadFilePath.parse(petId)
zUploadFileData.parse(data)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => zUploadFileResponse.parse(data),
],
};
return axios({
  method: "POST",
url: `/pet/${petId}/uploadImage`,
data: data,
...config
})
}
/**
 * @description Returns a map of status codes to quantities
 * @summary Returns pet inventories by status
 * @see store Access to Petstore orders
 * @param [config] request config
 * @returns successful operation
 */
export async function getInventory(config?:AxiosRequestConfig): Promise<AxiosResponse<Type.GetInventoryResponse>> {
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => zGetInventoryResponse.parse(data),
],
};
return axios({
  method: "GET",
url: `/store/inventory`,
...config
})
}
/**
 * @description 
 * @summary Place an order for a pet
 * @see store Access to Petstore orders
 * @param data order placed for purchasing the pet
 * @param [config] request config
 * @returns successful operation
 */
export async function placeOrder(data:Type.PlaceOrderData,config?:AxiosRequestConfig): Promise<AxiosResponse<Type.PlaceOrderResponse>> {
zPlaceOrderData.parse(data)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => zPlaceOrderResponse.parse(data),
],
};
return axios({
  method: "POST",
url: `/store/order`,
data: data,
...config
})
}
/**
 * @description For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
 * @summary Find purchase order by ID
 * @see store Access to Petstore orders
 * @param orderId ID of pet that needs to be fetched
 * @param [config] request config
 * @returns successful operation
 */
export async function getOrderById(orderId:Type.GetOrderByIdPath,config?:AxiosRequestConfig): Promise<AxiosResponse<Type.GetOrderByIdResponse>> {
zGetOrderByIdPath.parse(orderId)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => zGetOrderByIdResponse.parse(data),
],
};
return axios({
  method: "GET",
url: `/store/order/${orderId}`,
...config
})
}
/**
 * @description For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
 * @summary Delete purchase order by ID
 * @see store Access to Petstore orders
 * @param orderId ID of the order that needs to be deleted
 * @param [config] request config
 */
export async function deleteOrder(orderId:Type.DeleteOrderPath,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
zDeleteOrderPath.parse(orderId)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => data,
],
};
return axios({
  method: "DELETE",
url: `/store/order/${orderId}`,
...config
})
}
/**
 * @description This can only be done by the logged in user.
 * @summary Create user
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param data Created user object
 * @param [config] request config
 */
export async function createUser(data:Type.CreateUserData,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
zCreateUserData.parse(data)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => data,
],
};
return axios({
  method: "POST",
url: `/user`,
data: data,
...config
})
}
/**
 * @description 
 * @summary Creates list of users with given input array
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param data List of user object
 * @param [config] request config
 */
export async function createUsersWithArrayInput(data:Type.CreateUsersWithArrayInputData,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
zCreateUsersWithArrayInputData.parse(data)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => data,
],
};
return axios({
  method: "POST",
url: `/user/createWithArray`,
data: data,
...config
})
}
/**
 * @description 
 * @summary Creates list of users with given input array
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param data List of user object
 * @param [config] request config
 */
export async function createUsersWithListInput(data:Type.CreateUsersWithListInputData,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
zCreateUsersWithListInputData.parse(data)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => data,
],
};
return axios({
  method: "POST",
url: `/user/createWithList`,
data: data,
...config
})
}
/**
 * @description 
 * @summary Logs user into the system
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param params request params
 * @param [config] request config
 * @returns successful operation
 */
export async function loginUser(params:Type.LoginUserParams,config?:AxiosRequestConfig): Promise<AxiosResponse<Type.LoginUserResponse>> {
zLoginUserParams.parse(params)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => zLoginUserResponse.parse(data),
],
};
return axios({
  method: "GET",
url: `/user/login`,
params: params,
...config
})
}
/**
 * @description 
 * @summary Logs out current logged in user session
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param [config] request config
 */
export async function logoutUser(config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => data,
],
};
return axios({
  method: "GET",
url: `/user/logout`,
...config
})
}
/**
 * @description 
 * @summary Get user by user name
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param username The name that needs to be fetched. Use user1 for testing. 
 * @param [config] request config
 * @returns successful operation
 */
export async function getUserByName(username:Type.GetUserByNamePath,config?:AxiosRequestConfig): Promise<AxiosResponse<Type.GetUserByNameResponse>> {
zGetUserByNamePath.parse(username)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => zGetUserByNameResponse.parse(data),
],
};
return axios({
  method: "GET",
url: `/user/${username}`,
...config
})
}
/**
 * @description This can only be done by the logged in user.
 * @summary Delete user
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param username The name that needs to be deleted
 * @param [config] request config
 */
export async function deleteUser(username:Type.DeleteUserPath,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
zDeleteUserPath.parse(username)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => data,
],
};
return axios({
  method: "DELETE",
url: `/user/${username}`,
...config
})
}
/**
 * @description This can only be done by the logged in user.
 * @summary Updated user
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param username name that need to be updated
 * @param data Updated user object
 * @param [config] request config
 */
export async function updateUser(username:Type.UpdateUserPath,data:Type.UpdateUserData,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
zUpdateUserPath.parse(username)
zUpdateUserData.parse(data)
const transformResponse = config?.transformResponse;
config = {
...config,
transformResponse: [
...Array.isArray(transformResponse) ? transformResponse : (transformResponse ? [transformResponse] : []),
data => data,
],
};
return axios({
  method: "PUT",
url: `/user/${username}`,
data: data,
...config
})
}