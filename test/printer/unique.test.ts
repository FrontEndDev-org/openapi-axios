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

  expect(
    printer.print({
      hideHeaders: true,
      hideInfo: true,
      hideAlert: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
    "export type TestAa = {
    "name"?:string;
    };

    export type GetTestResponse = TestAa;

    /**
     * @param [config] request config
     * @returns success
     */
    export async function getTest(config?:AxiosRequestConfig): Promise<AxiosResponse<GetTestResponse>> {
        return axios({
            method: "GET",
            url: \`/test\`,
    ...config
        });
    }"
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

  expect(
    printer.print({
      hideHeaders: true,
      hideInfo: true,
      hideAlert: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
    "export type AxiosResponse_2 = {
    "name"?:string;
    };

    export type UnknownObject = {
    "name"?:number;
    };

    export type GetTestPath = string;
    export type GetTestParams = UnknownObject;
    export type GetTestResponse = {
    "AxiosResponse"?:AxiosResponse_2;
    "UnknownObject"?:UnknownObject;
    };

    /**
     * @param axios_2 request path "axios"
     * @param [unknownObject] request params "UnknownObject"
     * @param [config] request config
     * @returns success
     */
    export async function getTest(axios_2:GetTestPath,unknownObject?:GetTestParams,config?:AxiosRequestConfig): Promise<AxiosResponse<GetTestResponse>> {
        return axios({
            method: "GET",
            url: \`/test/\${axios_2}\`,
    params: {"UnknownObject": unknownObject},
    ...config
        });
    }"
  `);
});
