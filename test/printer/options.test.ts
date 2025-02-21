import { Printer } from '../../src/printer';

it('axios 模块导入名称默认', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/': {
        get: {},
      },
    },
  }, {
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
    export async function get(config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: "/",
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`""`);
  expect(result.zod.code).toMatchInlineSnapshot(`""`);
});

it('axios 模块导入名称指定', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/': {
        get: {},
      },
    },
  }, {
    axiosImportName: 'axios2',
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
    export async function get(config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: "/",
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`""`);
  expect(result.zod.code).toMatchInlineSnapshot(`""`);
});

it('axios 默认导入名称为空', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/': {
        get: {},
      },
    },
  }, {
    axiosImportName: '',
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
    export async function get(config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: "/",
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`""`);
  expect(result.zod.code).toMatchInlineSnapshot(`""`);
});

it('axios 模块和类型指定文件', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/': {
        get: {},
      },
    },
  }, {
    axiosImportName: 'axios2',
    axiosImportFile: '/a/b/request.ts',
    axiosTypeImportFile: '/a/c/request-types.ts',
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
    export async function get(config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "GET",
    url: "/",
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`""`);
  expect(result.zod.code).toMatchInlineSnapshot(`""`);
});
