'use strict';

const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  // Base recommended rules
  js.configs.recommended,

  {
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021 },
      ecmaVersion: 2021,
      sourceType: 'commonjs',
    },

    rules: {
      // ── Errors ──────────────────────────────────────────────────────
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'no-return-await': 'error',

      // ── Warnings ─────────────────────────────────────────────────────
      'no-console': ['warn'], // use logger instead
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'logs/**',
      'prisma/**',
      'scripts/**',
      'utils/seedData.js',
      'testConnection.js',
    ],
  },
];
