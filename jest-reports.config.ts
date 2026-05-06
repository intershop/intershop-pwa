/* eslint-disable ish-custom-rules/ordered-imports */
import type { Config } from 'jest';
// @ts-expect-error TS5097: Jest resolves .ts config imports natively
import baseConfig from './jest.config.ts';

export default {
  ...baseConfig,
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
} satisfies Config;
