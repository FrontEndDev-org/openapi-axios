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
    sourcemap: true,
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
  },
  test: {
    globals: true,
    env: {
      PKG_NAME: 'pkg-name-for-test',
      PKG_VERSION: 'pkg-version-for-test',
    },
    coverage: {
      all: true,
      include: ['src/**/*.ts'],
      reporter: ['lcov', 'text'],
    },
  },
});
