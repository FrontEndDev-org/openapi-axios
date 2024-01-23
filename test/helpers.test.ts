import { resolveURL } from '../src/helpers';

test('resolveBaseURL', () => {
    expect(resolveURL('/', '/a/b')).toEqual('/a/b');
    expect(resolveURL('/api/v1', '/a/b')).toEqual('/api/v1/a/b');
    expect(resolveURL('https//example.com/api/v1', '/a/b')).toEqual('https//example.com/api/v1/a/b');
    expect(resolveURL('https//example.com/api/v1/', '/a/b')).toEqual('https//example.com/api/v1/a/b');
    expect(resolveURL('https//example.com/api/v1////', '/////a/b')).toEqual('https//example.com/api/v1/a/b');
});
