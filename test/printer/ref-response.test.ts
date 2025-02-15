import { Printer } from '../../src/printer';

it('ref response', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/test': {
        post: {
          responses: {
            200: {
              $ref: '#/components/responses/test1',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        User: {
          properties: {
            username: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
          },
        },
      },
      responses: {
        test1: {
          $ref: '#/components/responses/test2',
        },
        test2: {
          $ref: '#/components/responses/test3',
        },
        test3: {
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/User',
                },
              },
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
    "export type User = {
    "username"?:string;
    "password"?:string;
    };

    export type PostTestResponse = Array<User>;

    /**
     * @param [config] request config
     */
    export async function postTest(config?:AxiosRequestConfig): Promise<AxiosResponse<PostTestResponse>> {
        return axios({
            method: "POST",
            url: \`/test\`,
    ...config
        });
    }"
  `);
});
