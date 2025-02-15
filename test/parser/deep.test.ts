import type { ParseResult } from '../../src/printer/Parser';
import { Named } from '../../src/printer/Named';
import { Parser } from '../../src/printer/Parser';

it('array + object', () => {
  const named = new Named();
  const parser = new Parser(named, {
    type: 'array',
    items: {
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
  });

  expect(parser.parse()).toEqual<ParseResult>({
    required: false,
    comments: {},
    deps: [],
    type: `Array<{
"name"?:string;
"age"?:number;
}>`,
    zod: `z.array(z.object({
"name": z.optional(z.string()),
"age": z.optional(z.number()),
}))`,
  });
});

it('object + array', () => {
  const named = new Named();
  const parser = new Parser(named, {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      age: {
        type: 'array',
        items: {
          type: 'number',
        },
      },
    },
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`
    "{
    "name"?:string;
    "age"?:Array<number>;
    }"
  `);
  expect(result.zod).toMatchInlineSnapshot(`
    "z.object({
    "name": z.optional(z.string()),
    "age": z.optional(z.array(z.number())),
    })"
  `);
});

it('array + object + array', () => {
  const named = new Named();
  const parser = new Parser(named, {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        hobbies: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`
    "Array<{
    "name"?:string;
    "hobbies"?:Array<string>;
    }>"
  `);
  expect(result.zod).toMatchInlineSnapshot(`
    "z.array(z.object({
    "name": z.optional(z.string()),
    "hobbies": z.optional(z.array(z.string())),
    }))"
  `);
});

it('object + array + object', () => {
  const named = new Named();
  const parser = new Parser(named, {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      hobbies: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            years: {
              type: 'number',
            },
          },
        },
      },
    },
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`
    "{
    "name"?:string;
    "hobbies"?:Array<{
    "name"?:string;
    "years"?:number;
    }>;
    }"
  `);
  expect(result.zod).toMatchInlineSnapshot(`
    "z.object({
    "name": z.optional(z.string()),
    "hobbies": z.optional(z.array(z.object({
    "name": z.optional(z.string()),
    "years": z.optional(z.number()),
    }))),
    })"
  `);
});
