import typescript from '@rollup/plugin-typescript';

export default {
  input: ['src/index.ts', 'src/helpers.ts'],
  output: [
    {
      format: 'esm',
      dir: 'dist-mjs',
      entryFileNames: '[name].mjs',
    },
    {
      format: 'cjs',
      dir: 'dist-cjs',
      entryFileNames: '[name].cjs',
    },
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
    }),
  ],
};
