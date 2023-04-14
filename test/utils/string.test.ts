import { buildName, findOrigin, RefInfo, refToType, toTypePath, varString } from '../../src/utils/string';

test('buildName', () => {
  expect(buildName('!')).toEqual('unnamed');
  expect(buildName('??')).toEqual('unnamed');
  expect(buildName('hello-world')).toEqual('helloWorld');
  expect(buildName('hello-world123')).toEqual('helloWorld123');
  expect(buildName('123hello-world123')).toEqual('helloWorld123');
  expect(buildName('123hello-world123')).toEqual('helloWorld123');
  expect(buildName('[[[123hello-world123]]]')).toEqual('helloWorld123');
  expect(buildName('[[[123hello-world123]]]', true)).toEqual('HelloWorld123');
});

test('refToType', () => {
  expect(refToType('#/components/schemas/T')).toEqual<RefInfo>({
    type: 'T',
    base: '#/components/schemas/T',
    props: [],
  });
  expect(refToType('#/components/schemas/T/oo')).toEqual<RefInfo>({
    type: 'T',
    base: '#/components/schemas/T',
    props: ['oo'],
  });
  expect(refToType('#/components/schemas/T/oo/pp/qq')).toEqual<RefInfo>({
    type: 'T',
    base: '#/components/schemas/T',
    props: ['oo', 'pp', 'qq'],
  });
});

test('findOrigin', () => {
  // a -> b -> c -> d
  // x -> y
  const relation = new Map([
    ['a', 'b'],
    ['b', 'c'],
    ['c', 'd'],
    ['x', 'y'],
  ]);
  expect(findOrigin('a', relation)).toBe('d');
  expect(findOrigin('x', relation)).toBe('y');
  expect(findOrigin('y', relation)).toBe('y');
});

test('varString', () => {
  expect(varString('/a/b')).toEqual('/a/b');
  expect(varString('/a/b/{cc}')).toEqual('/a/b/${cc}');
  expect(varString('/a/b/{cc}/dd/{ee}')).toEqual('/a/b/${cc}/dd/${ee}');
});

test('toTypePath', () => {
  expect(toTypePath([])).toEqual('');
  expect(toTypePath(['a'])).toEqual('["a"]');
  expect(toTypePath(['a', 'b'])).toEqual('["a"]["b"]');
});
