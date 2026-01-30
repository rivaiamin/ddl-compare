module.exports = {
    env: {
        browser: true,
        node: true,
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
        'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
        'no-console': ['warn'],
        'no-trailing-spaces': ['error'],
        'eol-last': ['error', 'always']
    },
    globals: {
        'DDLParser': 'readonly',
        'SchemaComparator': 'readonly',
        'Prism': 'readonly',
        // Utility functions from utils.js
        'readFile': 'readonly',
        'formatFileSize': 'readonly',
        'validateSqlFile': 'readonly',
        'showToast': 'readonly',
        'showError': 'readonly',
        'clearError': 'readonly',
        'setLoadingState': 'readonly',
        // UI handler functions
        'processFiles': 'readonly',
        'copyToClipboard': 'readonly',
        'downloadScript': 'readonly',
        'initializeUI': 'readonly'
    },
    overrides: [
        {
            files: ['tests/**/*.js'],
            globals: {
                'SchemaComparator': 'readonly'
            }
        }
    ]
};
