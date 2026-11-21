const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
    expoConfig,
    { ignores: ['dist/**', '.expo/**'] },
    {
        files: ['src/context/AuthProvider.jsx'],
        rules: { 'react-hooks/set-state-in-effect': 'off' },
    },
]);
