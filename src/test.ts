require('jest-preset-angular');
require('jest-extended');
import { getTestBed } from '@angular/core/testing';

import { IconModule } from './app/core/icon.module';

beforeAll(() => IconModule.init());

beforeEach(() => {
  // tslint:disable-next-line: no-any
  getTestBed().configureCompiler({ preserveWhitespaces: false } as any);
});

afterEach(() => jest.clearAllTimers());

Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
});
