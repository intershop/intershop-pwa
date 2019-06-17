module.exports = {
  preset: 'jest-preset-angular',
  roots: ['src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(@ngrx|ngx-bootstrap|@angular/common/locales|lodash-es/.*|@ngx-utils/cookies))',
  ],
  moduleNameMapper: {
    '^ish-core(.*)$': '<rootDir>/src/app/core$1',
    '^ngrx-router$': '<rootDir>/src/ngrx-router',
  },
};
