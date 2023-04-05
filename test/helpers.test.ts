import { ContentKind, formatBody, formatHeaders, isBlob } from '../src/helpers';

test('formatHeaders', () => {
  expect(formatHeaders(ContentKind.JSON)).toEqual({ 'Content-Type': 'application/json' });
  expect(formatHeaders(ContentKind.OTHER)).toBeUndefined();
});

test('isBlob', () => {
  expect(isBlob('')).toBeFalsy();
  expect(isBlob(new Blob())).toBeTruthy();
});

test('formatBody', () => {
  const body = {
    a: 1,
    b: '2',
    c: new Blob([]),
    d: [true, null, undefined],
    e: new Date(2000, 1, 1, 1, 1, 1, 1),
  };

  expect(formatBody(ContentKind.JSON, body)).toEqual(JSON.stringify(body));
  expect(formatBody(ContentKind.URL_ENCODED, body)).toMatchInlineSnapshot(
    '"a=1&b=2&c=%5Bobject+Blob%5D&d=true%2C%2C&e=Tue+Feb+01+2000+01%3A01%3A01+GMT%2B0800+%28China+Standard+Time%29"'
  );
  expect((formatBody(ContentKind.FORM_DATA, body) as FormData).append).toBeTypeOf('function');
  expect(formatBody(ContentKind.TEXT, body)).toEqual(JSON.stringify(body));
  expect(formatBody(ContentKind.OTHER, body)).toEqual(JSON.stringify(body));
});
