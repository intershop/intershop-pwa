module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 400],
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 400],
    'header-max-length': [2, 'always', 200],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'perf', 'docs', 'style', 'i18n', 'refactor', 'test', 'build', 'deps', 'ci', 'chore', 'temp'],
    ],
  },
};
