import {
  buildName,
  findOrigin,
  joinSlices,
  nextUniqueName,
  RefInfo,
  refToType,
  toTypePath,
  varString,
} from '../../src/utils/string';

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
  expect(varString('/a/b/{cc}/dd/{ee}', 'path')).toEqual('/a/b/${path.cc}/dd/${path.ee}');
  expect(varString('/a/b/{cc}/dd/{ee}/ff/{-ff-}', 'path')).toEqual('/a/b/${path.cc}/dd/${path.ee}/ff/${path["-ff-"]}');
});

test('toTypePath', () => {
  expect(toTypePath([])).toEqual('');
  expect(toTypePath(['a'])).toEqual('["a"]');
  expect(toTypePath(['a', 'b'])).toEqual('["a"]["b"]');
});

test('joinSlices', () => {
  expect(joinSlices(['', undefined, ''])).toEqual('');
  expect(joinSlices(['1', undefined, '2', ''])).toEqual('1\n2');
});

test('nextUniqueName', () => {
  const map = new Map<string, number>();
  expect(nextUniqueName('abc', map)).toBe('abc');
  expect(nextUniqueName('abc', map)).toBe('abc2');
  expect(nextUniqueName('abc', map)).toBe('abc3');
  expect(nextUniqueName('abc2', map)).toBe('abc4');
});
