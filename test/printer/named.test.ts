import { Named } from '../../src/printer/Named';

it('prepare', () => {
  const named = new Named();

  const v1 = named.prepareVarName('aa-bb');
  const v2 = named.prepareVarName('aa-bb');

  expect(v1).toBe(v2);
});

it('nextVarName', () => {
  const named = new Named();

  const v1 = named.nextVarName('aa-bb');
  const v2 = named.nextVarName('aa-bb');

  expect(v1).not.toBe(v2);
});

it('nextTypeName', () => {
  const named = new Named();

  const v1 = named.nextTypeName('aa-bb');
  const v2 = named.nextTypeName('aa-bb');

  expect(v1).not.toBe(v2);
});
