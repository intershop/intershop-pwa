/* eslint-disable ish-custom-rules/ordered-imports */
// import zone.js before any @angular imports to avoid problems with fakeAsync in tests
import 'zone.js';
import 'zone.js/testing';
import { CompilerOptions } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import '@angular/localize/init';
import * as matchers from 'jest-extended';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

expect.extend(matchers);

setupZoneTestEnv();

beforeEach(() => {
  const compilerOptions: CompilerOptions = { preserveWhitespaces: false };
  getTestBed().configureCompiler(compilerOptions);

  const logFunction = global.console.log;
  global.console.log = (...args: unknown[]) => {
    if (
      args?.some(
        arg => arg instanceof Error || (typeof arg === 'string' && arg.startsWith('@ngrx/store: The feature name'))
      )
    ) {
      fail(...args);
    }
    logFunction(...args);
  };

  global.console.error = (...args: unknown[]) => {
    fail(...args);
  };

  jest.spyOn(global.console, 'warn').mockImplementation(arg => {
    if (
      typeof arg !== 'string' ||
      !(
        arg.startsWith('Navigation triggered outside Angular zone') ||
        arg.startsWith('A router outlet has not been instantiated during routes activation. URL Segment:') ||
        arg.startsWith('PayPal')
      )
    ) {
      // eslint-disable-next-line no-console
      console.log(arg);
    }
  });
});

let ssr = false;

Object.defineProperty(global, 'SSR', {
  get: () => ssr,
});

describe.onSSREnvironment = (name: string, fn?: jest.EmptyFunction) =>
  // eslint-disable-next-line jest/valid-title
  describe(name, () => {
    beforeAll(() => {
      ssr = true;
    });
    fn();
    afterAll(() => {
      ssr = false;
    });
  });

Object.defineProperty(global, 'PRODUCTION_MODE', {
  get: () => false,
});

Object.defineProperty(global, 'NGRX_RUNTIME_CHECKS', {
  get: () => true,
});

Object.defineProperty(global, 'THEME', {
  get: () => 'default',
});

Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
});

// jsdom does not implement window.matchMedia which is required e.g. by Swiper
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: undefined,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
