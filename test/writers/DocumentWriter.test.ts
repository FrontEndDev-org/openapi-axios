import { DocumentWriter } from '../../src/writers/DocumentWriter';

test('DocumentWriter', () => {
  const writer = new DocumentWriter({
    info: {
      title: 'Swagger Petstore - OpenAPI 3.0',
      description:
        "This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more about\nSwagger at [http://swagger.io](http://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!\nYou can now help us improve the API whether it's by making changes to the definition itself or to the code.\nThat way, with time, we can improve the API in general, and expose some of the new features in OAS3.\n\nSome useful links:\n- [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)\n- [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)",
      termsOfService: 'http://swagger.io/terms/',
      contact: { email: 'apiteam@swagger.io' },
      license: { name: 'Apache 2.0', url: 'http://www.apache.org/licenses/LICENSE-2.0.html' },
      version: '1.0.17',
    },
    components: [
      {
        name: 'Address',
        required: false,
        kind: 'origin',
        type: 'object',
        children: [
          {
            example: 'Palo Alto',
            name: 'city',
            type: 'string',
            required: false,
            kind: 'origin',
          },
          {
            example: 'CA',
            name: 'state',
            type: 'string',
            required: false,
            kind: 'origin',
          },
          {
            example: '437 Lytton',
            name: 'street',
            type: 'string',
            required: false,
            kind: 'origin',
          },
          {
            example: '94301',
            name: 'zip',
            type: 'string',
            required: false,
            kind: 'origin',
          },
        ],
      },
      {
        name: 'ApiResponse',
        required: false,
        kind: 'origin',
        type: 'object',
        children: [
          {
            format: 'int32',
            name: 'code',
            type: 'number',
            required: false,
            kind: 'origin',
          },
          {
            name: 'message',
            type: 'string',
            required: false,
            kind: 'origin',
          },
          {
            name: 'type',
            type: 'string',
            required: false,
            kind: 'origin',
          },
        ],
      },
      {
        name: 'Category',
        required: false,
        kind: 'origin',
        type: 'object',
        children: [
          {
            example: 1,
            format: 'int64',
            name: 'id',
            type: 'number',
            required: false,
            kind: 'origin',
          },
          {
            example: 'Dogs',
            name: 'name',
            type: 'string',
            required: false,
            kind: 'origin',
          },
        ],
      },
      {
        name: 'Customer',
        required: false,
        kind: 'origin',
        type: 'object',
        children: [
          {
            name: 'address',
            required: false,
            kind: 'origin',
            type: 'array',
            children: [
              {
                kind: 'alias',
                root: false,
                name: 'address[]',
                ref: '#/components/schemas/Address',
                target: 'Address',
                origin: 'Address',
                props: [],
              },
            ],
          },
          {
            example: 100000,
            format: 'int64',
            name: 'id',
            type: 'number',
            required: false,
            kind: 'origin',
          },
          {
            example: 'fehguy',
            name: 'username',
            type: 'string',
            required: false,
            kind: 'origin',
          },
        ],
      },
      {
        name: 'Order',
        required: false,
        kind: 'origin',
        type: 'object',
        children: [
          {
            name: 'complete',
            type: 'boolean',
            required: false,
            kind: 'origin',
          },
          {
            example: 10,
            format: 'int64',
            name: 'id',
            type: 'number',
            required: false,
            kind: 'origin',
          },
          {
            example: 198772,
            format: 'int64',
            name: 'petId',
            type: 'number',
            required: false,
            kind: 'origin',
          },
          {
            example: 7,
            format: 'int32',
            name: 'quantity',
            type: 'number',
            required: false,
            kind: 'origin',
          },
          {
            format: 'date-time',
            name: 'shipDate',
            type: 'string',
            required: false,
            kind: 'origin',
          },
          {
            description: 'Order Status',
            example: 'approved',
            enum: ['placed', 'approved', 'delivered'],
            name: 'status',
            type: 'string',
            required: false,
            kind: 'origin',
          },
        ],
      },
      {
        name: 'Pet',
        required: false,
        kind: 'origin',
        type: 'object',
        children: [
          {
            kind: 'alias',
            root: false,
            name: 'category',
            ref: '#/components/schemas/Category',
            target: 'Category',
            origin: 'Category',
            props: [],
          },
          {
            example: 10,
            format: 'int64',
            name: 'id',
            type: 'number',
            required: false,
            kind: 'origin',
          },
          {
            example: 'doggie',
            name: 'name',
            type: 'string',
            required: true,
            kind: 'origin',
          },
          {
            name: 'photoUrls',
            required: true,
            kind: 'origin',
            type: 'array',
            children: [
              {
                name: 'photoUrls[]',
                type: 'string',
                required: false,
                kind: 'origin',
              },
            ],
          },
          {
            description: 'pet status in the store',
            enum: ['available', 'pending', 'sold'],
            name: 'status',
            type: 'string',
            required: false,
            kind: 'origin',
          },
          {
            name: 'tags',
            required: false,
            kind: 'origin',
            type: 'array',
            children: [
              {
                kind: 'alias',
                root: false,
                name: 'tags[]',
                ref: '#/components/schemas/Tag',
                target: 'Tag',
                origin: 'Tag',
                props: [],
              },
            ],
          },
        ],
      },
      {
        name: 'Tag',
        required: false,
        kind: 'origin',
        type: 'object',
        children: [
          {
            format: 'int64',
            name: 'id',
            type: 'number',
            required: false,
            kind: 'origin',
          },
          {
            name: 'name',
            type: 'string',
            required: false,
            kind: 'origin',
          },
        ],
      },
      {
        name: 'User',
        required: false,
        kind: 'origin',
        type: 'object',
        children: [
          {
            example: 'john@email.com',
            name: 'email',
            type: 'string',
            required: false,
            kind: 'origin',
          },
          {
            example: 'John',
            name: 'firstName',
            type: 'string',
            required: false,
            kind: 'origin',
          },
          {
            example: 10,
            format: 'int64',
            name: 'id',
            type: 'number',
            required: false,
            kind: 'origin',
          },
          {
            example: 'James',
            name: 'lastName',
            type: 'string',
            required: false,
            kind: 'origin',
          },
          {
            example: '12345',
            name: 'password',
            type: 'string',
            required: false,
            kind: 'origin',
          },
          {
            example: '12345',
            name: 'phone',
            type: 'string',
            required: false,
            kind: 'origin',
          },
          {
            example: 'theUser',
            name: 'username',
            type: 'string',
            required: false,
            kind: 'origin',
          },
          {
            description: 'User Status',
            example: 1,
            format: 'int32',
            name: 'userStatus',
            type: 'number',
            required: false,
            kind: 'origin',
          },
        ],
      },
    ],
    paths: [
      {
        name: 'addPet',
        method: 'post',
        url: '/pet',
        title: 'Add a new pet to the store',
        description: 'Add a new pet to the store',
        request: {
          body: {
            kind: 'alias',
            root: false,
            name: 'AddPetReqData',
            ref: '#/components/schemas/Pet',
            target: 'Pet',
            origin: 'Pet',
            props: [],
          },
        },
        response: {
          body: {
            kind: 'alias',
            root: false,
            name: 'AddPetResData',
            ref: '#/components/schemas/Pet',
            target: 'Pet',
            origin: 'Pet',
            props: [],
          },
        },
      },
      {
        name: 'updatePet',
        method: 'put',
        url: '/pet',
        title: 'Update an existing pet',
        description: 'Update an existing pet by Id',
        request: {
          body: {
            kind: 'alias',
            root: false,
            name: 'UpdatePetReqData',
            ref: '#/components/schemas/Pet',
            target: 'Pet',
            origin: 'Pet',
            props: [],
          },
        },
        response: {
          body: {
            kind: 'alias',
            root: false,
            name: 'UpdatePetResData',
            ref: '#/components/schemas/Pet',
            target: 'Pet',
            origin: 'Pet',
            props: [],
          },
        },
      },
      {
        name: 'deletePet',
        method: 'delete',
        url: '/pet/{petId}',
        title: 'Deletes a pet',
        description: '',
        request: {
          path: {
            kind: 'origin',
            name: 'DeletePetReqPath',
            type: 'object',
            required: true,
            children: [
              {
                format: 'int64',
                name: 'petId',
                type: 'number',
                required: true,
                kind: 'origin',
              },
            ],
          },
          query: {
            kind: 'origin',
            name: 'DeletePetReqParams',
            type: 'object',
            required: true,
            children: [
              {
                name: 'api_key',
                type: 'string',
                required: false,
                kind: 'origin',
              },
            ],
          },
        },
        response: {},
      },
      {
        name: 'getPetById',
        method: 'get',
        url: '/pet/{petId}',
        title: 'Find pet by ID',
        description: 'Returns a single pet',
        request: {
          path: {
            kind: 'origin',
            name: 'GetPetByIdReqPath',
            type: 'object',
            required: true,
            children: [
              {
                format: 'int64',
                name: 'petId',
                type: 'number',
                required: true,
                kind: 'origin',
              },
            ],
          },
        },
        response: {
          body: {
            kind: 'alias',
            root: false,
            name: 'GetPetByIdResData',
            ref: '#/components/schemas/Pet',
            target: 'Pet',
            origin: 'Pet',
            props: [],
          },
        },
      },
      {
        name: 'updatePetWithForm',
        method: 'post',
        url: '/pet/{petId}',
        title: 'Updates a pet in the store with form data',
        description: '',
        request: {
          path: {
            kind: 'origin',
            name: 'UpdatePetWithFormReqPath',
            type: 'object',
            required: true,
            children: [
              {
                format: 'int64',
                name: 'petId',
                type: 'number',
                required: true,
                kind: 'origin',
              },
            ],
          },
          query: {
            kind: 'origin',
            name: 'UpdatePetWithFormReqParams',
            type: 'object',
            required: true,
            children: [
              {
                name: 'name',
                type: 'string',
                required: false,
                kind: 'origin',
              },
              {
                name: 'status',
                type: 'string',
                required: false,
                kind: 'origin',
              },
            ],
          },
        },
        response: {},
      },
      {
        name: 'uploadFile',
        method: 'post',
        url: '/pet/{petId}/uploadImage',
        title: 'uploads an image',
        description: '',
        request: {
          path: {
            kind: 'origin',
            name: 'UploadFileReqPath',
            type: 'object',
            required: true,
            children: [
              {
                format: 'int64',
                name: 'petId',
                type: 'number',
                required: true,
                kind: 'origin',
              },
            ],
          },
          query: {
            kind: 'origin',
            name: 'UploadFileReqParams',
            type: 'object',
            required: true,
            children: [
              {
                name: 'additionalMetadata',
                type: 'string',
                required: false,
                kind: 'origin',
              },
            ],
          },
        },
        response: {
          body: {
            kind: 'alias',
            root: false,
            name: 'UploadFileResData',
            ref: '#/components/schemas/ApiResponse',
            target: 'ApiResponse',
            origin: 'ApiResponse',
            props: [],
          },
        },
      },
      {
        name: 'findPetsByStatus',
        method: 'get',
        url: '/pet/findByStatus',
        title: 'Finds Pets by status',
        description: 'Multiple status values can be provided with comma separated strings',
        request: {
          query: {
            kind: 'origin',
            name: 'FindPetsByStatusReqParams',
            type: 'object',
            required: true,
            children: [
              {
                default: 'available',
                enum: ['available', 'pending', 'sold'],
                name: 'status',
                type: 'string',
                required: false,
                kind: 'origin',
              },
            ],
          },
        },
        response: {
          body: {
            name: 'FindPetsByStatusResData',
            required: false,
            kind: 'origin',
            type: 'array',
            children: [
              {
                kind: 'alias',
                root: false,
                name: 'FindPetsByStatusResData[]',
                ref: '#/components/schemas/Pet',
                target: 'Pet',
                origin: 'Pet',
                props: [],
              },
            ],
          },
        },
      },
      {
        name: 'findPetsByTags',
        method: 'get',
        url: '/pet/findByTags',
        title: 'Finds Pets by tags',
        description: 'Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.',
        request: {
          query: {
            kind: 'origin',
            name: 'FindPetsByTagsReqParams',
            type: 'object',
            required: true,
            children: [
              {
                name: 'tags',
                required: false,
                kind: 'origin',
                type: 'array',
                children: [
                  {
                    name: 'tags[]',
                    type: 'string',
                    required: false,
                    kind: 'origin',
                  },
                ],
              },
            ],
          },
        },
        response: {
          body: {
            name: 'FindPetsByTagsResData',
            required: false,
            kind: 'origin',
            type: 'array',
            children: [
              {
                kind: 'alias',
                root: false,
                name: 'FindPetsByTagsResData[]',
                ref: '#/components/schemas/Pet',
                target: 'Pet',
                origin: 'Pet',
                props: [],
              },
            ],
          },
        },
      },
      {
        name: 'getInventory',
        method: 'get',
        url: '/store/inventory',
        title: 'Returns pet inventories by status',
        description: 'Returns a map of status codes to quantities',
        request: {},
        response: {
          body: {
            name: 'GetInventoryResData',
            required: false,
            kind: 'origin',
            type: 'object',
            children: [],
          },
        },
      },
      {
        name: 'placeOrder',
        method: 'post',
        url: '/store/order',
        title: 'Place an order for a pet',
        description: 'Place a new order in the store',
        request: {
          body: {
            kind: 'alias',
            root: false,
            name: 'PlaceOrderReqData',
            ref: '#/components/schemas/Order',
            target: 'Order',
            origin: 'Order',
            props: [],
          },
        },
        response: {
          body: {
            kind: 'alias',
            root: false,
            name: 'PlaceOrderResData',
            ref: '#/components/schemas/Order',
            target: 'Order',
            origin: 'Order',
            props: [],
          },
        },
      },
      {
        name: 'deleteOrder',
        method: 'delete',
        url: '/store/order/{orderId}',
        title: 'Delete purchase order by ID',
        description:
          'For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors',
        request: {
          path: {
            kind: 'origin',
            name: 'DeleteOrderReqPath',
            type: 'object',
            required: true,
            children: [
              {
                format: 'int64',
                name: 'orderId',
                type: 'number',
                required: true,
                kind: 'origin',
              },
            ],
          },
        },
        response: {},
      },
      {
        name: 'getOrderById',
        method: 'get',
        url: '/store/order/{orderId}',
        title: 'Find purchase order by ID',
        description:
          'For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.',
        request: {
          path: {
            kind: 'origin',
            name: 'GetOrderByIdReqPath',
            type: 'object',
            required: true,
            children: [
              {
                format: 'int64',
                name: 'orderId',
                type: 'number',
                required: true,
                kind: 'origin',
              },
            ],
          },
        },
        response: {
          body: {
            kind: 'alias',
            root: false,
            name: 'GetOrderByIdResData',
            ref: '#/components/schemas/Order',
            target: 'Order',
            origin: 'Order',
            props: [],
          },
        },
      },
      {
        name: 'createUser',
        method: 'post',
        url: '/user',
        title: 'Create user',
        description: 'This can only be done by the logged in user.',
        request: {
          body: {
            kind: 'alias',
            root: false,
            name: 'CreateUserReqData',
            ref: '#/components/schemas/User',
            target: 'User',
            origin: 'User',
            props: [],
          },
        },
        response: {},
      },
      {
        name: 'deleteUser',
        method: 'delete',
        url: '/user/{username}',
        title: 'Delete user',
        description: 'This can only be done by the logged in user.',
        request: {
          path: {
            kind: 'origin',
            name: 'DeleteUserReqPath',
            type: 'object',
            required: true,
            children: [
              {
                name: 'username',
                type: 'string',
                required: true,
                kind: 'origin',
              },
            ],
          },
        },
        response: {},
      },
      {
        name: 'getUserByName',
        method: 'get',
        url: '/user/{username}',
        title: 'Get user by user name',
        description: '',
        request: {
          path: {
            kind: 'origin',
            name: 'GetUserByNameReqPath',
            type: 'object',
            required: true,
            children: [
              {
                name: 'username',
                type: 'string',
                required: true,
                kind: 'origin',
              },
            ],
          },
        },
        response: {
          body: {
            kind: 'alias',
            root: false,
            name: 'GetUserByNameResData',
            ref: '#/components/schemas/User',
            target: 'User',
            origin: 'User',
            props: [],
          },
        },
      },
      {
        name: 'updateUser',
        method: 'put',
        url: '/user/{username}',
        title: 'Update user',
        description: 'This can only be done by the logged in user.',
        request: {
          path: {
            kind: 'origin',
            name: 'UpdateUserReqPath',
            type: 'object',
            required: true,
            children: [
              {
                name: 'username',
                type: 'string',
                required: true,
                kind: 'origin',
              },
            ],
          },
          body: {
            kind: 'alias',
            root: false,
            name: 'UpdateUserReqData',
            ref: '#/components/schemas/User',
            target: 'User',
            origin: 'User',
            props: [],
          },
        },
        response: {},
      },
      {
        name: 'createUsersWithListInput',
        method: 'post',
        url: '/user/createWithList',
        title: 'Creates list of users with given input array',
        description: 'Creates list of users with given input array',
        request: {
          body: {
            name: 'CreateUsersWithListInputReqData',
            required: false,
            kind: 'origin',
            type: 'array',
            children: [
              {
                kind: 'alias',
                root: false,
                name: 'CreateUsersWithListInputReqData[]',
                ref: '#/components/schemas/User',
                target: 'User',
                origin: 'User',
                props: [],
              },
            ],
          },
        },
        response: {
          body: {
            kind: 'alias',
            root: false,
            name: 'CreateUsersWithListInputResData',
            ref: '#/components/schemas/User',
            target: 'User',
            origin: 'User',
            props: [],
          },
        },
      },
      {
        name: 'loginUser',
        method: 'get',
        url: '/user/login',
        title: 'Logs user into the system',
        description: '',
        request: {
          query: {
            kind: 'origin',
            name: 'LoginUserReqParams',
            type: 'object',
            required: true,
            children: [
              {
                name: 'username',
                type: 'string',
                required: false,
                kind: 'origin',
              },
              {
                name: 'password',
                type: 'string',
                required: false,
                kind: 'origin',
              },
            ],
          },
        },
        response: {
          body: {
            name: 'LoginUserResData',
            type: 'string',
            required: false,
            kind: 'origin',
          },
        },
      },
      {
        name: 'logoutUser',
        method: 'get',
        url: '/user/logout',
        title: 'Logs out current logged in user session',
        description: '',
        request: {},
        response: {},
      },
    ],
  });
  const text = writer.write();
  // console.log(text);
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
    } from 'openapi-axios/helpers';
    import { Axios } from 'axios';
    const axios = new Axios();

    const request = axios.request;
    const BASE_URL = '';

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
      name?: string;
      photoUrls?: Array<string>;
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
        url: \`/pet\`,
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
        url: \`/pet\`,
        method: PUT,
        data,
        ...config,
      });
    }

    export type DeletePetReqPath = {
      /**
       * @format int64
       */
      petId: number;
    };
    export type DeletePetReqParams = { api_key: string };
    /**
     * @title Deletes a pet
     * @description
     */
    export async function deletePet(
      path: DeletePetReqPath,
      params: DeletePetReqParams,
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: \`/pet/\${path.petId}\`,
        method: DELETE,
        params,
        ...config,
      });
    }

    export type GetPetByIdReqPath = {
      /**
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
        url: \`/pet/\${path.petId}\`,
        method: GET,
        ...config,
      });
    }

    export type UpdatePetWithFormReqPath = {
      /**
       * @format int64
       */
      petId: number;
    };
    export type UpdatePetWithFormReqParams = { name: string; status: string };
    /**
     * @title Updates a pet in the store with form data
     * @description
     */
    export async function updatePetWithForm(
      path: UpdatePetWithFormReqPath,
      params: UpdatePetWithFormReqParams,
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: \`/pet/\${path.petId}\`,
        method: POST,
        params,
        ...config,
      });
    }

    export type UploadFileReqPath = {
      /**
       * @format int64
       */
      petId: number;
    };
    export type UploadFileReqParams = { additionalMetadata: string };
    export type UploadFileResData = ApiResponse;
    /**
     * @title uploads an image
     * @description
     */
    export async function uploadFile(
      path: UploadFileReqPath,
      params: UploadFileReqParams,
      config?: AxiosRequestConfig
    ): AxiosPromise<UploadFileResData> {
      return request({
        url: \`/pet/\${path.petId}/uploadImage\`,
        method: POST,
        params,
        ...config,
      });
    }

    export type FindPetsByStatusReqParams = {
      /**
       * @default available
       */
      status: 'available' | 'pending' | 'sold';
    };
    export type FindPetsByStatusResData = Array<Pet>;
    /**
     * @title Finds Pets by status
     * @description Multiple status values can be provided with comma separated strings
     */
    export async function findPetsByStatus(
      params: FindPetsByStatusReqParams,
      config?: AxiosRequestConfig
    ): AxiosPromise<FindPetsByStatusResData> {
      return request({
        url: \`/pet/findByStatus\`,
        method: GET,
        params,
        ...config,
      });
    }

    export type FindPetsByTagsReqParams = { tags: Array<string> };
    export type FindPetsByTagsResData = Array<Pet>;
    /**
     * @title Finds Pets by tags
     * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     */
    export async function findPetsByTags(
      params: FindPetsByTagsReqParams,
      config?: AxiosRequestConfig
    ): AxiosPromise<FindPetsByTagsResData> {
      return request({
        url: \`/pet/findByTags\`,
        method: GET,
        params,
        ...config,
      });
    }

    export type GetInventoryResData = {};
    /**
     * @title Returns pet inventories by status
     * @description Returns a map of status codes to quantities
     */
    export async function getInventory(
      config?: AxiosRequestConfig
    ): AxiosPromise<GetInventoryResData> {
      return request({
        url: \`/store/inventory\`,
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
        url: \`/store/order\`,
        method: POST,
        data,
        ...config,
      });
    }

    export type DeleteOrderReqPath = {
      /**
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
        url: \`/store/order/\${path.orderId}\`,
        method: DELETE,
        ...config,
      });
    }

    export type GetOrderByIdReqPath = {
      /**
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
        url: \`/store/order/\${path.orderId}\`,
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
        url: \`/user\`,
        method: POST,
        data,
        ...config,
      });
    }

    export type DeleteUserReqPath = { username: string };
    /**
     * @title Delete user
     * @description This can only be done by the logged in user.
     */
    export async function deleteUser(
      path: DeleteUserReqPath,
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: \`/user/\${path.username}\`,
        method: DELETE,
        ...config,
      });
    }

    export type GetUserByNameReqPath = { username: string };
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
        url: \`/user/\${path.username}\`,
        method: GET,
        ...config,
      });
    }

    export type UpdateUserReqPath = { username: string };
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
        url: \`/user/\${path.username}\`,
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
      data: CreateUsersWithListInputReqData,
      config?: AxiosRequestConfig
    ): AxiosPromise<CreateUsersWithListInputResData> {
      return request({
        url: \`/user/createWithList\`,
        method: POST,
        data,
        ...config,
      });
    }

    export type LoginUserReqParams = { username: string; password: string };
    export type LoginUserResData = string;
    /**
     * @title Logs user into the system
     * @description
     */
    export async function loginUser(
      params: LoginUserReqParams,
      config?: AxiosRequestConfig
    ): AxiosPromise<LoginUserResData> {
      return request({
        url: \`/user/login\`,
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
        url: \`/user/logout\`,
        method: GET,
        ...config,
      });
    }
    "
  `);
});
