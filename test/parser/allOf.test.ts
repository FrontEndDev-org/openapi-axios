import { Named } from '../../src/printer/Named';
import { Parser } from '../../src/printer/Parser';

it('nullable + allOf', () => {
  const named = new Named();
  named.nextRefType('T1', '#/components/schemas/T1');
  named.nextRefType('T2', '#/components/schemas/T2');
  const result = Parser.parse(named, {
    type: 'object',
    properties: {
      t0: { oneOf: [{ type: 'null' }, { allOf: [{ $ref: '#/components/schemas/T1' }, { $ref: '#/components/schemas/T2' }] }] },
    },
  });

  expect(result.type).toMatchInlineSnapshot(`
      "{
      "t0"?:(null|(T1&T2));
      }"
    `);
  expect(result.zod).toMatchInlineSnapshot(`
    "z.object({
    "t0": z.optional(z.union([z.null(),z.intersection(zT1,zT2)])),
    })"
  `);
});
