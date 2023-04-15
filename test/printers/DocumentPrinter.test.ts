import { TypeDocument } from '../../src/parsers/types';
import { DocumentPrinter } from '../../src/printers/DocumentPrinter';

import petStore3 from '../files/petStore3.types.json' assert { type: 'json' };
import { writeFile } from '../helpers';

test('DocumentPrinter', () => {
  const printer = new DocumentPrinter(petStore3 as TypeDocument);
  const text = printer.write();
  writeFile('petStore3.types.txt', text);
  expect(text).toMatchInlineSnapshot(`
    "import type { OneOf } from 'openapi-axios/helpers';
    import type { AxiosPromise, AxiosRequestConfig } from 'axios';
    import {
      DELETE,
      GET,
      HEAD,
      OPTIONS,
      PATCH,
      POST,
      PUT,
      resolveURL,
    } from 'openapi-axios/helpers';
    import { Axios } from 'axios';
    const axios = new Axios();

    const request = axios.request;
    const BASE_URL = '/api/v3';

    export type Address = {
      /**
       * @example Palo Alto
       */
      city?: string;
      /**
       * @example CA
       */
      state?: string;
      /**
       * @example 437 Lytton
       */
      street?: string;
      /**
       * @example 94301
       */
      zip?: string;
    };

    export type ApiResponse = {
      /**
       * @format int32
       */
      code?: number;
      message?: string;
      type?: string;
    };

    export type Category = {
      /**
       * @format int64
       * @example 1
       */
      id?: number;
      /**
       * @example Dogs
       */
      name?: string;
    };

    export type Customer = {
      address?: Array<Address>;
      /**
       * @format int64
       * @example 100000
       */
      id?: number;
      /**
       * @example fehguy
       */
      username?: string;
    };

    export type Order = {
      complete?: boolean;
      /**
       * @format int64
       * @example 10
       */
      id?: number;
      /**
       * @format int64
       * @example 198772
       */
      petId?: number;
      /**
       * @format int32
       * @example 7
       */
      quantity?: number;
      /**
       * @format date-time
       */
      shipDate?: string;
      /**
       * @description Order Status
       * @example approved
       */
      status?: 'placed' | 'approved' | 'delivered';
    };

    export type Pet = {
      category?: Category;
      /**
       * @format int64
       * @example 10
       */
      id?: number;
      /**
       * @example doggie
       */
      name: string;
      photoUrls: Array<string>;
      /**
       * @description pet status in the store
       */
      status?: 'available' | 'pending' | 'sold';
      tags?: Array<Tag>;
    };

    export type Tag = {
      /**
       * @format int64
       */
      id?: number;
      name?: string;
    };

    export type User = {
      /**
       * @example john@email.com
       */
      email?: string;
      /**
       * @example John
       */
      firstName?: string;
      /**
       * @format int64
       * @example 10
       */
      id?: number;
      /**
       * @example James
       */
      lastName?: string;
      /**
       * @example 12345
       */
      password?: string;
      /**
       * @example 12345
       */
      phone?: string;
      /**
       * @example theUser
       */
      username?: string;
      /**
       * @description User Status
       * @format int32
       * @example 1
       */
      userStatus?: number;
    };

    export type AddPetReqData = Pet;
    export type AddPetResData = Pet;
    /**
     * @title Add a new pet to the store
     * @description Add a new pet to the store
     */
    export async function addPet(
      data: AddPetReqData,
      config?: AxiosRequestConfig
    ): AxiosPromise<AddPetResData> {
      return request({
        url: resolveURL(BASE_URL, \`/pet\`),
        method: POST,
        data,
        ...config,
      });
    }

    export type UpdatePetReqData = Pet;
    export type UpdatePetResData = Pet;
    /**
     * @title Update an existing pet
     * @description Update an existing pet by Id
     */
    export async function updatePet(
      data: UpdatePetReqData,
      config?: AxiosRequestConfig
    ): AxiosPromise<UpdatePetResData> {
      return request({
        url: resolveURL(BASE_URL, \`/pet\`),
        method: PUT,
        data,
        ...config,
      });
    }

    export type DeletePetReqPath = {
      /**
       * @description Pet id to delete
       * @format int64
       */
      petId: number;
    };
    /**
     * @title Deletes a pet
     * @description
     */
    export async function deletePet(
      path: DeletePetReqPath,
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: resolveURL(BASE_URL, \`/pet/\${path.petId}\`),
        method: DELETE,
        ...config,
      });
    }

    export type GetPetByIdReqPath = {
      /**
       * @description ID of pet to return
       * @format int64
       */
      petId: number;
    };
    export type GetPetByIdResData = Pet;
    /**
     * @title Find pet by ID
     * @description Returns a single pet
     */
    export async function getPetById(
      path: GetPetByIdReqPath,
      config?: AxiosRequestConfig
    ): AxiosPromise<GetPetByIdResData> {
      return request({
        url: resolveURL(BASE_URL, \`/pet/\${path.petId}\`),
        method: GET,
        ...config,
      });
    }

    export type UpdatePetWithFormReqPath = {
      /**
       * @description ID of pet that needs to be updated
       * @format int64
       */
      petId: number;
    };
    export type UpdatePetWithFormReqParams = {
      /**
       * @description Name of pet that needs to be updated
       */
      name?: string;
      /**
       * @description Status of pet that needs to be updated
       */
      status?: string;
    };
    /**
     * @title Updates a pet in the store with form data
     * @description
     */
    export async function updatePetWithForm(
      path: UpdatePetWithFormReqPath,
      params?: UpdatePetWithFormReqParams,
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: resolveURL(BASE_URL, \`/pet/\${path.petId}\`),
        method: POST,
        params,
        ...config,
      });
    }

    export type UploadFileReqPath = {
      /**
       * @description ID of pet to update
       * @format int64
       */
      petId: number;
    };
    export type UploadFileReqParams = {
      /**
       * @description Additional Metadata
       */
      additionalMetadata?: string;
    };
    export type UploadFileReqData = Blob;
    export type UploadFileResData = ApiResponse;
    /**
     * @title uploads an image
     * @description
     */
    export async function uploadFile(
      path: UploadFileReqPath,
      data: UploadFileReqData,
      params?: UploadFileReqParams,
      config?: AxiosRequestConfig
    ): AxiosPromise<UploadFileResData> {
      return request({
        url: resolveURL(BASE_URL, \`/pet/\${path.petId}/uploadImage\`),
        method: POST,
        params,
        data,
        ...config,
      });
    }

    export type FindPetsByStatusReqParams = {
      /**
       * @description Status values that need to be considered for filter
       * @default available
       */
      status?: 'available' | 'pending' | 'sold';
    };
    export type FindPetsByStatusResData = Array<Pet>;
    /**
     * @title Finds Pets by status
     * @description Multiple status values can be provided with comma separated strings
     */
    export async function findPetsByStatus(
      params?: FindPetsByStatusReqParams,
      config?: AxiosRequestConfig
    ): AxiosPromise<FindPetsByStatusResData> {
      return request({
        url: resolveURL(BASE_URL, \`/pet/findByStatus\`),
        method: GET,
        params,
        ...config,
      });
    }

    export type FindPetsByTagsReqParams = {
      /**
       * @description Tags to filter by
       */
      tags?: Array<string>;
    };
    export type FindPetsByTagsResData = Array<Pet>;
    /**
     * @title Finds Pets by tags
     * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     */
    export async function findPetsByTags(
      params?: FindPetsByTagsReqParams,
      config?: AxiosRequestConfig
    ): AxiosPromise<FindPetsByTagsResData> {
      return request({
        url: resolveURL(BASE_URL, \`/pet/findByTags\`),
        method: GET,
        params,
        ...config,
      });
    }

    export type GetInventoryResData = {
      /**
       * @format int32
       */
      [key: string]: number;
    };
    /**
     * @title Returns pet inventories by status
     * @description Returns a map of status codes to quantities
     */
    export async function getInventory(
      config?: AxiosRequestConfig
    ): AxiosPromise<GetInventoryResData> {
      return request({
        url: resolveURL(BASE_URL, \`/store/inventory\`),
        method: GET,
        ...config,
      });
    }

    export type PlaceOrderReqData = Order;
    export type PlaceOrderResData = Order;
    /**
     * @title Place an order for a pet
     * @description Place a new order in the store
     */
    export async function placeOrder(
      data: PlaceOrderReqData,
      config?: AxiosRequestConfig
    ): AxiosPromise<PlaceOrderResData> {
      return request({
        url: resolveURL(BASE_URL, \`/store/order\`),
        method: POST,
        data,
        ...config,
      });
    }

    export type DeleteOrderReqPath = {
      /**
       * @description ID of the order that needs to be deleted
       * @format int64
       */
      orderId: number;
    };
    /**
     * @title Delete purchase order by ID
     * @description For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors
     */
    export async function deleteOrder(
      path: DeleteOrderReqPath,
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: resolveURL(BASE_URL, \`/store/order/\${path.orderId}\`),
        method: DELETE,
        ...config,
      });
    }

    export type GetOrderByIdReqPath = {
      /**
       * @description ID of order that needs to be fetched
       * @format int64
       */
      orderId: number;
    };
    export type GetOrderByIdResData = Order;
    /**
     * @title Find purchase order by ID
     * @description For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.
     */
    export async function getOrderById(
      path: GetOrderByIdReqPath,
      config?: AxiosRequestConfig
    ): AxiosPromise<GetOrderByIdResData> {
      return request({
        url: resolveURL(BASE_URL, \`/store/order/\${path.orderId}\`),
        method: GET,
        ...config,
      });
    }

    export type CreateUserReqData = User;
    /**
     * @title Create user
     * @description This can only be done by the logged in user.
     */
    export async function createUser(
      data: CreateUserReqData,
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: resolveURL(BASE_URL, \`/user\`),
        method: POST,
        data,
        ...config,
      });
    }

    export type DeleteUserReqPath = {
      /**
       * @description The name that needs to be deleted
       */
      username: string;
    };
    /**
     * @title Delete user
     * @description This can only be done by the logged in user.
     */
    export async function deleteUser(
      path: DeleteUserReqPath,
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: resolveURL(BASE_URL, \`/user/\${path.username}\`),
        method: DELETE,
        ...config,
      });
    }

    export type GetUserByNameReqPath = {
      /**
       * @description The name that needs to be fetched. Use user1 for testing.
       */
      username: string;
    };
    export type GetUserByNameResData = User;
    /**
     * @title Get user by user name
     * @description
     */
    export async function getUserByName(
      path: GetUserByNameReqPath,
      config?: AxiosRequestConfig
    ): AxiosPromise<GetUserByNameResData> {
      return request({
        url: resolveURL(BASE_URL, \`/user/\${path.username}\`),
        method: GET,
        ...config,
      });
    }

    export type UpdateUserReqPath = {
      /**
       * @description name that need to be deleted
       */
      username: string;
    };
    export type UpdateUserReqData = User;
    /**
     * @title Update user
     * @description This can only be done by the logged in user.
     */
    export async function updateUser(
      path: UpdateUserReqPath,
      data: UpdateUserReqData,
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: resolveURL(BASE_URL, \`/user/\${path.username}\`),
        method: PUT,
        data,
        ...config,
      });
    }

    export type CreateUsersWithListInputReqData = Array<User>;
    export type CreateUsersWithListInputResData = User;
    /**
     * @title Creates list of users with given input array
     * @description Creates list of users with given input array
     */
    export async function createUsersWithListInput(
      data?: CreateUsersWithListInputReqData,
      config?: AxiosRequestConfig
    ): AxiosPromise<CreateUsersWithListInputResData> {
      return request({
        url: resolveURL(BASE_URL, \`/user/createWithList\`),
        method: POST,
        data,
        ...config,
      });
    }

    export type LoginUserReqParams = {
      /**
       * @description The user name for login
       */
      username?: string;
      /**
       * @description The password for login in clear text
       */
      password?: string;
    };
    export type LoginUserResData = string;
    /**
     * @title Logs user into the system
     * @description
     */
    export async function loginUser(
      params?: LoginUserReqParams,
      config?: AxiosRequestConfig
    ): AxiosPromise<LoginUserResData> {
      return request({
        url: resolveURL(BASE_URL, \`/user/login\`),
        method: GET,
        params,
        ...config,
      });
    }

    /**
     * @title Logs out current logged in user session
     * @description
     */
    export async function logoutUser(
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: resolveURL(BASE_URL, \`/user/logout\`),
        method: GET,
        ...config,
      });
    }
    "
  `);
});
