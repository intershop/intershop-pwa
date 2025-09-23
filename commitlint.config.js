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
      ['feat', 'fix', 'perf', 'docs', 'test', 'i18n', 'style', 'refactor', 'build', 'ci', 'chore', 'temp', 'revert'],
    ],
  },
  prompt: {
    questions: {
      type: {
        enum: {
          feat: {
            description: 'A new feature (results in changelog entry)',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'A bug fix (results in changelog entry)',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          perf: {
            description: 'A code change that improves performance (results in changelog entry)',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          docs: {
            description: 'Documentation only changes (results in changelog entry)',
            title: 'Documentation',
            emoji: '📚',
          },
          test: {
            description: 'Adding missing tests or correcting existing tests',
            title: 'Tests',
            emoji: '🧪',
          },
          i18n: {
            description: 'Localization changes',
            title: 'Localization',
            emoji: '🌐',
          },
          style: {
            description: 'Changes that do not affect the meaning of the code (white-space, formatting, etc)',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: 'A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          build: {
            description: 'Changes that affect the build system or external dependencies',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description: 'Changes to the CI configuration files and scripts',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: "Other changes that don't fit the other types",
            title: 'Chores',
            emoji: '♻️',
          },
          temp: {
            description: 'Temporary commits that will be removed before merging',
            title: 'Temporary',
            emoji: '🗑️',
          },
          revert: {
            description: 'Reverts a previous commit',
            title: 'Reverts',
            emoji: '💥',
          },
        },
      },
    },
  },
};
