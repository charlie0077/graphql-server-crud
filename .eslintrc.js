module.exports = {
  env: {
    es6: true,
    node: true,
    "jest/globals": true
  },
  parser: 'babel-eslint',
  extends: [
    'standard'
  ],
  plugins: ['jest'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
  }
}
