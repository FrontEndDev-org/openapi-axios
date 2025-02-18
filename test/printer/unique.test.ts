import { Printer } from '../../src/printer';

it('unique vars', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/test': {
        get: {
          responses: {
            200: {
              description: 'success',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Test_aa_',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Test_aa_: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
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
     * @param [config] request config
     * @returns success
     */
    export async function getTest(config?:AxiosRequestConfig) {
    const resp = await axios<Type.GetTestResponse>({
      method: "GET",
    url: \`/test\`,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name Test_aa_
     */
    export type TestAa = {
    "name"?:string;
    };
    export type GetTestResponse = TestAa;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zTestAa = z.object({
    "name": z.optional(z.string()),
    });
    export const zGetTestResponse = zTestAa;"
  `);
});

it('unique types', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/test/{axios}': {
        get: {
          parameters: [
            {
              name: 'axios',
              in: 'path',
              schema: {
                type: 'string',
              },
            },
            {
              name: 'UnknownObject',
              in: 'query',
              schema: {
                $ref: '#/components/schemas/UnknownObject',
              },
            },
          ],
          responses: {
            200: {
              description: 'success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      AxiosResponse: {
                        $ref: '#/components/schemas/AxiosResponse',
                      },
                      UnknownObject: {
                        $ref: '#/components/schemas/UnknownObject',
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
    components: {
      schemas: {
        AxiosResponse: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
        UnknownObject: {
          type: 'object',
          properties: {
            name: {
              type: 'number',
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
     * @param axios_2 request path "axios"
     * @param [unknownObject] request params "UnknownObject"
     * @param [config] request config
     * @returns success
     */
    export async function getTest(axios_2:Type.GetTestPath,unknownObject?:Type.GetTestParams,config?:AxiosRequestConfig) {
    const resp = await axios<Type.GetTestResponse>({
      method: "GET",
    url: \`/test/\${axios_2}\`,
    params: {"UnknownObject": unknownObject},
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name AxiosResponse
     */
    export type AxiosResponse = {
    "name"?:string;
    };
    /**
     * @name UnknownObject
     */
    export type UnknownObject = {
    "name"?:number;
    };
    export type GetTestPath = string;
    export type GetTestParams = UnknownObject;
    export type GetTestResponse = {
    "AxiosResponse"?:AxiosResponse;
    "UnknownObject"?:UnknownObject;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zAxiosResponse = z.object({
    "name": z.optional(z.string()),
    });
    export const zUnknownObject = z.object({
    "name": z.optional(z.number()),
    });
    export const zGetTestPath = z.string();
    export const zGetTestParams = zUnknownObject;
    export const zGetTestResponse = z.object({
    "AxiosResponse": z.optional(zAxiosResponse),
    "UnknownObject": z.optional(zUnknownObject),
    });"
  `);
});
