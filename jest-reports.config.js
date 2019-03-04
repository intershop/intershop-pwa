module.exports = {
  preset: 'jest-preset-angular',
  roots: ['src'],
  setupTestFrameworkScriptFile: '<rootDir>/src/test.ts',
  transformIgnorePatterns: ['node_modules/(?!(@ngrx|ngx-bootstrap|@angular/common/locales|lodash-es/.*))'],
  moduleNameMapper: {
    '^ish-core(.*)$': '<rootDir>/src/app/core$1',
  },
  collectCoverage: true,
  coverageDirectory: 'reports/coverage',
  coverageReporters: ['html'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'Intershop Progressive Webapp Unit Tests',
        output: 'reports/junit.xml',
      },
    ],
    [
      'jest-html-reporter',
      {
        pageTitle: 'Intershop Progressive Webapp Unit Test Report',
        outputPath: 'reports/unit-tests.html',
        includeFailureMsg: true,
        sort: 'status',
      },
    ],
  ],
};
