const tsEslintPlugin = require('@typescript-eslint/eslint-plugin')
const tsEslintParser = require('@typescript-eslint/parser')
const prettierPlugin = require('eslint-plugin-prettier')

module.exports = [
    {
        files: ['**/*.ts'],
        ignores: ['dist', 'node_modules', 'coverage'],
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
            'prettier/prettier': 'off', // If you want to use prettier, you can enable this rule
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true,
                },
            ],
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
    },
]
