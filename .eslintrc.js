module.exports = {
  env: {
      browser: true,
      es6: true,
  },
  extends: ['plugin:vue/essential'],
  globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
  },

  parserOptions: {
      parser: 'babel-eslint',
      sourceType: 'module',
      allowImportExportEverywhere: true,
      ecmaFeatures: {
          jsx: true,
          modules: true,
      },
  },
  plugins: ['vue'],
  rules: {
      'space-before-function-paren': 0,
  },
}
