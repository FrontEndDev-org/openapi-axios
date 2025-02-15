import { Named } from '../../src/printer/Named';
import { Parser } from '../../src/printer/Parser';

it('object', () => {
  const named = new Named();
  const parser = new Parser(named, {
    type: 'object',
    properties: {
      a: {
        type: 'string',
      },
      b: {
        type: 'string',
      },
    },
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`
    "{
    "a"?:string;
    "b"?:string;
    }"
  `);
  expect(result.zod).toMatchInlineSnapshot(`
    "z.object({
    "a": z.optional(z.string()),
    "b": z.optional(z.string()),
    })"
  `);
});

it('object + object-1', () => {
  const named = new Named();
  const parser = new Parser(named, {
    type: 'object',
    properties: {
      a: {
        type: 'string',
      },
      b: {
        type: 'object',
        properties: {
          c: {
            type: 'boolean',
          },
        },
      },
    },
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`
    "{
    "a"?:string;
    "b"?:{
    "c"?:boolean;
    };
    }"
  `);
  expect(result.zod).toMatchInlineSnapshot(`
    "z.object({
    "a": z.optional(z.string()),
    "b": z.optional(z.object({
    "c": z.optional(z.boolean()),
    })),
    })"
  `);
});

it('object + object-n', () => {
  const named = new Named();
  const parser = new Parser(named, {
    type: 'object',
    properties: {
      a: {
        type: 'string',
      },
      b: {
        type: 'object',
        properties: {
          c: {
            type: 'boolean',
          },
          d: {
            type: 'number',
          },
        },
      },
    },
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`
    "{
    "a"?:string;
    "b"?:{
    "c"?:boolean;
    "d"?:number;
    };
    }"
  `);
  expect(result.zod).toMatchInlineSnapshot(`
    "z.object({
    "a": z.optional(z.string()),
    "b": z.optional(z.object({
    "c": z.optional(z.boolean()),
    "d": z.optional(z.number()),
    })),
    })"
  `);
});

describe('additionalProperties=false', () => {
  it('has properties', () => {
    const named = new Named();
    const parser = new Parser(named, {
      type: 'object',
      properties: {
        a: {
          type: 'string',
        },
        b: {
          type: 'string',
        },
      },
      additionalProperties: false,
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`
      "{
      "a"?:string;
      "b"?:string;
      }"
    `);
    expect(result.zod).toMatchInlineSnapshot(`
      "z.object({
      "a": z.optional(z.string()),
      "b": z.optional(z.string()),
      })"
    `);
  });

  it('no properties', () => {
    const named = new Named();
    const parser = new Parser(named, {
      type: 'object',
      additionalProperties: false,
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`"Record<string, unknown>"`);
    expect(result.zod).toMatchInlineSnapshot(`"z.record(z.string(), z.unknown())"`);
  });
});

describe('additionalProperties=empty', () => {
  it('has properties', () => {
    const named = new Named();
    const parser = new Parser(named, {
      type: 'object',
      properties: {
        a: {
          type: 'string',
        },
        b: {
          type: 'string',
        },
      },
      additionalProperties: {},
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`
      "{
      "a"?:string;
      "b"?:string;
      }"
    `);
    expect(result.zod).toMatchInlineSnapshot(`
      "z.object({
      "a": z.optional(z.string()),
      "b": z.optional(z.string()),
      })"
    `);
  });

  it('no properties', () => {
    const named = new Named();
    const parser = new Parser(named, {
      type: 'object',
      additionalProperties: {},
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`"Record<string, unknown>"`);
    expect(result.zod).toMatchInlineSnapshot(`"z.record(z.string(), z.unknown())"`);
  });
});

describe('additionalProperties={}', () => {
  it('has properties', () => {
    const named = new Named();
    const parser = new Parser(named, {
      type: 'object',
      properties: {
        a: {
          type: 'string',
        },
        b: {
          type: 'string',
        },
      },
      additionalProperties: {
        type: 'number',
      },
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`
      "({
      "a"?:string;
      "b"?:string;
      }&Record<string, number>)"
    `);
    expect(result.zod).toMatchInlineSnapshot(`
      "z.intersection(z.object({
      "a": z.optional(z.string()),
      "b": z.optional(z.string()),
      }),z.record(z.string(), z.number()))"
    `);
  });

  it('no properties', () => {
    const named = new Named();
    const parser = new Parser(named, {
      type: 'object',
      additionalProperties: {
        type: 'number',
      },
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`"Record<string, number>"`);
    expect(result.zod).toMatchInlineSnapshot(`"z.record(z.string(), z.number())"`);
  });
});
