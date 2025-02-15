import { Named } from '../../src/printer/Named';
import { Parser } from '../../src/printer/Parser';

it('ref not found', () => {
  const named = new Named();
  const parser = new Parser(named, {
    $ref: 'T1',
  });

  expect(() => parser.parse()).toThrowError('T1');
});

it('ref root', () => {
  const named = new Named();
  named.setRefType('T1', 'T2');
  const parser = new Parser(named, {
    $ref: 'T1',
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`"T2"`);
  expect(result.zod).toMatchInlineSnapshot(`"zT2"`);
});

it('ref in object', () => {
  const named = new Named();
  named.setRefType('T1', 'T2');
  const parser = new Parser(named, {
    type: 'object',
    properties: {
      a: {
        $ref: 'T1',
      },
    },
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`
    "{
    "a"?:T2;
    }"
  `);
  expect(result.zod).toMatchInlineSnapshot(`
    "z.object({
    "a": z.optional(zT2),
    })"
  `);
});

it('ref in array', () => {
  const named = new Named();
  named.setRefType('T1', 'T2');
  const parser = new Parser(named, {
    type: 'array',
    items: {
      $ref: 'T1',
    },
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`"Array<T2>"`);
  expect(result.zod).toMatchInlineSnapshot(`"z.array(zT2)"`);
});

it('refs', () => {
  const named = new Named();
  named.setRefType('T1', 'T2');
  named.setRefType('T3', 'T4');
  const parser = new Parser(named, {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        a: {
          $ref: 'T1',
        },
        b: {
          $ref: 'T3',
        },
        c: {
          type: 'object',
          properties: {
            d: {
              $ref: 'T1',
            },
          },
        },
      },
    },
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`
    "Array<{
    "a"?:T2;
    "b"?:T4;
    "c"?:{
    "d"?:T2;
    };
    }>"
  `);
  expect(result.zod).toMatchInlineSnapshot(`
    "z.array(z.object({
    "a": z.optional(zT2),
    "b": z.optional(zT4),
    "c": z.optional(z.object({
    "d": z.optional(zT2),
    })),
    }))"
  `);
});
