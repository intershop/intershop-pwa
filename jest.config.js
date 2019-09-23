const esModules = [
  'jest-test',
  '@ngrx',
  'ngx-bootstrap',
  '@angular/common/locales',
  'lodash-es/.*',
  '@ngx-utils/cookies',
];

module.exports = {
  moduleNameMapper: {
    '^ish-(.*)$': '<rootDir>/src/app/$1',
    '^ngrx-router$': '<rootDir>/src/ngrx-router',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!${esModules.join('|')})`],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
