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
import * as injectionKeys from './app/core/configurations/injection-keys';
import { ICM_APPLICATION, ICM_SERVER_URL, ICM_BASE_URL } from './app/core/services/state-transfer/factories';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

// Prevent Karma from running prematurely.
// tslint:disable-next-line: no-empty
__karma__.loaded = function() { };

// First, initialize the Angular testing environment.
beforeEach(() => {
  environment.needMock = true;
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting([
      { provide: injectionKeys.NEED_MOCK, useValue: true },
      { provide: injectionKeys.MUST_MOCK_PATHS, useValue: environment['mustMockPaths'] },
      { provide: injectionKeys.AVAILABLE_LOCALES, useValue: environment.locales },
      { provide: ICM_BASE_URL, useValue: environment.icmBaseURL },
      { provide: ICM_APPLICATION, useValue: environment.icmApplication },
      { provide: ICM_SERVER_URL, useValue: `${environment.icmBaseURL}/${environment.icmServer}` },
      { provide: injectionKeys.MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: environment.mainNavigationMaxSubCategoriesDepth },
      // TODO: get from REST call
      { provide: injectionKeys.USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' }
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
