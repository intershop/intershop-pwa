const esModules = [
  'jest-test',
  '@ngrx',
  'ngx-bootstrap',
  '@angular/common/locales',
  'lodash-es/.*',
  '@ngx-utils/cookies',
];

module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: '<rootDir>/tsconfig.spec.json',
    },
    __TRANSFORM_HTML__: true,
  },
  preset: 'jest-preset-angular',
  roots: ['src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
  moduleNameMapper: {
    '^ish-(.*)$': '<rootDir>/src/app/$1',
  },
  snapshotSerializers: [
    './src/jest-serializer/AngularHTMLSerializer.js',
    './src/jest-serializer/CategoryTreeSerializer.js',
    './src/jest-serializer/NgrxActionSerializer.js',
    './src/jest-serializer/NgrxActionArraySerializer.js',
  ],
};
