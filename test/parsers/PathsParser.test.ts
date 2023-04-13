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
      resp: {
        kind: 'origin',
        name: 'GetPetResponse',
        required: true,
        type: 'never',
      },
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
      resp: {
        kind: 'origin',
        name: 'FindPetResponse',
        required: true,
        type: 'never',
      },
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
  expect((t[0].resp as TypeAlias).target).toEqual('T');
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
      resp: {
        kind: 'origin',
        name: 'FindPetResponse',
        required: false,
        type: 'string',
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
      resp: {
        kind: 'origin',
        name: 'FindPetResponse',
        required: false,
        type: 'string',
      },
    },
  ]);
});
