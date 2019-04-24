require('jest-preset-angular');
require('jest-extended');
import { getTestBed } from '@angular/core/testing';

import { IconModule } from './app/core/icon.module';

beforeAll(() => IconModule.init());

class AngularHTMLSerializer implements jest.SnapshotSerializerPlugin {
  print(val: HTMLElement, serialize: (val: HTMLElement) => string): string {
    val.removeAttribute('ng-version');
    return serialize(val);
  }
  test(val: HTMLElement): boolean {
    return val instanceof HTMLElement && !!val.getAttribute('ng-version');
  }
}

beforeEach(() => {
  // tslint:disable-next-line: no-any
  getTestBed().configureCompiler({ preserveWhitespaces: false } as any);

  jest.spyOn(global.console, 'warn').mockImplementation(arg => {
    if (arg && !arg.startsWith('Navigation triggered outside Angular zone')) {
      // tslint:disable-next-line:no-console
      console.log(arg);
    }
  });

  expect.addSnapshotSerializer(new AngularHTMLSerializer());
});

afterEach(() => jest.clearAllTimers());

Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
});
