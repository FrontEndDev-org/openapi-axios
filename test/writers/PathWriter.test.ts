import { PathsWriter } from '../../src/writers/PathsWriter';

test('empty paths', () => {
  const writer = new PathsWriter({
    info: {
      title: 'test',
      version: '1.0.0',
      baseURL: '/',
    },
    components: [],
    paths: [],
  });
  expect(writer.writePaths()).toMatchInlineSnapshot('""');
});

test('empty req && empty res', () => {
  const writer = new PathsWriter({
    info: {
      title: 'test',
      version: '1.0.0',
      baseURL: '/',
    },
    components: [],
    paths: [
      {
        url: '/',
        method: 'get',
        name: 'getName',
        description: 'ddd',
        request: {},
        response: {},
      },
    ],
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "/**
     * @description ddd
     */
    export async function getName(
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: \`/\`,
        method: GET,
        ...config,
      });
    }
    "
  `);
});

test('req.path', () => {
  const writer = new PathsWriter({
    info: {
      title: 'test',
      version: '1.0.0',
      baseURL: '/',
    },
    components: [],
    paths: [
      {
        url: '/api/name/{name}/age/{age}',
        method: 'get',
        name: 'getName',
        description: 'ddd',
        request: {
          path: {
            kind: 'origin',
            name: 'T',
            type: 'object',
            required: true,
            children: [
              {
                kind: 'origin',
                type: 'string',
                name: 'name',
                required: true,
              },
              {
                kind: 'origin',
                type: 'number',
                name: 'age',
                required: true,
              },
            ],
          },
        },
        response: {},
      },
    ],
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "export type T = { name: string; age: number };
    /**
     * @description ddd
     */
    export async function getName(
      path: T,
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: \`/api/name/\${path.name}/age/\${path.age}\`,
        method: GET,
        ...config,
      });
    }
    "
  `);
});

test('req.query', () => {
  const writer = new PathsWriter({
    info: {
      title: 'test',
      version: '1.0.0',
      baseURL: '/',
    },
    components: [],
    paths: [
      {
        url: '/',
        method: 'get',
        name: 'getName',
        description: 'ddd',
        request: {
          query: {
            kind: 'origin',
            name: 'T',
            type: 'object',
            required: true,
            children: [
              {
                kind: 'origin',
                type: 'string',
                name: 'name',
                required: true,
              },
              {
                kind: 'origin',
                type: 'number',
                name: 'age',
                required: true,
              },
            ],
          },
        },
        response: {},
      },
    ],
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "export type T = { name: string; age: number };
    /**
     * @description ddd
     */
    export async function getName(
      params: T,
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: \`/\`,
        method: GET,
        params,
        ...config,
      });
    }
    "
  `);
});

test('req.body', () => {
  const writer = new PathsWriter({
    info: {
      title: 'test',
      version: '1.0.0',
      baseURL: '/',
    },
    components: [],
    paths: [
      {
        url: '/',
        method: 'get',
        name: 'getName',
        description: 'ddd',
        request: {
          body: {
            kind: 'origin',
            name: 'T',
            type: 'object',
            required: true,
            children: [
              {
                kind: 'origin',
                type: 'string',
                name: 'name',
                required: true,
              },
              {
                kind: 'origin',
                type: 'number',
                name: 'age',
                required: true,
              },
            ],
          },
        },
        response: {},
      },
    ],
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "export type T = { name: string; age: number };
    /**
     * @description ddd
     */
    export async function getName(
      data: T,
      config?: AxiosRequestConfig
    ): AxiosPromise<never> {
      return request({
        url: \`/\`,
        method: GET,
        data,
        ...config,
      });
    }
    "
  `);
});

test('res.body', () => {
  const writer = new PathsWriter({
    info: {
      title: 'test',
      version: '1.0.0',
      baseURL: '/',
    },
    components: [],
    paths: [
      {
        url: '/',
        method: 'get',
        name: 'getName',
        description: 'ddd',
        response: {
          body: {
            kind: 'origin',
            name: 'T',
            type: 'object',
            required: true,
            children: [
              {
                kind: 'origin',
                type: 'string',
                name: 'name',
                required: true,
              },
              {
                kind: 'origin',
                type: 'number',
                name: 'age',
                required: true,
              },
            ],
          },
        },
        request: {},
      },
    ],
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "export type T = { name: string; age: number };
    /**
     * @description ddd
     */
    export async function getName(config?: AxiosRequestConfig): AxiosPromise<T> {
      return request({
        url: \`/\`,
        method: GET,
        ...config,
      });
    }
    "
  `);
});

test('req.path + res.body', () => {
  const writer = new PathsWriter({
    info: {
      title: 'test',
      version: '1.0.0',
      baseURL: '/',
    },
    components: [],
    paths: [
      {
        name: 'getPetById',
        method: 'get',
        url: '/pet/{petId}',
        title: 'Find pet by ID',
        description: 'Returns a single pet',
        request: {
          path: {
            kind: 'origin',
            name: 'GetPetByIdRequestPath',
            type: 'object',
            required: true,
            children: [
              {
                format: 'int64',
                name: 'petId',
                type: 'number',
                required: true,
                kind: 'origin',
              },
            ],
          },
        },
        response: {
          body: {
            kind: 'alias',
            root: false,
            name: 'GetPetByIdResponseBody',
            ref: '#/components/schemas/Pet',
            target: 'Pet',
            origin: 'Pet',
            props: [],
          },
        },
      },
    ],
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "export type GetPetByIdRequestPath = {
      /**
       * @format int64
       */
      petId: number;
    };
    export type GetPetByIdResponseBody = Pet;
    /**
     * @title Find pet by ID
     * @description Returns a single pet
     */
    export async function getPetById(
      path: GetPetByIdRequestPath,
      config?: AxiosRequestConfig
    ): AxiosPromise<GetPetByIdResponseBody> {
      return request({
        url: \`/pet/\${path.petId}\`,
        method: GET,
        ...config,
      });
    }
    "
  `);
});

test('req.path + req.query + res.body', () => {
  const writer = new PathsWriter({
    info: {
      title: 'test',
      version: '1.0.0',
      baseURL: '/',
    },
    components: [],
    paths: [
      {
        name: 'uploadFile',
        method: 'post',
        url: '/pet/{petId}/uploadImage',
        title: 'uploads an image',
        description: '',
        request: {
          path: {
            kind: 'origin',
            name: 'UploadFileRequestPath',
            type: 'object',
            required: true,
            children: [
              {
                format: 'int64',
                name: 'petId',
                type: 'number',
                required: true,
                kind: 'origin',
              },
            ],
          },
          query: {
            kind: 'origin',
            name: 'UploadFileRequestQuery',
            type: 'object',
            required: true,
            children: [
              {
                name: 'additionalMetadata',
                type: 'string',
                required: false,
                kind: 'origin',
              },
            ],
          },
        },
        response: {
          body: {
            kind: 'alias',
            root: false,
            name: 'UploadFileResponseBody',
            ref: '#/components/schemas/ApiResponse',
            target: 'ApiResponse',
            origin: 'ApiResponse',
            props: [],
          },
        },
      },
    ],
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "export type UploadFileRequestPath = {
      /**
       * @format int64
       */
      petId: number;
    };
    export type UploadFileRequestQuery = { additionalMetadata: string };
    export type UploadFileResponseBody = ApiResponse;
    /**
     * @title uploads an image
     * @description
     */
    export async function uploadFile(
      path: UploadFileRequestPath,
      params: UploadFileRequestQuery,
      config?: AxiosRequestConfig
    ): AxiosPromise<UploadFileResponseBody> {
      return request({
        url: \`/pet/\${path.petId}/uploadImage\`,
        method: POST,
        params,
        ...config,
      });
    }
    "
  `);
});

test('req.path + req.query + req.body + res.body', () => {
  const writer = new PathsWriter({
    info: {
      title: 'test',
      version: '1.0.0',
      baseURL: '/',
    },
    components: [],
    paths: [
      {
        name: 'uploadFile',
        method: 'post',
        url: '/pet/{petId}/uploadImage',
        title: 'uploads an image',
        description: '',
        request: {
          path: {
            kind: 'origin',
            name: 'UploadFileRequestPath',
            type: 'object',
            required: true,
            children: [
              {
                format: 'int64',
                name: 'petId',
                type: 'number',
                required: true,
                kind: 'origin',
              },
            ],
          },
          query: {
            kind: 'origin',
            name: 'UploadFileRequestQuery',
            type: 'object',
            required: true,
            children: [
              {
                name: 'additionalMetadata',
                type: 'string',
                required: false,
                kind: 'origin',
              },
            ],
          },
          body: {
            kind: 'origin',
            name: 'UploadFileRequestBody',
            type: 'object',
            required: true,
            children: [
              {
                name: 'additionalMetadata',
                type: 'string',
                required: false,
                kind: 'origin',
              },
            ],
          },
        },
        response: {
          body: {
            kind: 'alias',
            root: false,
            name: 'UploadFileResponseBody',
            ref: '#/components/schemas/ApiResponse',
            target: 'ApiResponse',
            origin: 'ApiResponse',
            props: [],
          },
        },
      },
    ],
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "export type UploadFileRequestPath = {
      /**
       * @format int64
       */
      petId: number;
    };
    export type UploadFileRequestQuery = { additionalMetadata: string };
    export type UploadFileRequestBody = { additionalMetadata: string };
    export type UploadFileResponseBody = ApiResponse;
    /**
     * @title uploads an image
     * @description
     */
    export async function uploadFile(
      path: UploadFileRequestPath,
      params: UploadFileRequestQuery,
      data: UploadFileRequestBody,
      config?: AxiosRequestConfig
    ): AxiosPromise<UploadFileResponseBody> {
      return request({
        url: \`/pet/\${path.petId}/uploadImage\`,
        method: POST,
        params,
        data,
        ...config,
      });
    }
    "
  `);
});
