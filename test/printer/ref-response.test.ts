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
    export async function postTest(config?:AxiosRequestConfig) {
    const resp = await axios<Type.PostTestResponse>({
      method: "POST",
    url: "/test",
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name User
     */
    export type User = {
    "username"?:string;
    "password"?:string;
    };
    export type PostTestResponse = Array<User>;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zUser = z.object({
    "username": z.optional(z.string()),
    "password": z.optional(z.string()),
    });
    export const zPostTestResponse = z.array(zUser);"
  `);
});
