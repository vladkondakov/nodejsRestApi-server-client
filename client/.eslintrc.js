module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2020: true,
    jquery: true,
  },
  extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
  plugins: ['prettier'],
  globals: {
    _: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  parser: 'babel-eslint',
  rules: {
    'import/extensions': ['error', 'ignorePackages', { js: 'always', jsx: 'never' }],
    'no-restricted-syntax': ['off', 'ForOfStatement'],
    'no-await-in-loop': 'off',
    'dot-notation': ['off'],
    'no-console': 'off',
    'no-continue': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        trailingComma: 'es5',
      },
    ],
  },
};
