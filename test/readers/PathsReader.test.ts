import { OpenAPIV3 } from 'openapi-types';
import { PathsReader } from '../../src/readers/PathsReader';
import { TypeOperations } from '../../src/readers/types';
import HttpMethods = OpenAPIV3.HttpMethods;

test('empty paths keys', () => {
  const reader = new PathsReader({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {},
  });

  const t = reader.readPaths();
  expect(t).toEqual<TypeOperations>([]);
});

test('empty path item keys', () => {
  const reader = new PathsReader({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {
      '/pet': {},
    },
  });

  const t = reader.readPaths();
  expect(t).toEqual<TypeOperations>([]);
});

test('empty path item method responses keys', () => {
  const reader = new PathsReader({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {
      '/pet': {
        get: {
          responses: {},
        },
      },
    },
  });

  const t = reader.readPaths();
  expect(t).toEqual<TypeOperations>([
    {
      name: 'getPet',
      method: OpenAPIV3.HttpMethods.GET,
      url: '/pet',
      request: {},
      response: {},
    },
  ]);
});

test('empty path item method responses keys + specify operationId', () => {
  const reader = new PathsReader({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {
      '/pet': {
        get: {
          operationId: 'findPet',
          responses: {},
        },
      },
    },
  });

  const t = reader.readPaths();
  expect(t).toEqual<TypeOperations>([
    {
      name: 'findPet',
      method: OpenAPIV3.HttpMethods.GET,
      url: '/pet',
      request: {},
      response: {},
    },
  ]);
});

test('resp ref', () => {
  const reader = new PathsReader({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {
      '/pet': {
        get: {
          operationId: 'findPet',
          responses: {
            200: {
              description: '',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/T',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        T: {
          type: 'string',
        },
      },
    },
  });

  reader.readComponents();
  const t = reader.readPaths();
  expect(t).toEqual<TypeOperations>([
    {
      name: 'findPet',
      url: '/pet',
      method: HttpMethods.GET,
      request: {},
      response: {
        body: {
          kind: 'alias',
          refAble: false,
          name: 'FindPetResData',
          target: 'T',
          origin: 'T',
          props: [],
          ref: '#/components/schemas/T',
        },
      },
    },
  ]);
});

test('resp type', () => {
  const reader = new PathsReader({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {
      '/pet': {
        get: {
          operationId: 'findPet',
          responses: {
            200: {
              description: '',
              content: {
                'application/json': {
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
  });

  const t = reader.readPaths();
  expect(t).toEqual<TypeOperations>([
    {
      name: 'findPet',
      method: OpenAPIV3.HttpMethods.GET,
      url: '/pet',
      request: {},
      response: {
        body: {
          kind: 'origin',
          name: 'FindPetResData',
          required: false,
          type: 'string',
        },
      },
    },
  ]);
});

test('req body', () => {
  const reader = new PathsReader({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {
      '/pet': {
        get: {
          operationId: 'findPet',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    p: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          responses: {},
        },
      },
    },
  });

  const t = reader.readPaths();
  expect(t).toEqual<TypeOperations>([
    {
      name: 'findPet',
      method: HttpMethods.GET,
      url: '/pet',
      request: {
        body: {
          kind: 'origin',
          name: 'FindPetReqData',
          type: 'object',
          required: false,
          children: [
            {
              kind: 'origin',
              name: 'p',
              type: 'string',
              required: false,
            },
          ],
        },
      },
      response: {},
    },
  ]);
});

test('req file', () => {
  const reader = new PathsReader({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {
      '/pet': {
        get: {
          operationId: 'findPet',
          requestBody: {
            content: {
              'application/octet-stream': {
                schema: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
          },
          responses: {},
        },
      },
    },
  });

  const t = reader.readPaths();
  expect(t).toEqual<TypeOperations>([
    {
      name: 'findPet',
      method: HttpMethods.GET,
      url: '/pet',
      request: {
        body: {
          kind: 'alias',
          name: 'FindPetReqData',
          origin: 'Blob',
          props: [],
          refAble: false,
          target: 'Blob',
        },
      },
      response: {},
    },
  ]);
});

test('req query + path', () => {
  const reader = new PathsReader({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {
      '/pet/{name}': {
        get: {
          operationId: 'findPet',
          parameters: [
            {
              name: 'name',
              in: 'path',
              schema: {
                $ref: '#/components/schemas/O/p',
              },
            },
            {
              name: 'status',
              in: 'query',
              description: 'Status values that need to be considered for filter',
              required: false,
              explode: true,
              schema: {
                type: 'string',
                default: 'available',
                enum: ['available', 'pending', 'sold'],
              },
            },
          ],
          responses: {},
        },
      },
    },
    components: {
      schemas: {
        O: {
          type: 'object',
          properties: {
            P: {
              type: 'string',
            },
          },
        },
      },
    },
  });

  reader.readComponents();
  const t = reader.readPaths();
  // console.log(JSON.stringify(t));
  expect(t).toEqual<TypeOperations>([
    {
      name: 'findPet',
      method: 'get',
      url: '/pet/{name}',
      request: {
        path: {
          kind: 'origin',
          name: 'FindPetReqPath',
          type: 'object',
          required: true,
          children: [
            {
              kind: 'alias',
              refAble: false,
              name: 'name',
              ref: '#/components/schemas/O/p',
              target: 'O',
              origin: 'O',
              props: ['p'],
            },
          ],
        },
        query: {
          kind: 'origin',
          name: 'FindPetReqParams',
          type: 'object',
          required: false,
          children: [
            {
              default: 'available',
              description: 'Status values that need to be considered for filter',
              enum: ['available', 'pending', 'sold'],
              name: 'status',
              type: 'string',
              required: false,
              kind: 'origin',
            },
          ],
        },
      },
      response: {},
    },
  ]);
});
