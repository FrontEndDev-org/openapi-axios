import typescript from '@rollup/plugin-typescript';

/** @type {import('rollup').RollupOptions} */
export default {
  input: ['src/index.ts', 'src/helpers.ts'],
  output: [
    {
      format: 'esm',
      dir: 'dist-mjs',
      entryFileNames: '[name].mjs',
      sourcemap: true,
    },
    {
      format: 'cjs',
      dir: 'dist-cjs',
      entryFileNames: '[name].cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
    }),
  ],
};
