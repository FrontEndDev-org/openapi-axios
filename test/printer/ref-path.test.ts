import { Printer } from '../../src/printer';

it('ref path', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/test': {
        $ref: '#/components/pathItems/test1',
      },
    },
    components: {
      pathItems: {
        test1: {
          $ref: '#/components/pathItems/test2',
        },
        test2: {
          $ref: '#/components/pathItems/test3',
        },
        test3: {
          get: {},
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
     */
    export async function getTest(config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: \`/test\`,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`""`);
  expect(result.zod.code).toMatchInlineSnapshot(`""`);
});
