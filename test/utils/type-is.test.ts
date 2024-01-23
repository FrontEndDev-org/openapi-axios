import { isVarName } from '../../src/utils/type-is';

test('isVarName', () => {
    expect(isVarName('')).toBe(false);
    expect(isVarName('a')).toBe(true);
    expect(isVarName('$a')).toBe(true);
    expect(isVarName('_a')).toBe(true);
    expect(isVarName('1a')).toBe(false);
});
