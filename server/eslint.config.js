const tsEslintPlugin = require('@typescript-eslint/eslint-plugin')
const tsEslintParser = require('@typescript-eslint/parser')
const prettierPlugin = require('eslint-plugin-prettier')

module.exports = [
    {
        files: ['**/*.ts'],
        ignores: ['node_modules', 'dist'],
        languageOptions: {
            parser: tsEslintParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
            },
            globals: {
                console: 'readonly',
                module: 'readonly',
                process: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsEslintPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
    },
]
