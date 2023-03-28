import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import * as process from 'process';

export function isString(any: unknown): any is string {
  return typeof any === 'string';
}

export function isBoolean(any: unknown): any is boolean {
  return typeof any === 'boolean';
}

export function isNumber(any: unknown): any is number {
  return typeof any === 'number';
}

export function isObject(any: unknown): any is object {
  return typeof any === 'object' && any !== null;
}

export function isDate(any: unknown): any is Date {
  return Boolean(any && any instanceof Date);
}

export async function isFile(p: string) {
  try {
    const state = await fs.stat(p);
    return state.isFile();
  } catch (err) {
    return false;
  }
}

export async function cleanDir(p: string) {
  await fs.rm(p, { recursive: true, force: true });
}

export function exitError(message: string) {
  console.log(chalk.redBright(message));

  /* istanbul ignore if */
  if (!process.env.VITEST) {
    process.exit(1);
  }
}

export function normalizeError(err: unknown) {
  return typeof err === 'object' && err !== null && err instanceof Error ? err : new Error(String(err));
}

export function syncPromise<T>(syncFunc: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      resolve(syncFunc());
    } catch (err) {
      reject(err);
    }
  });
}

export async function tryCatch<T>(promise: Promise<T>): Promise<[Error | null, T | null]> {
  try {
    return [null, await promise];
  } catch (err) {
    return [normalizeError(err), null];
  }
}
