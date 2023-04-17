import path from 'path';
import nodeExternals from 'vite-plugin-node-externals';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodeExternals(),
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
      entry: ['src/index.ts', 'src/helpers.ts'],
      formats: ['es', 'cjs'],
      fileName(format, entryName) {
        const ext = format === 'es' ? '.mjs' : '.cjs';
        const basename = path.basename(entryName, '.ts');
        return `${basename}${ext}`;
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
