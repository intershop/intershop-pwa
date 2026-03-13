const fs = require('fs');
const { pathsToModuleNameMapper } = require('ts-jest');

const tsConfig = require('comment-json').parse(fs.readFileSync('./tsconfig.json', { encoding: 'utf-8' }));

const esModules = ['lodash-es/.*', 'swiper', 'ssr-window', 'dom7', 'uuid', '.*\\.mjs$'];
const { defaultTransformerOptions } = require('jest-preset-angular/presets');

/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        ...defaultTransformerOptions,
      },
    ],
  },
  preset: 'jest-preset-angular',
  testRunner: 'jest-jasmine2',
  maxWorkers: process.env.JEST_MAX_WORKERS || '75%', // keep some cpu for moving the mouse
  roots: ['src', 'projects'],
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>' }),
  },
  snapshotSerializers: [
    './src/jest-serializer/AngularHTMLSerializer.js',
    './src/jest-serializer/CategoryTreeSerializer.js',
    './src/jest-serializer/NgrxActionSerializer.js',
    './src/jest-serializer/NgrxActionArraySerializer.js',
  ],
  dependencyExtractor: '<rootDir>/jest.dependency-extractor.js',
};
