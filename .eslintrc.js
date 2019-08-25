module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx'],
      },
    },
  },
  rules: {
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'no-public' }],
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-useless-constructor': 'error',
    'import/prefer-default-export': 'off',
    'no-continue': 'off',
    'no-empty-function': 'off',
    'no-plusplus': 'off',
    'no-useless-constructor': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/*'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      files: ['example/**/*'],
      parserOptions: {
        project: './example/tsconfig.json',
      },
      env: {
        browser: true,
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      },
    },
  ],
};
