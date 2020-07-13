const esModules = [
  'jest-test',
  '@ngrx',
  'ngx-bootstrap',
  '@angular/common/locales',
  'lodash-es/.*',
  'ngx-utils-cookies-port',
];

module.exports = {
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  preset: 'jest-preset-angular',
  roots: ['src', 'projects'],
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
  moduleNameMapper: {
    '^ish-(.*)$': '<rootDir>/src/app/$1',
    '^organization-management$': '<rootDir>/projects/organization-management/src/app/exports',
    '^requisition-management$': '<rootDir>/projects/requisition-management/src/app/exports',
  },
  snapshotSerializers: [
    './src/jest-serializer/AngularHTMLSerializer.js',
    './src/jest-serializer/CategoryTreeSerializer.js',
    './src/jest-serializer/NgrxActionSerializer.js',
    './src/jest-serializer/NgrxActionArraySerializer.js',
  ],
};
