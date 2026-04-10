/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'jest';
import { createCjsPreset } from 'jest-preset-angular/presets/index.js';

const fs = require('fs');

const { pathsToModuleNameMapper } = require('ts-jest');

const tsConfig = require('comment-json').parse(fs.readFileSync('./tsconfig.json', { encoding: 'utf-8' }));

const esModules = [
  'lodash-es/.*',
  'swiper',
  'ssr-window',
  'dom7',
  'uuid',
  'rxjs',
  '@angular/common/locales/.*\\.js$',
  '.*\\.mjs$',
];

export default {
  globals: {
    SSR: false,
  },
  ...createCjsPreset(),
  testRunner: 'jest-jasmine2',
  maxWorkers: process.env.JEST_MAX_WORKERS || '75%', // keep some cpu for moving the mouse
  roots: ['src', 'projects'],
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
  modulePaths: [tsConfig.compilerOptions.baseUrl],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>' }),
    '^swiper_angular$': '<rootDir>/node_modules/swiper/angular/fesm2015/swiper_angular.mjs',
  },
  snapshotSerializers: [
    './src/jest-serializer/AngularHTMLSerializer.js',
    './src/jest-serializer/CategoryTreeSerializer.js',
    './src/jest-serializer/NgrxActionSerializer.js',
    './src/jest-serializer/NgrxActionArraySerializer.js',
  ],
  dependencyExtractor: '<rootDir>/jest.dependency-extractor.js',
} satisfies Config;
