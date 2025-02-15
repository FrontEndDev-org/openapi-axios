import { Printer } from '../../src/printer';

it('1*path + 1*query + 1*header', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/pets/{pet-id}': {
        get: {
          operationId: 'getPet',
          parameters: [
            {
              in: 'path',
              name: 'pet-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'query',
              name: 'category-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'header',
              name: 'x-auth-key',
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            content: {
              '*': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'pet name',
              content: {
                '*': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  const result = printer.print({
    hideImports: true,
    hideHeaders: true,
    hideFooters: true,
    hideInfo: true,
    hideAlert: true,
  });

  expect(result.main.code).toMatchInlineSnapshot(`
    "/**
     * @param petId request path "pet-id"
     * @param data request data
     * @param [xAuthKey] request headers "x-auth-key"
     * @param [categoryId] request params "category-id"
     * @param [config] request config
     * @returns pet name
     */
    export async function getPet(petId:Type.GetPetPath,data:Type.GetPetData,xAuthKey?:Type.GetPetHeaders,categoryId?:Type.GetPetParams,config?:AxiosRequestConfig): Promise<AxiosResponse<Type.GetPetResponse>> {
    return axios({
      method: "GET",
    url: \`/pets/\${petId}\`,
    data: data,
    headers: {"x-auth-key": xAuthKey},
    params: {"category-id": categoryId},
    ...config
    })
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type GetPetPath = string;
    export type GetPetData = string;
    export type GetPetHeaders = string;
    export type GetPetParams = string;
    export type GetPetResponse = string;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zGetPetPath = z.string();
    export const zGetPetData = z.string();
    export const zGetPetHeaders = z.string();
    export const zGetPetParams = z.string();
    export const zGetPetResponse = z.string();"
  `);
});

it('n*path + 1*query + 1*header', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/zoo/{zoo-id}/pets/{pet-id}': {
        get: {
          operationId: 'getPet',
          parameters: [
            {
              in: 'path',
              name: 'pet-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'path',
              name: 'zoo-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'query',
              name: 'category-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'header',
              name: 'x-auth-key',
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            content: {
              '*': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  });

  const result = printer.print({
    hideImports: true,
    hideHeaders: true,
    hideFooters: true,
    hideInfo: true,
    hideAlert: true,
  });

  expect(result.main.code).toMatchInlineSnapshot(`
    "/**
     * @param path request path
     * @param data request data
     * @param [xAuthKey] request headers "x-auth-key"
     * @param [categoryId] request params "category-id"
     * @param [config] request config
     */
    export async function getPet(path:Type.GetPetPath,data:Type.GetPetData,xAuthKey?:Type.GetPetHeaders,categoryId?:Type.GetPetParams,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
    return axios({
      method: "GET",
    url: \`/zoo/\${path["zoo-id"]}/pets/\${path["pet-id"]}\`,
    data: data,
    headers: {"x-auth-key": xAuthKey},
    params: {"category-id": categoryId},
    ...config
    })
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type GetPetPath = {
    "pet-id":string;
    "zoo-id":string;
    };
    export type GetPetData = string;
    export type GetPetHeaders = string;
    export type GetPetParams = string;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zGetPetPath = z.object({
    "pet-id": z.string(),
    "zoo-id": z.string(),
    });
    export const zGetPetData = z.string();
    export const zGetPetHeaders = z.string();
    export const zGetPetParams = z.string();"
  `);
});

it('n*path + n*query + 1*header', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/zoo/{zoo-id}/pets/{pet-id}': {
        get: {
          operationId: 'getPet',
          parameters: [
            {
              in: 'path',
              name: 'pet-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'path',
              name: 'zoo-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'query',
              name: 'category-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'query',
              name: 'kind-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'header',
              name: 'x-auth-key',
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            content: {
              '*': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  });

  const result = printer.print({
    hideImports: true,
    hideHeaders: true,
    hideFooters: true,
    hideInfo: true,
    hideAlert: true,
  });

  expect(result.main.code).toMatchInlineSnapshot(`
    "/**
     * @param path request path
     * @param data request data
     * @param [xAuthKey] request headers "x-auth-key"
     * @param [params] request params
     * @param [config] request config
     */
    export async function getPet(path:Type.GetPetPath,data:Type.GetPetData,xAuthKey?:Type.GetPetHeaders,params?:Type.GetPetParams,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
    return axios({
      method: "GET",
    url: \`/zoo/\${path["zoo-id"]}/pets/\${path["pet-id"]}\`,
    data: data,
    headers: {"x-auth-key": xAuthKey},
    params: params,
    ...config
    })
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type GetPetPath = {
    "pet-id":string;
    "zoo-id":string;
    };
    export type GetPetData = string;
    export type GetPetHeaders = string;
    export type GetPetParams = {
    "category-id"?:string;
    "kind-id"?:string;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zGetPetPath = z.object({
    "pet-id": z.string(),
    "zoo-id": z.string(),
    });
    export const zGetPetData = z.string();
    export const zGetPetHeaders = z.string();
    export const zGetPetParams = z.object({
    "category-id": z.optional(z.string()),
    "kind-id": z.optional(z.string()),
    });"
  `);
});

it('n*path + n*query + n*header', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/zoo/{zoo-id}/pets/{pet-id}': {
        get: {
          operationId: 'getPet',
          parameters: [
            {
              in: 'path',
              name: 'pet-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'path',
              name: 'zoo-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'query',
              name: 'category-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'query',
              name: 'kind-id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'header',
              name: 'x-auth-key',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'header',
              name: 'x-auth-ver',
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            content: {
              '*': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  });

  const result = printer.print({
    hideImports: true,
    hideHeaders: true,
    hideFooters: true,
    hideInfo: true,
    hideAlert: true,
  });

  expect(result.main.code).toMatchInlineSnapshot(`
    "/**
     * @param path request path
     * @param data request data
     * @param [headers] request headers
     * @param [params] request params
     * @param [config] request config
     */
    export async function getPet(path:Type.GetPetPath,data:Type.GetPetData,headers?:Type.GetPetHeaders,params?:Type.GetPetParams,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
    return axios({
      method: "GET",
    url: \`/zoo/\${path["zoo-id"]}/pets/\${path["pet-id"]}\`,
    data: data,
    headers: headers,
    params: params,
    ...config
    })
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type GetPetPath = {
    "pet-id":string;
    "zoo-id":string;
    };
    export type GetPetData = string;
    export type GetPetHeaders = {
    "x-auth-key"?:string;
    "x-auth-ver"?:string;
    };
    export type GetPetParams = {
    "category-id"?:string;
    "kind-id"?:string;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zGetPetPath = z.object({
    "pet-id": z.string(),
    "zoo-id": z.string(),
    });
    export const zGetPetData = z.string();
    export const zGetPetHeaders = z.object({
    "x-auth-key": z.optional(z.string()),
    "x-auth-ver": z.optional(z.string()),
    });
    export const zGetPetParams = z.object({
    "category-id": z.optional(z.string()),
    "kind-id": z.optional(z.string()),
    });"
  `);
});

it('path name unique', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/pets/{type}': {
        get: {
          operationId: 'getPet',
          parameters: [
            {
              in: 'path',
              name: 'type',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
    },
  });

  const result = printer.print({
    hideImports: true,
    hideHeaders: true,
    hideFooters: true,
    hideInfo: true,
    hideAlert: true,
  });

  expect(result.main.code).toMatchInlineSnapshot(`
    "/**
     * @param type request path "type"
     * @param [config] request config
     */
    export async function getPet(type:Type.GetPetPath,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
    return axios({
      method: "GET",
    url: \`/pets/\${type}\`,
    ...config
    })
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`"export type GetPetPath = string;"`);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zGetPetPath = z.string();"`);
});
