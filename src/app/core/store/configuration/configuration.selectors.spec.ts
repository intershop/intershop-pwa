import { TestBed } from '@angular/core/testing';

import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ApplyConfiguration, SetGTMToken } from './configuration.actions';
import {
  getAvailableLocales,
  getCurrentLocale,
  getFeatures,
  getGTMToken,
  getICMBaseURL,
  getICMServerURL,
  getICMStaticURL,
  getRestEndpoint,
  getServerConfigParameter,
  isServerConfigurationLoaded,
} from './configuration.selectors';

describe('Configuration Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({ reducers: coreReducers }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('initial state', () => {
    it('should only have undefined of empty values for all selectors', () => {
      expect(getRestEndpoint(store$.state)).toBeUndefined();
      expect(getICMBaseURL(store$.state)).toBeUndefined();
      expect(getICMServerURL(store$.state)).toBeUndefined();
      expect(getICMStaticURL(store$.state)).toBeUndefined();
      expect(getFeatures(store$.state)).toBeEmpty();
      expect(getGTMToken(store$.state)).toBeUndefined();
      expect(isServerConfigurationLoaded(store$.state)).toBeFalsy();
      expect(getServerConfigParameter('application.applicationType')(store$.state)).toMatchInlineSnapshot(`undefined`);
      expect(getServerConfigParameter('basket.acceleration')(store$.state)).toMatchInlineSnapshot(`undefined`);
      expect(getServerConfigParameter('services.captcha.siteKey')(store$.state)).toMatchInlineSnapshot(`undefined`);
      expect(getServerConfigParameter('general.locales')(store$.state)).toMatchInlineSnapshot(`undefined`);
      expect(getAvailableLocales(store$.state)).not.toBeEmpty();
      expect(getCurrentLocale(store$.state)).not.toBeEmpty();
    });
  });

  describe('after importing settings', () => {
    beforeEach(() => {
      store$.dispatch(
        new ApplyConfiguration({
          baseURL: 'http://example.org',
          server: 'api',
          serverStatic: 'static',
          channel: 'site',
          features: ['compare', 'recently'],
        })
      );
    });

    it('should have defined values for all selectors', () => {
      expect(getRestEndpoint(store$.state)).toEqual('http://example.org/api/site/-');
      expect(getICMBaseURL(store$.state)).toEqual('http://example.org');
      expect(getICMServerURL(store$.state)).toEqual('http://example.org/api');
      expect(getICMStaticURL(store$.state)).toEqual('http://example.org/static/site/-');
      expect(getFeatures(store$.state)).toIncludeAllMembers(['compare', 'recently']);
    });

    describe('after setting application', () => {
      beforeEach(() => {
        store$.dispatch(
          new ApplyConfiguration({
            application: 'app',
          })
        );
      });

      it('should have defined values for all selectors', () => {
        expect(getRestEndpoint(store$.state)).toEqual('http://example.org/api/site/app');
        expect(getICMBaseURL(store$.state)).toEqual('http://example.org');
        expect(getICMServerURL(store$.state)).toEqual('http://example.org/api');
        expect(getICMStaticURL(store$.state)).toEqual('http://example.org/static/site/app');
        expect(getFeatures(store$.state)).toIncludeAllMembers(['compare', 'recently']);
      });
    });
  });

  describe('after setting gtm token', () => {
    beforeEach(() => {
      store$.dispatch(new SetGTMToken({ gtmToken: 'dummy' }));
    });

    it('should set token to state', () => {
      expect(getGTMToken(store$.state)).toEqual('dummy');
    });
  });

  describe('after setting serverConfig', () => {
    beforeEach(() => {
      store$.dispatch(
        new ApplyConfiguration({
          serverConfig: {
            application: {
              applicationType: 'intershop.B2CResponsive',
              urlIdentifier: '-',
            },
            basket: {
              acceleration: true,
            },
            general: {
              locales: ['de_DE', 'en_US'],
            },
            services: {
              captcha: {
                siteKey: 'QWERTY',
              },
            },
          },
        })
      );
    });

    it('should set serverConfig to state', () => {
      expect(isServerConfigurationLoaded(store$.state)).toBeTruthy();
      expect(getServerConfigParameter('application.applicationType')(store$.state)).toMatchInlineSnapshot(
        `"intershop.B2CResponsive"`
      );
      expect(getServerConfigParameter('basket.acceleration')(store$.state)).toMatchInlineSnapshot(`true`);
      expect(getServerConfigParameter('services.captcha.siteKey')(store$.state)).toMatchInlineSnapshot(`"QWERTY"`);
      expect(getServerConfigParameter('general.locales')(store$.state)).toMatchInlineSnapshot(`
        Array [
          "de_DE",
          "en_US",
        ]
      `);
    });
  });
});
