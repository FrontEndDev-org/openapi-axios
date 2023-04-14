import { OpenAPIV3 } from 'openapi-types';
import { ComponentsParser } from '../../src/parsers/ComponentsParser';
import { PathsParser } from '../../src/parsers/PathsParser';
import { TypeAlias, TypeList, TypeOperations } from '../../src/parsers/types';
import HttpMethods = OpenAPIV3.HttpMethods;

test('empty paths keys', () => {
  const parser = new PathsParser({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {},
  });

  const t = parser.parsePaths();
  expect(t).toEqual<TypeOperations>([]);
});

test('empty path item keys', () => {
  const parser = new PathsParser({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {
      '/pet': {},
    },
  });

  const t = parser.parsePaths();
  expect(t).toEqual<TypeOperations>([]);
});

test('empty path item method responses keys', () => {
  const parser = new PathsParser({
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

  const t = parser.parsePaths();
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
  const parser = new PathsParser({
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

  const t = parser.parsePaths();
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
  const parser = new PathsParser({
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

  parser.parseComponents();
  const t = parser.parsePaths();
  expect(t).toEqual<TypeOperations>([
    {
      name: 'findPet',
      url: '/pet',
      method: HttpMethods.GET,
      request: {},
      response: {
        body: {
          kind: 'alias',
          root: false,
          name: 'FindPetResponseBody',
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
  const parser = new PathsParser({
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

  const t = parser.parsePaths();
  expect(t).toEqual<TypeOperations>([
    {
      name: 'findPet',
      method: OpenAPIV3.HttpMethods.GET,
      url: '/pet',
      request: {},
      response: {
        body: {
          kind: 'origin',
          name: 'FindPetResponseBody',
          required: false,
          type: 'string',
        },
      },
    },
  ]);
});

test('req body', () => {
  const parser = new PathsParser({
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

  const t = parser.parsePaths();
  expect(t).toEqual<TypeOperations>([
    {
      name: 'findPet',
      method: HttpMethods.GET,
      url: '/pet',
      request: {
        body: {
          kind: 'origin',
          name: 'FindPetRequestBody',
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

test('req query + path', () => {
  const parser = new PathsParser({
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
              name: 'keywords',
              in: 'query',
              schema: {
                type: 'string',
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

  parser.parseComponents();
  const t = parser.parsePaths();
  expect(t).toEqual<TypeOperations>([
    {
      name: 'findPet',
      method: HttpMethods.GET,
      url: '/pet/{name}',
      request: {
        path: [
          {
            kind: 'alias',
            root: false,
            name: 'name',
            ref: '#/components/schemas/O/p',
            target: 'O',
            origin: 'O',
            props: ['p'],
          },
        ],
        query: [
          {
            kind: 'origin',
            name: 'keywords',
            type: 'string',
            required: false,
          },
        ],
      },
      response: {},
    },
  ]);
});
