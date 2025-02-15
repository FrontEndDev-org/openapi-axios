import { Named } from '../../src/printer/Named';
import { Parser } from '../../src/printer/Parser';

describe('type=string', () => {
  const named = new Named();

  it('minimal', () => {
    const parser = new Parser(named, {
      type: 'string',
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`"string"`);
    expect(result.zod).toMatchInlineSnapshot(`"z.string()"`);
  });

  it('+enum', () => {
    const parser = new Parser(named, {
      type: 'string',
      enum: ['a', 'b', 'c'],
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`"("a"|"b"|"c")"`);
    expect(result.zod).toMatchInlineSnapshot(`"z.union([z.literal("a"),z.literal("b"),z.literal("c")])"`);
  });

  it('+format=binary', () => {
    const parser = new Parser(named, {
      type: 'string',
      format: 'binary',
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`"Blob"`);
    expect(result.zod).toMatchInlineSnapshot(`"z.instanceof(Blob)"`);
  });
});

describe('type=number', () => {
  const named = new Named();

  it('minimal', () => {
    const parser = new Parser(named, {
      type: 'number',
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`"number"`);
    expect(result.zod).toMatchInlineSnapshot(`"z.number()"`);
  });

  it('with enum', () => {
    const parser = new Parser(named, {
      type: 'integer',
      enum: [1, 2, 3],
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`"(1|2|3)"`);
    expect(result.zod).toMatchInlineSnapshot(`"z.union([z.literal(1),z.literal(2),z.literal(3)])"`);
  });
});

describe('type=boolean', () => {
  const named = new Named();

  it('minimal', () => {
    const parser = new Parser(named, {
      type: 'boolean',
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`"boolean"`);
    expect(result.zod).toMatchInlineSnapshot(`"z.boolean()"`);
  });

  it('+enum', () => {
    const parser = new Parser(named, {
      type: 'boolean',
      enum: [true, false],
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`"(true|false)"`);
    expect(result.zod).toMatchInlineSnapshot(`"z.union([z.literal(true),z.literal(false)])"`);
  });
});

describe('type=null', () => {
  const named = new Named();

  it('minimal', () => {
    const parser = new Parser(named, {
      type: 'null',
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`"null"`);
    expect(result.zod).toMatchInlineSnapshot(`"z.null()"`);
  });
});

it('type=object', () => {
  const named = new Named();
  const result = Parser.parse(named, {
    type: 'object',
  });

  expect(result.type).toMatchInlineSnapshot(`"Record<string, unknown>"`);
  expect(result.zod).toMatchInlineSnapshot(`"z.record(z.string(), z.unknown())"`);
});

it('type=array', () => {
  const named = new Named();
  const result = Parser.parse(named, {
    type: 'array',
    items: {},
  });

  expect(result.type).toMatchInlineSnapshot(`"Array<unknown>"`);
  expect(result.zod).toMatchInlineSnapshot(`"z.array(z.unknown())"`);
});

describe('type=unknown', () => {
  const named = new Named();

  it('minimal', () => {
    const parser = new Parser(named, {
    });
    const result = parser.parse();

    expect(result.type).toMatchInlineSnapshot(`"unknown"`);
    expect(result.zod).toMatchInlineSnapshot(`"z.unknown()"`);
  });
});
