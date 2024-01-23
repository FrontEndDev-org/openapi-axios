import { Named } from '../../src/parsers/Named';

test('named', () => {
    const named = new Named();

    named.internalName('Internal');
    expect(named.nextTypeName('Internal', true)).toEqual('Internal2');

    expect(named.nextTypeName('-', true)).toEqual('Unnamed');
    expect(named.nextTypeName('!', true)).toEqual('Unnamed2');

    expect(named.nextTypeName('A', true)).toEqual('A');
    expect(named.nextTypeName('A!', true)).toEqual('A2');

    expect(named.nextTypeName('aa', true)).toEqual('Aa');
    expect(named.nextTypeName('aa!', true)).toEqual('Aa2');
    expect(named.nextTypeName('aa!!', true)).toEqual('Aa3');

    expect(named.nextOperationId('get', '/path/to/foo')).toEqual('getFoo');
    expect(named.nextOperationId('get', '/path/to/foo')).toEqual('getFoo2');
    expect(named.nextOperationId('get', '/path/to/foo', 'foo')).toEqual('foo');
    expect(named.nextOperationId('get', '/path/to/foo', 'foo')).toEqual('foo2');
    expect(named.nextOperationId('get', '/path/to/foo')).toEqual('getFoo3');

    expect(named.nextOperationId('', '', 'xx')).toEqual('xx');
    expect(named.nextOperationId('', '', 'xx')).toEqual('xx2');

    named.internalName('export');
    expect(named.nextOperationId('', '', 'export')).toEqual('export2');
    expect(named.nextOperationId('', '', 'export')).toEqual('export3');

    // A -> A!(A2) -> aa!!/1/2 == A -> aa!!/1/2(Aa3)
    const a1 = named.addAlias({
        kind: 'alias',
        refAble: true,
        required: true,
        name: 'A',
        ref: '#/components/schemas/A!',
        target: '',
        origin: '',
        props: [],
    });
    // A!(A2) -> aa!!/1/2(Aa3)
    const a2 = named.addAlias({
        kind: 'alias',
        refAble: true,
        required: true,
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
