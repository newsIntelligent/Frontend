module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier' // prettier와 충돌 방지
  ],
  plugins: ['react', '@typescript-eslint'],
  settings: {
    react: { version: 'detect' }
  },
  rules: {
    'react/react-in-jsx-scope': 'off', 
    '@typescript-eslint/no-unused-vars': 'warn' 
  }
}