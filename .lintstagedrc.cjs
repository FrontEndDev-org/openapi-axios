/**
 * lint-staged config
 * @ref https://www.npmjs.com/package/lint-staged
 */
module.exports = {
  '*.{cjs,mjs,ts,tsx}': 'eslint --fix',
  '*.{cjs,mjs,ts,tsx,html,css,scss}': 'prettier --write',
  '(package|tsconfig*).json': 'prettier --write',
};
