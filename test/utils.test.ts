import { describe, expect, test } from 'vitest';
import { exitError, normalizeError, tryCatch } from '../src/utils';

test('Hello', () => {
  exitError('Hello');
});

test('normalizeError', () => {
  expect(normalizeError(1).message).toBe('1');
  const err1 = new Error('1');
  const err2 = normalizeError(err1);
  expect(err2).toBe(err1);
});

describe('tryCatch', async () => {
  const createPromise = () => {
    return (res: number, rej: number) =>
      new Promise((resolve, reject) => {
        if (rej) return reject(normalizeError(rej));
        resolve(res);
      });
  };

  const promise = createPromise();

  test('try', async () => {
    const res = Math.random() + 1;
    const [e, p] = await tryCatch(promise(res, 0));
    expect(e).toBeNull();
    expect(p).toBe(res);
  });

  test('catch', async () => {
    const rej = Math.random() + 1;
    const [e, p] = await tryCatch(promise(0, rej));
    expect((e as Error).message).toBe(rej.toString());
    expect(p).toBeNull();
  });
});
