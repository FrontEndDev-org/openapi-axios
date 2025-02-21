import { Printer } from '../../src/printer';

it('1路径 + 1请求', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc': {
        get: {},
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param [config] request config
     */
    export async function getApiAbc(config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: "/api/abc",
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`""`);
  expect(result.zod.code).toMatchInlineSnapshot(`""`);
});

it('1路径 + 1请求 * module', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc': {
        get: {},
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param [config] request config
     */
    export async function getApiAbc(config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: "/api/abc",
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`""`);
  expect(result.zod.code).toMatchInlineSnapshot(`""`);
});

it('1路径 + 2请求', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc': {
        get: {},
        post: {},
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param [config] request config
     */
    export async function getApiAbc(config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: "/api/abc",
    ...config
    });
    return resp;
    }
    /**
     * @param [config] request config
     */
    export async function postApiAbc(config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "POST",
    url: "/api/abc",
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`""`);
  expect(result.zod.code).toMatchInlineSnapshot(`""`);
});

it('1路径 + 1请求 + 1query', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc': {
        get: {
          parameters: [
            {
              name: 'var',
              in: 'query',
              description: 'description 1',
              schema: {
                description: 'description 2',
                type: 'number',
              },
            },
          ],
          responses: {
            200: {
              description: 'success',
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param [var_2] description 1
     * @param [config] request config
     */
    export async function getApiAbc(var_2?:Type.GetApiAbcParams,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: "/api/abc",
    params: {"var": var_2},
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`"export type GetApiAbcParams = number;"`);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zGetApiAbcParams = z.number();"`);
});

it('1路径 + 1请求 + 1query with duplicate', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc': {
        get: {
          parameters: [
            {
              name: 'config',
              in: 'query',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'success',
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param [config_2] request params "config"
     * @param [config] request config
     */
    export async function getApiAbc(config_2?:Type.GetApiAbcParams,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: "/api/abc",
    params: {"config": config_2},
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`"export type GetApiAbcParams = string;"`);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zGetApiAbcParams = z.string();"`);
});

it('1路径 + 1请求 + 1path', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc/{var}': {
        get: {
          parameters: [
            {
              name: 'var',
              required: true,
              in: 'path',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'success',
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param var_2 request path "var"
     * @param [config] request config
     */
    export async function getApiAbc(var_2:Type.GetApiAbcPath,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: \`/api/abc/\${var_2}\`,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`"export type GetApiAbcPath = string;"`);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zGetApiAbcPath = z.string();"`);
});

it('1路径 + 1请求 + 2path', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc/{var}/def/{xyz}': {
        get: {
          parameters: [
            {
              name: 'var',
              required: true,
              in: 'path',
              schema: {
                type: 'string',
              },
            },
            {
              name: 'xyz',
              in: 'path',
              schema: {
                type: 'integer',
              },
            },
          ],
          responses: {
            200: {
              description: 'success',
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param path request path
     * @param [config] request config
     */
    export async function getApiAbcDef(path:Type.GetApiAbcDefPath,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: \`/api/abc/\${path["var"]}/def/\${path["xyz"]}\`,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type GetApiAbcDefPath = {
    "var":string;
    /**
     * @format integer
     */
    "xyz":number;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zGetApiAbcDefPath = z.object({
    "var": z.string(),
    "xyz": z.number(),
    });"
  `);
});

it('1路径 + 1请求 + 2query', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc': {
        get: {
          parameters: [
            {
              name: 'a',
              in: 'query',
              description: 'description 1',
              schema: {
                description: 'description 2',
                type: 'string',
              },
            },
            {
              name: 'b',
              in: 'query',
              required: true,
              schema: {
                description: 'description 3',
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'success',
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param params request params
     * @param [config] request config
     */
    export async function getApiAbc(params:Type.GetApiAbcParams,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: "/api/abc",
    params: params,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type GetApiAbcParams = {
    /**
     * @description description 1
     */
    "a"?:string;
    /**
     * @description description 3
     */
    "b":string;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zGetApiAbcParams = z.object({
    "a": z.optional(z.string()),
    "b": z.string(),
    });"
  `);
});

it('1路径 + 1请求 + 2query + 1path', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc/{params}': {
        get: {
          parameters: [
            {
              name: 'a',
              in: 'query',
              required: true,
              description: 'test--',
              deprecated: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'b',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
            {
              name: 'params',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
          ],
          responses: {
            200: {
              description: 'success',
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param params request params
     * @param [config] request config
     */
    export async function getApiAbc(params:Type.GetApiAbcPath,params_2:Type.GetApiAbcParams,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: \`/api/abc/\${params}\`,
    params: params_2,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type GetApiAbcPath = string;
    export type GetApiAbcParams = {
    /**
     * @description test--
     * @deprecated
     */
    "a":string;
    /**
     * @description xxx
     */
    "b":string;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zGetApiAbcPath = z.string();
    export const zGetApiAbcParams = z.object({
    "a": z.string(),
    "b": z.string(),
    });"
  `);
});

it('1路径 + 1请求 + 2query + 1path + 1request primitive', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc/{c}': {
        get: {
          parameters: [
            {
              name: 'a',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'b',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
            {
              name: 'c',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                  description: 'aaa',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'success',
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param c xxx
     * @param params request params
     * @param data aaa
     * @param [config] request config
     */
    export async function getApiAbc(c:Type.GetApiAbcPath,params:Type.GetApiAbcParams,data:Type.GetApiAbcData,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: \`/api/abc/\${c}\`,
    params: params,
    data: data,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type GetApiAbcPath = string;
    export type GetApiAbcParams = {
    "a":string;
    /**
     * @description xxx
     */
    "b":string;
    };
    export type GetApiAbcData = string;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zGetApiAbcPath = z.string();
    export const zGetApiAbcParams = z.object({
    "a": z.string(),
    "b": z.string(),
    });
    export const zGetApiAbcData = z.string();"
  `);
});

it('1路径 + 1请求 + 2query + 1path + 1request object', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc/{c}': {
        get: {
          parameters: [
            {
              name: 'a',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'b',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
            {
              name: 'c',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
          ],
          requestBody: {
            description: 'request--data--description',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      required: true,
                      description: 'yyy',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'success',
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param c xxx
     * @param params request params
     * @param data request--data--description
     * @param [config] request config
     */
    export async function getApiAbc(c:Type.GetApiAbcPath,params:Type.GetApiAbcParams,data:Type.GetApiAbcData,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: \`/api/abc/\${c}\`,
    params: params,
    data: data,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type GetApiAbcPath = string;
    export type GetApiAbcParams = {
    "a":string;
    /**
     * @description xxx
     */
    "b":string;
    };
    export type GetApiAbcData = {
    /**
     * @description yyy
     */
    "name":string;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zGetApiAbcPath = z.string();
    export const zGetApiAbcParams = z.object({
    "a": z.string(),
    "b": z.string(),
    });
    export const zGetApiAbcData = z.object({
    "name": z.string(),
    });"
  `);
});

it('1路径 + 1请求 + 2query + 1path + 1request object + 1response primitive', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc/{c}': {
        get: {
          parameters: [
            {
              name: 'a',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'b',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
            {
              name: 'c',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      required: true,
                      description: 'yyy',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'success',
              content: {
                'application/json': {
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param c xxx
     * @param params request params
     * @param data request data
     * @param [config] request config
     * @returns success
     */
    export async function getApiAbc(c:Type.GetApiAbcPath,params:Type.GetApiAbcParams,data:Type.GetApiAbcData,config?:AxiosRequestConfig) {
    const resp = await axios<Type.GetApiAbcResponse>({
      method: "GET",
    url: \`/api/abc/\${c}\`,
    params: params,
    data: data,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type GetApiAbcPath = string;
    export type GetApiAbcParams = {
    "a":string;
    /**
     * @description xxx
     */
    "b":string;
    };
    export type GetApiAbcData = {
    /**
     * @description yyy
     */
    "name":string;
    };
    export type GetApiAbcResponse = string;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zGetApiAbcPath = z.string();
    export const zGetApiAbcParams = z.object({
    "a": z.string(),
    "b": z.string(),
    });
    export const zGetApiAbcData = z.object({
    "name": z.string(),
    });
    export const zGetApiAbcResponse = z.string();"
  `);
});

it('1路径 + 1请求 + 2query + 1path + 1request object + 1response object', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc/{data}/def': {
        get: {
          parameters: [
            {
              name: 'config',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'path',
              in: 'query',
              schema: {
                type: 'string',
                required: true,
                description: 'xxx',
              },
            },
            {
              name: 'data',
              in: 'path',
              schema: {
                type: 'string',
                required: true,
                description: 'xxx',
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      required: true,
                      description: 'yyy',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'resp---123',
                    properties: {
                      code: {
                        type: 'number',
                        description: 'aaaa',
                      },
                      data: {
                        type: 'object',
                        description: 'bbbb',
                        properties: {
                          name: {
                            type: 'string',
                            description: 'cccc',
                          },
                        },
                      },
                    },
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];

    /**
     * @param data xxx
     * @param params request params
     * @param data_2 request data
     * @param [config] request config
     * @returns success
     */
    export async function getApiAbcDef(data:Type.GetApiAbcDefPath,params:Type.GetApiAbcDefParams,data_2:Type.GetApiAbcDefData,config?:AxiosRequestConfig) {
    const resp = await axios<Type.GetApiAbcDefResponse>({
      method: "GET",
    url: \`/api/abc/\${data}/def\`,
    params: params,
    data: data_2,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type GetApiAbcDefPath = string;
    export type GetApiAbcDefParams = {
    "config":string;
    /**
     * @description xxx
     */
    "path":string;
    };
    export type GetApiAbcDefData = {
    /**
     * @description yyy
     */
    "name":string;
    };
    export type GetApiAbcDefResponse = {
    /**
     * @description aaaa
     */
    "code"?:number;
    /**
     * @description bbbb
     */
    "data"?:{
    /**
     * @description cccc
     */
    "name"?:string;
    };
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zGetApiAbcDefPath = z.string();
    export const zGetApiAbcDefParams = z.object({
    "config": z.string(),
    "path": z.string(),
    });
    export const zGetApiAbcDefData = z.object({
    "name": z.string(),
    });
    export const zGetApiAbcDefResponse = z.object({
    "code": z.optional(z.number()),
    "data": z.optional(z.object({
    "name": z.optional(z.string()),
    })),
    });"
  `);
});
