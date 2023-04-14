import { Named } from '../../src/parsers/Named';

test('named', () => {
  const named = new Named();

  expect(named.nextTypeName('-')).toEqual('Unnamed');
  expect(named.nextTypeName('!')).toEqual('Unnamed2');

  expect(named.nextTypeName('A')).toEqual('A');
  expect(named.nextTypeName('A!')).toEqual('A2');

  expect(named.nextTypeName('aa')).toEqual('Aa');
  expect(named.nextTypeName('aa!')).toEqual('Aa2');
  expect(named.nextTypeName('aa!!')).toEqual('Aa3');

  expect(named.nextOperationId('get', '/path/to/foo')).toEqual('getFoo');
  expect(named.nextOperationId('get', '/path/to/foo')).toEqual('getFoo2');
  expect(named.nextOperationId('get', '/path/to/foo', 'foo')).toEqual('foo');
  expect(named.nextOperationId('get', '/path/to/foo', 'foo')).toEqual('foo2');
  expect(named.nextOperationId('get', '/path/to/foo')).toEqual('getFoo3');

  // A -> A!(A2) -> aa!!/1/2 == A -> aa!!/1/2(Aa3)
  const a1 = named.addAlias({
    kind: 'alias',
    name: 'A',
    ref: '#/components/schemas/A!',
    target: '',
    origin: '',
    props: [],
  });
  // A!(A2) -> aa!!/1/2(Aa3)
  const a2 = named.addAlias({
    kind: 'alias',
    name: 'A2',
    ref: '#/components/schemas/aa!!/1/2',
    target: '',
    origin: '',
    props: [],
  });

  named.resolveAlias();

  expect(a1.target).toEqual('A2');
  expect(a2.target).toEqual('Aa3');

  expect(a1.origin).toEqual('Aa3');
  expect(a2.origin).toEqual('Aa3');

  expect(a1.props).toEqual([]);
  expect(a2.props).toEqual(['1', '2']);
});
