module.exports = {
  '(src|test)/*.{cjs,mjs,ts,tsx}': 'eslint --fix',
  '*.{cjs,mjs,ts,tsx,html,css,scss}': 'prettier --write',
  '(package|tsconfig*).json': 'prettier --write',
};
