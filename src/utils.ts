import chalk from 'chalk';
import * as process from 'process';

export function exitError(message: string) {
  console.log(chalk.redBright(message));
  process.exit(1);
}

export function normalizeError(err: unknown) {
  return typeof err === 'object' && err !== null && err instanceof Error ? err : new Error(String(err));
}

export async function tryCatch<T>(promise: Promise<T>): Promise<[Error | null, T | null]> {
  try {
    return [null, await promise];
  } catch (err) {
    return [normalizeError(err), null];
  }
}
