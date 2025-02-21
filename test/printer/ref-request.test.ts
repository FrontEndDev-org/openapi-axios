import { Printer } from '../../src/printer';

it('ref request', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/test': {
        post: {
          requestBody: {
            $ref: '#/components/requestBodies/test1',
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
      requestBodies: {
        test1: {
          $ref: '#/components/requestBodies/test2',
        },
        test2: {
          $ref: '#/components/requestBodies/test3',
        },
        test3: {
          content: {
            'application/json': {
              schema: {
                description: '用户列表',
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
     * @param data 用户列表
     * @param [config] request config
     */
    export async function postTest(data:Type.PostTestData,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "POST",
    url: "/test",
    data: data,
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
    export type PostTestData = Array<User>;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zUser = z.object({
    "username": z.optional(z.string()),
    "password": z.optional(z.string()),
    });
    export const zPostTestData = z.array(zUser);"
  `);
});
