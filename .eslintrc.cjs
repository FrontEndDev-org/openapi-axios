const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,

  env: {
    browser: true,
    node: true,
    es2022: true,
  },

  overrides: [
    {
      files: ['*.cjs'],
      extends: [
        //
        'eslint:recommended',
      ],
      rules: {
        'prettier/prettier': 'error',
      },
    },
    {
      files: ['*.mjs'],
      parserOptions: {
        sourceType: 'module',
      },
      extends: [
        //
        'eslint:recommended',
      ],
      rules: {
        'prettier/prettier': 'error',
      },
    },
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        //
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        'prettier/prettier': 'error',
      },
    },
  ],
});
