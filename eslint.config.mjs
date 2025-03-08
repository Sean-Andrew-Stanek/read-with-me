// eslint.config.mjs

/* eslint-disable import/no-anonymous-default-export */
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: ['**/.eslintrc.js']
    },
    ...compat.extends(
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'next/core-web-vitals',
        'plugin:react/jsx-runtime'
    ),
    {
        plugins: {
            react,
            '@typescript-eslint': typescriptEslint
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2021,
            sourceType: 'module',

            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname
            }
        },

        settings: {
            react: {
                version: 'detect'
            }
        },

        rules: {
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                    allowExpressions: false,
                    allowTypedFunctionExpressions: true
                }
            ],

            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/no-explicit-any': 'error',

            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],

            'no-console': 'error',

            'react/function-component-definition': [
                'error',
                {
                    namedComponents: 'arrow-function',
                    unnamedComponents: 'arrow-function'
                }
            ],

            'no-restricted-globals': [
                'warn',
                {
                    name: 'fetch',
                    message: 'Use secureFetch if you need the token.'
                }
            ],
            'prefer-arrow-callback': ['error', { allowNamedFunctions: false }]
        }
    }
];
