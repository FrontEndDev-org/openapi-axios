import { axiosImportDefault } from './const';
import { Config, UserConfig } from './types';

export const defaults: Config = {
  cwd: process.cwd(),
  dest: 'src/apis',
  axiosImport: axiosImportDefault,
  unwrapResponseData: false,
  list: [],
};

export function defineConfig(config: UserConfig) {
  return Object.assign({}, defaults, config);
}
