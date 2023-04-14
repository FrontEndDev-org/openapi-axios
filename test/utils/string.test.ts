import { buildName, RefInfo, refToTypeName } from '../../src/utils/string';

test('buildName', () => {
  expect(buildName('!')).toEqual('untitled');
  expect(buildName('??')).toEqual('untitled');
  expect(buildName('hello-world')).toEqual('helloWorld');
  expect(buildName('hello-world123')).toEqual('helloWorld123');
  expect(buildName('123hello-world123')).toEqual('helloWorld123');
  expect(buildName('123hello-world123')).toEqual('helloWorld123');
  expect(buildName('[[[123hello-world123]]]')).toEqual('helloWorld123');
  expect(buildName('[[[123hello-world123]]]', true)).toEqual('HelloWorld123');
});

test('refToTypeName', () => {
  expect(refToTypeName('#/components/schemas/T')).toEqual<RefInfo>({
    type: 'T',
    props: [],
  });
  expect(refToTypeName('#/components/schemas/T/oo')).toEqual<RefInfo>({
    type: 'T',
    props: ['oo'],
  });
  expect(refToTypeName('#/components/schemas/T/oo/pp/qq')).toEqual<RefInfo>({
    type: 'T',
    props: ['oo', 'pp', 'qq'],
  });
});
