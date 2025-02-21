import type { OpenAPILatest } from '../../src';
import { Printer } from '../../src/printer';

const doc1: OpenAPILatest.Document = {
  openapi: '3.1.0',
  info: {
    title: 'test',
    version: '1.0.0',
  },
  paths: {
    '/pets/{pet-id}': {
      get: {
        operationId: 'getPet',
        parameters: [
          {
            in: 'path',
            name: 'pet-id',
            schema: {
              type: 'string',
            },
            required: true,
          },
          {
            in: 'query',
            name: 'category-id',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'pet name',
            content: {
              '*': {},
            },
          },
        },
      },
    },
  },
};
const doc2: OpenAPILatest.Document = {
  openapi: '3.1.0',
  info: {
    title: 'test',
    version: '1.0.0',
  },
  paths: {
    '/pets/{pet-id}': {
      get: {
        operationId: 'getPet',
        parameters: [
          {
            in: 'path',
            name: 'pet-id',
            schema: {
              type: 'string',
            },
            required: true,
          },
          {
            in: 'query',
            name: 'category-id',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'pet name',
            content: {
              '*': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};

describe('runtimeValidate = true', () => {
  it('response unknown', () => {
    const printer = new Printer(doc1, {
      runtimeValidate: true,
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
       * @param petId request path "pet-id"
       * @param [categoryId] request params "category-id"
       * @param [config] request config
       */
      export async function getPet(petId:Type.GetPetPath,categoryId?:Type.GetPetParams,config?:AxiosRequestConfig) {
      zGetPetPath.parse(petId)
      (categoryId !== undefined) && zGetPetParams.parse(categoryId)
      const resp = await axios<unknown>({
        method: "GET",
      url: \`/pets/\${petId}\`,
      params: {"category-id": categoryId},
      ...config
      });
      return resp;
      }"
    `);
  });

  it('response type', () => {
    const printer = new Printer(doc2, {
      runtimeValidate: true,
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
       * @param petId request path "pet-id"
       * @param [categoryId] request params "category-id"
       * @param [config] request config
       * @returns pet name
       */
      export async function getPet(petId:Type.GetPetPath,categoryId?:Type.GetPetParams,config?:AxiosRequestConfig) {
      zGetPetPath.parse(petId)
      (categoryId !== undefined) && zGetPetParams.parse(categoryId)
      const resp = await axios<Type.GetPetResponse>({
        method: "GET",
      url: \`/pets/\${petId}\`,
      params: {"category-id": categoryId},
      ...config
      });
      zGetPetResponse.parse(resp["data"]);
      return resp;
      }"
    `);
  });
});

describe('runtimeValidate = {responseDataProps: []}', () => {
  it('response unknown', () => {
    const printer = new Printer(doc1, {
      runtimeValidate: {
        responseDataProps: [],
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
       * @param petId request path "pet-id"
       * @param [categoryId] request params "category-id"
       * @param [config] request config
       */
      export async function getPet(petId:Type.GetPetPath,categoryId?:Type.GetPetParams,config?:AxiosRequestConfig) {
      zGetPetPath.parse(petId)
      (categoryId !== undefined) && zGetPetParams.parse(categoryId)
      const resp = await axios<unknown>({
        method: "GET",
      url: \`/pets/\${petId}\`,
      params: {"category-id": categoryId},
      ...config
      });
      return resp;
      }"
    `);
  });

  it('response type', () => {
    const printer = new Printer(doc2, {
      runtimeValidate: {
        responseDataProps: [],
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
       * @param petId request path "pet-id"
       * @param [categoryId] request params "category-id"
       * @param [config] request config
       * @returns pet name
       */
      export async function getPet(petId:Type.GetPetPath,categoryId?:Type.GetPetParams,config?:AxiosRequestConfig) {
      zGetPetPath.parse(petId)
      (categoryId !== undefined) && zGetPetParams.parse(categoryId)
      const resp = await axios<Type.GetPetResponse>({
        method: "GET",
      url: \`/pets/\${petId}\`,
      params: {"category-id": categoryId},
      ...config
      });
      zGetPetResponse.parse(resp);
      return resp;
      }"
    `);
  });
});

describe('runtimeValidate = {responseDataProps: [a, b-c]}', () => {
  it('response unknown', () => {
    const printer = new Printer(doc1, {
      runtimeValidate: {
        responseDataProps: ['a', 'b-c'],
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
       * @param petId request path "pet-id"
       * @param [categoryId] request params "category-id"
       * @param [config] request config
       */
      export async function getPet(petId:Type.GetPetPath,categoryId?:Type.GetPetParams,config?:AxiosRequestConfig) {
      zGetPetPath.parse(petId)
      (categoryId !== undefined) && zGetPetParams.parse(categoryId)
      const resp = await axios<unknown>({
        method: "GET",
      url: \`/pets/\${petId}\`,
      params: {"category-id": categoryId},
      ...config
      });
      return resp;
      }"
    `);
  });

  it('response type', () => {
    const printer = new Printer(doc2, {
      runtimeValidate: {
        responseDataProps: ['a', 'b-c'],
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
       * @param petId request path "pet-id"
       * @param [categoryId] request params "category-id"
       * @param [config] request config
       * @returns pet name
       */
      export async function getPet(petId:Type.GetPetPath,categoryId?:Type.GetPetParams,config?:AxiosRequestConfig) {
      zGetPetPath.parse(petId)
      (categoryId !== undefined) && zGetPetParams.parse(categoryId)
      const resp = await axios<Type.GetPetResponse>({
        method: "GET",
      url: \`/pets/\${petId}\`,
      params: {"category-id": categoryId},
      ...config
      });
      zGetPetResponse.parse(resp["a"]["b-c"]);
      return resp;
      }"
    `);
  });
});
