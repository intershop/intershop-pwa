// tslint:disable:ish-ordered-imports
require('jest-preset-angular');
require('jest-extended');
import { getTestBed } from '@angular/core/testing';

beforeEach(() => {
  // tslint:disable-next-line: no-any
  getTestBed().configureCompiler({ preserveWhitespaces: false } as any);

  jest.spyOn(global.console, 'warn').mockImplementation(arg => {
    if (typeof arg !== 'string' || !arg.startsWith('Navigation triggered outside Angular zone')) {
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

// fix for TypeError, see https://github.com/telerik/kendo-angular/issues/1505#issuecomment-385882188
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});
