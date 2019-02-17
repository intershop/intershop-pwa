require('jest-preset-angular');
require('jest-extended');
import { getTestBed } from '@angular/core/testing';

import { IconModule } from './app/core/icon.module';

beforeAll(() => IconModule.init());

beforeEach(() => {
  // tslint:disable-next-line: no-any
  getTestBed().configureCompiler({ preserveWhitespaces: false } as any);

  jest.spyOn(global.console, 'warn').mockImplementation(arg => {
    if (arg && !arg.startsWith('Navigation triggered outside Angular zone')) {
      // tslint:disable-next-line:no-console
      console.log(arg);
    }
  });
});

afterEach(() => jest.clearAllTimers());

Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
});
