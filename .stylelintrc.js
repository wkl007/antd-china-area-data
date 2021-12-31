module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order',
    'stylelint-config-prettier',
    'stylelint-config-html',
  ],
  plugins: ['stylelint-order'],
  overrides: [
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
  ],
  rules: {
    'no-empty-source': null,
    'selector-pseudo-class-no-unknown': null,
    'no-descending-specificity': null,
    'at-rule-no-unknown': null,
    'font-family-no-missing-generic-family-keyword': null,
    'selector-type-no-unknown': null,
    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    'font-family-name-quotes': null,
  },
}
