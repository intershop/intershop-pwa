module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature (-> changelog)' },
    { value: 'fix', name: 'fix:      A bug fix (-> changelog)' },
    {
      value: 'perf',
      name: 'perf:     A code change that improves performance (-> changelog)',
    },
    { value: 'docs', name: 'docs:     Documentation changes (-> changelog)' },
    {
      value: 'style',
      name:
        'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)',
    },
    { value: 'i18n', name: 'i18n:     Localization changes' },
    {
      value: 'refactor',
      name: 'refactor: A code change that neither fixes a bug nor adds a feature',
    },
    { value: 'test', name: 'test:     Fixing or adding tests' },
    { value: 'build', name: 'build:    Anything build-releated' },
    { value: 'deps', name: 'deps:     Dependency updates' },
    {
      value: 'chore',
      name: 'chore:    Anything else...',
    },
  ],

  // scopes: [{ name: 'default' }, { name: 'tslint-rules' }, { name: 'schematics' }, { name: 'e2e' }],

  isTicketNumberRequired: false,
  ticketNumberPrefix: '#',
  ticketNumberRegExp: '\\d{1,5}',

  // override the messages, defaults are as follows
  messages: {
    type: "Select the type of change that you're committing:",
    // scope: '\nDenote the SCOPE of this change (optional):',
    // customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },

  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix', 'refactor'],
  skipQuestions: ['scope'],

  breaklineChar: '|', // It is supported for fields body and footer.
  footerPrefix: 'Closes ',
  breakingPrefix: 'BREAKING CHANGES: ',
};
