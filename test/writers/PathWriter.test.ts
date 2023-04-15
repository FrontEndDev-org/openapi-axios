import { PathsWriter } from '../../src/writers/PathsWriter';

test('empty paths', () => {
  const writer = new PathsWriter({
    document: {
      components: [],
      paths: [],
    },
  });
  expect(writer.writePaths()).toMatchInlineSnapshot('""');
});

test('empty req && empty res', () => {
  const writer = new PathsWriter({
    document: {
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
    },
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "/**
     * @description ddd
     */
    export async function getName(): AxiosPromise<never> {
      return axios({
        url: \`/\`,
        method: 'get',
      });
    }
    "
  `);
});

test('req.path', () => {
  const writer = new PathsWriter({
    document: {
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
    },
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "export type T = { name: string; age: number };
    /**
     * @description ddd
     */
    export async function getName(path: T): AxiosPromise<never> {
      return axios({
        url: \`/api/name/\${path.name}/age/\${path.age}\`,
        method: 'get',
      });
    }
    "
  `);
});

test('req.query', () => {
  const writer = new PathsWriter({
    document: {
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
    },
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "export type T = { name: string; age: number };
    /**
     * @description ddd
     */
    export async function getName(params: T): AxiosPromise<never> {
      return axios({
        url: \`/\`,
        method: 'get',
        params,
      });
    }
    "
  `);
});

test('req.body', () => {
  const writer = new PathsWriter({
    document: {
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
    },
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "export type T = { name: string; age: number };
    /**
     * @description ddd
     */
    export async function getName(data: T): AxiosPromise<never> {
      return axios({
        url: \`/\`,
        method: 'get',
        data,
      });
    }
    "
  `);
});

test('res.body', () => {
  const writer = new PathsWriter({
    document: {
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
    },
  });
  expect(writer.writePaths()).toMatchInlineSnapshot(`
    "export type T = { name: string; age: number };
    /**
     * @description ddd
     */
    export async function getName(): AxiosPromise<T> {
      return axios({
        url: \`/\`,
        method: 'get',
      });
    }
    "
  `);
});

test('req.path + res.body', () => {
  const writer = new PathsWriter({
    document: {
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
    },
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
      path: GetPetByIdRequestPath
    ): AxiosPromise<GetPetByIdResponseBody> {
      return axios({
        url: \`/pet/\${path.petId}\`,
        method: 'get',
      });
    }
    "
  `);
});

test('req.path + req.query + res.body', () => {
  const writer = new PathsWriter({
    document: {
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
    },
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
      params: UploadFileRequestQuery
    ): AxiosPromise<UploadFileResponseBody> {
      return axios({
        url: \`/pet/\${path.petId}/uploadImage\`,
        method: 'post',
        params,
      });
    }
    "
  `);
});

test('req.path + req.query + req.body + res.body', () => {
  const writer = new PathsWriter({
    document: {
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
    },
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
      data: UploadFileRequestBody
    ): AxiosPromise<UploadFileResponseBody> {
      return axios({
        url: \`/pet/\${path.petId}/uploadImage\`,
        method: 'post',
        params,
        data,
      });
    }
    "
  `);
});
