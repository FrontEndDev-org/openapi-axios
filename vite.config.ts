import { externalizeDeps } from 'vite-plugin-externalize-deps';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';
import pkg from './package.json';

/**
 * vite config
 * @ref https://vitejs.dev/
 * vitest config
 * @ref https://vitest.dev/
 */
export default defineConfig({
  plugins: [
    externalizeDeps(),
    dts({
      outputDir: 'dist-types',
    }),
  ],
  define: {
    'process.env.PKG_NAME': JSON.stringify(pkg.name),
    'process.env.PKG_VERSION': JSON.stringify(pkg.version),
  },
  build: {
    sourcemap: true,
    copyPublicDir: false,
    reportCompressedSize: false,
    lib: {
      entry: ['src/index.ts', 'src/helpers.ts'],
    },
    rollupOptions: {
      output: [
        {
          format: 'esm',
          dir: 'dist-esm',
          entryFileNames: '[name].mjs',
          chunkFileNames: '[name].mjs',
        },
        {
          format: 'cjs',
          dir: 'dist-cjs',
          entryFileNames: '[name].cjs',
          chunkFileNames: '[name].cjs',
        },
      ],
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
