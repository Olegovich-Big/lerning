module.exports = {
  root: true,
  extends: [
    'react-app',
    'plugin:react-hooks/recommended'
  ],
  plugins: [
    'react-hooks',
    'react-hooks-addons'
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks-addons/no-unused-deps': 'warn',
    'react-hooks-addons/no-unnecessary-deps': 'warn'
  }
}; 