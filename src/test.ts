require('jest-preset-angular');
require('jest-extended');
import { getTestBed } from '@angular/core/testing';
beforeEach(() => {
  // tslint:disable-next-line: no-any
  getTestBed().configureCompiler({ preserveWhitespaces: false } as any);
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
});
