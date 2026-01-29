module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'script'
    },
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-unused-vars': ['warn'],
        'no-console': ['warn'],
        'no-trailing-spaces': ['error'],
        'eol-last': ['error', 'always']
    },
    globals: {
        'DDLParser': 'readonly',
        'SchemaComparator': 'readonly',
        'Prism': 'readonly'
    }
};
