import { createRequire } from 'node:module';
import externals from 'rollup-plugin-node-externals';

import dts from 'vite-plugin-dts';
// https://cn.vitest.dev/config/
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);

const pkg = require('./package.json');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    {
      ...externals(),
      enforce: 'pre',
    },
  ],
  define: {
    'process.env.PKG_NAME': JSON.stringify(pkg.name),
    'process.env.PKG_VERSION': JSON.stringify(pkg.version),
  },
  build: {
    lib: {
      entry: ['src/index.ts', 'src/helpers.ts'],
      formats: ['es', 'cjs'],
    },
    modulePreload: false,
    sourcemap: false,
    minify: false,
    copyPublicDir: false,
    outDir: 'dist',
  },
  test: {
    globals: true,
    env: {
      PKG_NAME: 'pkg-name-for-test',
      PKG_VERSION: 'pkg-version-for-test',
    },
    coverage: {
      reporter: ['lcov', 'text'],
      // 包含所有源文件的覆盖率，而不是仅被单测的部分
      all: true,
    },
  },
});
