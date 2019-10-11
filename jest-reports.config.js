module.exports = {
  ...require('./jest.config'),
  collectCoverage: true,
  coverageDirectory: 'reports/coverage',
  coverageReporters: ['html'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'Intershop Progressive Webapp Unit Tests',
        outputDirectory: 'reports',
        outputName: 'junit.xml',
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
