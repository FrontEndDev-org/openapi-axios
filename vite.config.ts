import { externalizeDeps } from 'vite-plugin-externalize-deps';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    externalizeDeps(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  define: {
    'process.env.PKG_NAME': JSON.stringify(pkg.name),
    'process.env.PKG_VERSION': JSON.stringify(pkg.version),
  },
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        helpers: 'src/helpers.ts',
      },
      formats: ['es', 'cjs'],
      fileName(format, entryName) {
        return entryName + (format === 'es' ? '.mjs' : '.cjs');
      },
    },
    modulePreload: false,
    sourcemap: true,
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
