import { Named } from '../../src/printer/Named';
import { Parser } from '../../src/printer/Parser';

it('string + null', () => {
  const named = new Named();
  const parser = new Parser(named, {
    type: ['string', 'null'],
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`"(string|null)"`);
  expect(result.zod).toMatchInlineSnapshot(`"z.union([z.string(),z.null()])"`);
});

it('array + null', () => {
  const named = new Named();
  const parser = new Parser(named, {
    type: ['array', 'null'],
    items: {
      type: 'string',
    },
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`"(Array<string>|null)"`);
  expect(result.zod).toMatchInlineSnapshot(`"z.union([z.array(z.string()),z.null()])"`);
});
