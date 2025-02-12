import { sortingByDeps } from '../../src/printer/helpers';

it('sortingByDeps', () => {
  const zodList = sortingByDeps([
    { name: 'a', deps: ['b', 'c'] },
    { name: 'b', deps: [] },
    { name: 'c', deps: ['d'] },
    { name: 'd', deps: [] },
  ]);
  expect(zodList).toEqual([
    { name: 'b', deps: [] },
    { name: 'd', deps: [] },
    { name: 'c', deps: ['d'] },
    { name: 'a', deps: ['b', 'c'] },
  ]);
});
