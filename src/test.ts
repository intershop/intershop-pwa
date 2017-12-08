// This file is required by karma.conf.js and loads recursively all the .spec and framework files
// tslint:disable:ordered-imports
// The order of zone.js imports is important. Angular imports must come after zone.js imports.
import 'zone.js/dist/zone.js';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
// tslint:disable-next-line: do-not-import-environment
import { environment } from './environments/environment';
import { NEED_MOCK, MUST_MOCK_PATHS, AVAILABLE_LOCALES, USE_SIMPLE_ACCOUNT, USER_REGISTRATION_LOGIN_TYPE, USER_REGISTRATION_SUBSCRIBE_TO_NEWSLETTER } from './app/core/configurations/injection-keys';
import { ICM_APPLICATION } from './app/core/services/state-transfer/factories';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function() { };

// First, initialize the Angular testing environment.
beforeEach(() => {
  environment.needMock = true;
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting([
      { provide: NEED_MOCK, useValue: true },
      { provide: MUST_MOCK_PATHS, useValue: environment['mustMockPaths'] },
      { provide: AVAILABLE_LOCALES, useValue: environment.locales },
      { provide: ICM_APPLICATION, useValue: environment.icmApplication },
      // TODO: get from REST call
      { provide: USE_SIMPLE_ACCOUNT, useValue: false },
      // TODO: get from REST call
      { provide: USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' },
      // TODO: get from REST call
      { provide: USER_REGISTRATION_SUBSCRIBE_TO_NEWSLETTER, useValue: true },
    ])
  );
});
afterEach(() => {
  getTestBed().resetTestEnvironment();
});

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
