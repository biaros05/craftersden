import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  { ignores: ['dist'] },
  jsdoc.configs['flat/recommended-error'],
  {
    files: ['**.*{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      jsdoc
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // ADDITIONAL RULES
      'react/prop-types': 'off',
      ////////// Possible Errors //////////
      'no-console': ['warn', { 'allow': ['error', 'debug'] }],
      'one-var': ['warn', 'never'],
      'no-undef': 'warn',
      'prefer-const': 'warn',
      'no-extra-parens': 'warn',
      'block-scoped-var': 'warn',
      'curly': ['warn', 'multi-line'],
      'no-await-in-loop': 'warn',
      'no-cond-assign': ['error', 'always'],
      'no-debugger': 'warn',
      'default-case': 'warn',
      'dot-location': ['warn', 'object'],
      'eqeqeq': 'warn',
      'no-alert': 'warn',
      'no-eq-null': 'warn',
      'no-eval': 'warn',
      'no-implicit-coercion': 'warn',
      'no-lone-blocks': 'error',
      'no-loop-func': 'warn',
      'no-multi-str': 'warn',
      'no-self-compare': 'warn',
      'strict': ['warn', 'global'],
      'no-lonely-if': 'warn',
      ////////// Style for Graded Submissions //////////
      'array-bracket-spacing': ['error', 'never'],
      'array-bracket-newline': ['error', 'consistent'],
      'indent': ['error', 2],
      'camelcase': 'error',
      'comma-spacing': ['error', { 'before': false, 'after': true }],
      'comma-style': ['error', 'last'],
      'brace-style': ['error'],
      'max-len': ['error', 100],
      'no-inline-comments': 'error',
      'no-tabs': 'error',
      'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
      'jsx-quotes': ['error', 'prefer-double'],
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'semi': 'error',
      'semi-spacing': 'error',
      'jsdoc/require-description': 'warn',
      'react/no-unknown-property': ['error', { 'ignore': ['args'] }],
    },
  },
];
