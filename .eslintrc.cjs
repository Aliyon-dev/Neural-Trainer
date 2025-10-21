/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'perfectionist'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:perfectionist/recommended-natural',
    'prettier',
  ],
  ignorePatterns: ['dist', 'build', 'node_modules'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};

