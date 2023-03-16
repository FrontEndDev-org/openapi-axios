import { axiosImportDefault } from './const';
import { StrictConfig, UserConfig } from './types';

export const defaults: StrictConfig = {
  cwd: process.cwd(),
  dest: 'src/apis',
  axiosImport: axiosImportDefault,
  unwrapResponseData: false,
  list: [],
};

export function defineConfig(config: UserConfig) {
  return Object.assign({}, defaults, config) as StrictConfig;
}
