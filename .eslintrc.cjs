module.exports = {
  env: { browser: true, es2020: true },
  extends: ['plugin:react/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 'error',
    'react/prop-types': ['off'],
    'react/display-name': ['off'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
  },
};
