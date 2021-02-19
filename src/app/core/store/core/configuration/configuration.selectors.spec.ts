import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { applyConfiguration } from './configuration.actions';
import {
  getAvailableLocales,
  getCurrentLocale,
  getDeviceType,
  getFeatures,
  getICMBaseURL,
  getICMServerURL,
  getICMStaticURL,
  getIdentityProvider,
  getRestEndpoint,
} from './configuration.selectors';

describe('Configuration Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['configuration'])],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should be undefined or empty values for most selectors', () => {
      expect(getRestEndpoint(store$.state)).toBeUndefined();
      expect(getICMBaseURL(store$.state)).toBeUndefined();
      expect(getICMServerURL(store$.state)).toBeUndefined();
      expect(getICMStaticURL(store$.state)).toBeUndefined();
      expect(getFeatures(store$.state)).toBeUndefined();
      expect(getAvailableLocales(store$.state)).not.toBeEmpty();
      expect(getCurrentLocale(store$.state)).not.toBeEmpty();
      expect(getDeviceType(store$.state)).not.toBeEmpty();
      expect(getIdentityProvider(store$.state)).toBeUndefined();
    });
  });

  describe('after importing settings', () => {
    beforeEach(() => {
      store$.dispatch(
        applyConfiguration({
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
          applyConfiguration({
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

  describe('after setting identity provider', () => {
    beforeEach(() => {
      store$.dispatch(
        applyConfiguration({
          identityProvider: 'MyProvider',
          identityProviders: {
            MyProvider: {
              type: 'id',
              setting: 'specific setting',
            },
          },
        })
      );
    });

    it('should select the specific identity provider setting when queried', () => {
      expect(getIdentityProvider(store$.state)).toMatchInlineSnapshot(`
        Object {
          "setting": "specific setting",
          "type": "id",
        }
      `);
    });
  });
});
