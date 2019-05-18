require('jest-preset-angular');
require('jest-extended');
import { getTestBed } from '@angular/core/testing';
import * as prettier from 'prettier';

import { IconModule } from './app/core/icon.module';

beforeAll(() => IconModule.init());

class AngularHTMLSerializer implements jest.SnapshotSerializerPlugin {
  print(val: Element): string {
    let source: string;
    if (val.getAttribute('ng-version')) {
      source = val.innerHTML;
    } else {
      const tmp = document.createElement('div');
      tmp.appendChild(val);
      source = tmp.innerHTML;
    }
    source = source.replace(/\n/g, '').replace(/<!\-\-.*?\-\->/g, '');
    const result = prettier
      .format(source, { parser: 'html', printWidth: 100 })
      .replace(/^\s*$/g, '')
      .trim();
    return result || 'N/A';
  }
  test(val: Element): boolean {
    return val instanceof Element;
  }
}

beforeEach(() => {
  // tslint:disable-next-line: no-any
  getTestBed().configureCompiler({ preserveWhitespaces: false } as any);

  jest.spyOn(global.console, 'warn').mockImplementation(arg => {
    if (typeof arg !== 'string' || !arg.startsWith('Navigation triggered outside Angular zone')) {
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
