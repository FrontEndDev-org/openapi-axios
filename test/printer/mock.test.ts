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
              '*': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      patch: {
        operationId: 'updatePet',
        parameters: [
          {
            in: 'path',
            name: 'pet-id',
            schema: {
              type: 'string',
            },
            required: true,
          },
        ],
        requestBody: {
          required: true,
          content: {
            '*': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  age: {
                    type: 'number',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

it('runtimeMock = true', () => {
  const printer = new Printer(doc1, {
    runtimeMock: true,
  });
  const result = printer.print({
    hideHeaders: true,
    hideFooters: true,
    hideInfo: true,
    hideAlert: true,
  });

  expect(result.main.code).toMatchInlineSnapshot(`
    "import axios from "axios";
    import {type AxiosRequestConfig as AxiosRequestConfig} from "axios";
    import type * as Type from ".";
    import enableMock from ".";

    if (process.env.NODE_ENV !== "production") {
    enableMock();
    }
    /**
     * @param petId request path "pet-id"
     * @param [categoryId] request params "category-id"
     * @param [config] request config
     * @returns pet name
     */
    export async function getPet(petId:Type.GetPetPath,categoryId?:Type.GetPetParams,config?:AxiosRequestConfig) {
    const resp = await axios<Type.GetPetResponse>({
      method: "GET",
    url: \`/pets/\${petId}\`,
    params: {"category-id": categoryId},
    ...config
    });
    return resp;
    }
    /**
     * @param petId request path "pet-id"
     * @param data request data
     * @param [config] request config
     */
    export async function updatePet(petId:Type.UpdatePetPath,data:Type.UpdatePetData,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "PATCH",
    url: \`/pets/\${petId}\`,
    data: data,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.mock.code).toMatchInlineSnapshot(`
    "import { generateMock } from "@anatine/zod-mock";
    import AxiosMockAdapter from "axios-mock-adapter";
    import axios from "axios";
    import {faker as faker} from "@faker-js/faker";
    import {zGetPetResponse} from ".";

    export default function enableMock() {
    const mock = new AxiosMockAdapter(axios);
    mock.onGet(/^\\/pets\\/[^/]+$/).reply(() => {
    return [200, generateMock(zGetPetResponse, {faker: faker})];
    });
    mock.onPatch(/^\\/pets\\/[^/]+$/).reply(() => {
    return [200];
    });
    }"
  `);
});

it('runtimeMock = {enableCondition}', () => {
  const printer = new Printer(doc1, {
    runtimeMock: { enableCondition: 'import.meta.env.PROD' },
  });
  const result = printer.print({
    hideHeaders: true,
    hideFooters: true,
    hideInfo: true,
    hideAlert: true,
  });

  expect(result.main.code).toMatchInlineSnapshot(`
    "import axios from "axios";
    import {type AxiosRequestConfig as AxiosRequestConfig} from "axios";
    import type * as Type from ".";
    import enableMock from ".";

    if (import.meta.env.PROD) {
    enableMock();
    }
    /**
     * @param petId request path "pet-id"
     * @param [categoryId] request params "category-id"
     * @param [config] request config
     * @returns pet name
     */
    export async function getPet(petId:Type.GetPetPath,categoryId?:Type.GetPetParams,config?:AxiosRequestConfig) {
    const resp = await axios<Type.GetPetResponse>({
      method: "GET",
    url: \`/pets/\${petId}\`,
    params: {"category-id": categoryId},
    ...config
    });
    return resp;
    }
    /**
     * @param petId request path "pet-id"
     * @param data request data
     * @param [config] request config
     */
    export async function updatePet(petId:Type.UpdatePetPath,data:Type.UpdatePetData,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "PATCH",
    url: \`/pets/\${petId}\`,
    data: data,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.mock.code).toMatchInlineSnapshot(`
    "import { generateMock } from "@anatine/zod-mock";
    import AxiosMockAdapter from "axios-mock-adapter";
    import axios from "axios";
    import {faker as faker} from "@faker-js/faker";
    import {zGetPetResponse} from ".";

    export default function enableMock() {
    const mock = new AxiosMockAdapter(axios);
    mock.onGet(/^\\/pets\\/[^/]+$/).reply(() => {
    return [200, generateMock(zGetPetResponse, {faker: faker})];
    });
    mock.onPatch(/^\\/pets\\/[^/]+$/).reply(() => {
    return [200];
    });
    }"
  `);
});
