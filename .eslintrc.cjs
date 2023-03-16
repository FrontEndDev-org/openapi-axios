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
      files: ['*.mjs'],
      parserOptions: {
        sourceType: 'module',
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
