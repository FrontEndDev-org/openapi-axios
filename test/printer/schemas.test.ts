import { Printer } from '../../src/printer';

it('number', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        OrderId: {
          type: 'integer',
          format: 'int64',
          example: 10,
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name OrderId
     * @format int64
     * @example 10
     */
    export type OrderId = number;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zOrderId = z.number();"`);
});

it('number enum', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        OrderId: {
          type: 'integer',
          format: 'int64',
          example: 10,
          enum: [1, 3, 5, 7, 9],
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name OrderId
     * @format int64
     * @example 10
     */
    export type OrderId = (1|3|5|7|9);"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zOrderId = z.union([z.literal(1),z.literal(3),z.literal(5),z.literal(7),z.literal(9)]);"`);
});

it('[number, null] enum', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        OrderId: {
          type: ['integer', 'null'],
          format: 'int64',
          example: 10,
          enum: [1, 3, 5, 7, 9],
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name OrderId
     * @format int64
     * @example 10
     */
    export type OrderId = ((1|3|5|7|9)|null);"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zOrderId = z.union([z.union([z.literal(1),z.literal(3),z.literal(5),z.literal(7),z.literal(9)]),z.null()]);"`);
});

it('type[]', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Order: {
          type: ['integer', 'string'],
          format: 'int64',
          example: 10,
          description: 'test1',
          deprecated: true,
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name Order
     * @description test1
     * @deprecated
     * @format int64
     * @example 10
     */
    export type Order = (number|string);"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zOrder = z.union([z.number(),z.string()]);"`);
});

it('allOf primitive', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        User: {
          type: ['object', 'null'],
          properties: {
            username: {
              type: 'string',
            },
          },
          required: ['username'],
        },
        Order: {
          allOf: [
            {
              type: 'integer',
              format: 'int64',
              example: 10,
              description: 'test1',
              deprecated: true,
            },
            {
              $ref: '#/components/schemas/User',
              description: 'test2',
            },
          ],
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name User
     */
    export type User = ({
    "username":string;
    }|null);
    /**
     * @name Order
     */
    export type Order = (number&User);"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zUser = z.union([z.object({
    "username": z.string(),
    }),z.null()]);
    export const zOrder = z.intersection(z.number(),zUser);"
  `);
});

it('explicit array', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Order: {
          type: 'array',
          items: {
            type: 'integer',
            format: 'int64',
            example: 10,
            description: 'test1',
            deprecated: true,
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name Order
     */
    export type Order = Array<number>;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zOrder = z.array(z.number());"`);
});

it('generic array', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Order: {
          type: 'array',
          items: {
            type: 'integer',
            format: 'int64',
            example: 10,
            description: 'test1',
            deprecated: true,
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name Order
     */
    export type Order = Array<number>;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zOrder = z.array(z.number());"`);
});

it('explicit object', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Order: {
          type: 'object',
          properties: {
            aaa: {
              type: 'integer',
              format: 'int64',
              example: 10,
              description: 'test1',
              deprecated: true,
            },
            bbb: {
              type: 'string',
              required: true,
            },
            ccc: {
              type: 'boolean',
            },
          },
          required: ['aaa'],
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name Order
     */
    export type Order = {
    /**
     * @description test1
     * @deprecated
     * @format int64
     * @example 10
     */
    "aaa":number;
    "bbb":string;
    "ccc"?:boolean;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zOrder = z.object({
    "aaa": z.number(),
    "bbb": z.string(),
    "ccc": z.optional(z.boolean()),
    });"
  `);
});

it('generic object', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Pet: {
          type: 'object',
          required: ['b-b'],
          properties: {
            'aa': {
              required: true,
              type: 'object',
            },
            'b-b': {
              type: 'object',
            },
            'string': {
              type: 'object',
            },
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name Pet
     */
    export type Pet = {
    "aa":Record<string, unknown>;
    "b-b":Record<string, unknown>;
    "string"?:Record<string, unknown>;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zPet = z.object({
    "aa": z.record(z.string(), z.unknown()),
    "b-b": z.record(z.string(), z.unknown()),
    "string": z.optional(z.record(z.string(), z.unknown())),
    });"
  `);
});

it('additionalProperties true', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Pet: {
          type: 'object',
          additionalProperties: true,
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name Pet
     */
    export type Pet = Record<string, unknown>;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zPet = z.record(z.string(), z.unknown());"`);
});

it('additionalProperties false', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Pet: {
          type: 'object',
          additionalProperties: false,
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name Pet
     */
    export type Pet = Record<string, unknown>;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zPet = z.record(z.string(), z.unknown());"`);
});

it('additionalProperties schema type', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        PetA: {
          type: 'object',
          additionalProperties: {
            type: 'string',
            enum: ['a', 'b'],
          },
        },
        PetB: {
          type: 'object',
          additionalProperties: {
            type: 'string',
            required: true,
            enum: ['a', 'b'],
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name PetA
     */
    export type PetA = Record<string, ("a"|"b")>;
    /**
     * @name PetB
     */
    export type PetB = Record<string, ("a"|"b")>;"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zPetA = z.record(z.string(), z.union([z.literal("a"),z.literal("b")]));
    export const zPetB = z.record(z.string(), z.union([z.literal("a"),z.literal("b")]));"
  `);
});

it('additionalProperties schema ref', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        PetA: {
          type: 'object',
          additionalProperties: {
            $ref: '#/components/schemas/Pet1',
          },
        },
        PetB: {
          additionalProperties: {
            $ref: '#/components/schemas/Pet2',
          },
        },
        Pet1: {
          type: 'string',
          enum: ['a', 'b'],
        },
        Pet2: {
          type: 'string',
          required: true,
          enum: ['a', 'b'],
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
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name PetA
     */
    export type PetA = Record<string, Pet1>;
    /**
     * @name PetB
     */
    export type PetB = Record<string, Pet2>;
    /**
     * @name Pet1
     */
    export type Pet1 = ("a"|"b");
    /**
     * @name Pet2
     */
    export type Pet2 = ("a"|"b");"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zPetA = z.record(z.string(), zPet1);
    export const zPetB = z.record(z.string(), zPet2);
    export const zPet1 = z.union([z.literal("a"),z.literal("b")]);
    export const zPet2 = z.union([z.literal("a"),z.literal("b")]);"
  `);
});
