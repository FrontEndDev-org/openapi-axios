import { Named } from '../../src/parsers/Named';

test('named', () => {
  const named = new Named();

  expect(named.nextTypeName('-')).toEqual('Untitled');
  expect(named.nextTypeName('!')).toEqual('Untitled2');

  expect(named.nextTypeName('A')).toEqual('A');
  expect(named.nextTypeName('A')).toEqual('A2');

  expect(named.nextTypeName('aa')).toEqual('Aa');
  expect(named.nextTypeName('aa')).toEqual('Aa2');
  expect(named.nextTypeName('aa')).toEqual('Aa3');

  expect(named.nextOperationId('get', '/path/to/foo')).toEqual('getFoo');
  expect(named.nextOperationId('get', '/path/to/foo')).toEqual('getFoo2');
  expect(named.nextOperationId('get', '/path/to/foo', 'foo')).toEqual('foo');
  expect(named.nextOperationId('get', '/path/to/foo', 'foo')).toEqual('foo2');
  expect(named.nextOperationId('get', '/path/to/foo')).toEqual('getFoo3');
});
