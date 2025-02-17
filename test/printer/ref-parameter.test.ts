import { Printer } from '../../src/printer';

it('ref parameter', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/test/{userId}': {
        post: {
          parameters: [
            {
              $ref: '#/components/parameters/test1',
            },
          ],
        },
      },
    },
    components: {
      parameters: {
        test1: {
          $ref: '#/components/parameters/test2',
        },
        test2: {
          $ref: '#/components/parameters/test3',
        },
        test3: {
          in: 'path',
          name: 'userId',
          schema: {
            type: 'number',
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
     * @param userId request path "userId"
     * @param [config] request config
     */
    export async function postTest(userId:Type.PostTestPath,config?:AxiosRequestConfig) {
    const resp = await axios<AxiosResponse<unknown>>({
      method: "POST",
    url: \`/test/\${userId}\`,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`"export type PostTestPath = number;"`);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zPostTestPath = z.number();"`);
});
