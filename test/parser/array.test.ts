import { Named } from '../../src/printer/Named';
import { Parser } from '../../src/printer/Parser';

it('array', () => {
  const named = new Named();
  const parser = new Parser(named, {
    type: 'array',
    items: {
      type: 'string',
    },
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`"Array<string>"`);
  expect(result.zod).toMatchInlineSnapshot(`"z.array(z.string())"`);
});

it('array + array', () => {
  const named = new Named();
  const parser = new Parser(named, {
    type: 'array',
    items: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  });
  const result = parser.parse();

  expect(result.type).toMatchInlineSnapshot(`"Array<Array<string>>"`);
  expect(result.zod).toMatchInlineSnapshot(`"z.array(z.array(z.string()))"`);
});
