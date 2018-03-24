module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    jest: true
  },
  extends: ['standard', 'plugin:vue/recommended'],
  globals: {
    window: true
  },
  rules: {
    'arrow-parens': 'off',
    'generator-star-spacing': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'spaced-comment': 'off',
    'eol-last': 'off',
    'space-before-function-paren': 'off',
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'prefer-promise-reject-errors': 'off',

    // vue-eslint-plugin
    // https://github.com/vuejs/eslint-plugin-vue
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
          normal: 'any',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    'vue/require-default-prop': 'off',
    'vue/attributes-order': ['off', {}],
    'vue/attribute-order': ['off', {}],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always'
      }
    ]
  }
}
