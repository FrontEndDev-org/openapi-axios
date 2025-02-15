import { Named } from '../../src/printer/Named';
import { Parser } from '../../src/printer/Parser';

it('required', () => {
  const named = new Named();
  const result = Parser.parse(named, {
    type: 'object',
    required: ['t1'],
    properties: {
      t0: {
        type: ['string'],
        required: true,
      },
      t1: {
        type: 'number',
      },
      t2: {
        type: 'boolean',
      },
      t3: {
        type: ['string', 'number'],
        required: true,
      },
    },
  });

  expect(result.type).toMatchInlineSnapshot(`
    "{
    "t0":string;
    "t1":number;
    "t2"?:boolean;
    "t3"?:(string|number);
    }"
  `);
  expect(result.zod).toMatchInlineSnapshot(`
    "z.object({
    "t0": z.string(),
    "t1": z.number(),
    "t2": z.optional(z.boolean()),
    "t3": z.optional(z.union([z.string(),z.number()])),
    })"
  `);
});
