import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadServerConfigSuccess } from 'ish-core/store/core/server-config';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { applyConfiguration } from './configuration.actions';
import {
  getAvailableCurrencies,
  getAvailableLocales,
  getCurrentCurrency,
  getCurrentLocale,
  getDeviceType,
  getFeatures,
  getICMBaseURL,
  getICMServerURL,
  getICMStaticURL,
  getIdentityProvider,
  getPipelineEndpoint,
  getRestEndpoint,
} from './configuration.selectors';

// mock `isDevMode` to return `false`
jest.mock('@angular/core', () => {
  const originalModule = jest.requireActual('@angular/core');
  return {
    ...originalModule,
    isDevMode: jest.fn(() => false),
  };
});

describe('Configuration Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['configuration', 'serverConfig'])],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should be undefined or empty values for most selectors', () => {
      expect(getICMBaseURL(store$.state)).toBeUndefined();
      expect(getICMServerURL(store$.state)).toBeUndefined();
      expect(getICMStaticURL(store$.state)).toBeUndefined();
      expect(getFeatures(store$.state)).toBeUndefined();
      expect(getDeviceType(store$.state)).toBeUndefined();
      expect(getIdentityProvider(store$.state)).toBeUndefined();
      expect(getRestEndpoint(store$.state)).toBeUndefined();
      expect(getPipelineEndpoint(store$.state)).toBeUndefined();
    });
  });

  describe('after importing settings', () => {
    beforeEach(() => {
      store$.dispatch(
        applyConfiguration({
          baseURL: 'http://example.org',
          server: 'api',
          serverStatic: 'static',
          serverWeb: 'web',
          channel: 'site',
          features: ['compare', 'recently'],
        })
      );
      store$.dispatch(
        loadServerConfigSuccess({
          config: {
            general: {
              defaultLocale: 'en_US',
              defaultCurrency: 'USD',
              locales: ['en_US', 'fr_BE', 'de_DE'],
              currencies: ['USD', 'EUR'],
            },
          },
        })
      );
    });

    it('should have defined values for all selectors', () => {
      expect(getICMBaseURL(store$.state)).toEqual('http://example.org');
      expect(getICMServerURL(store$.state)).toEqual('http://example.org/api');
      expect(getICMStaticURL(store$.state)).toEqual('http://example.org/static/site/-');
      expect(getFeatures(store$.state)).toIncludeAllMembers(['compare', 'recently']);
      expect(getRestEndpoint(store$.state)).toEqual('http://example.org/api/site/-');
      expect(getPipelineEndpoint(store$.state)).toEqual('http://example.org/web/site/en_US/-/USD');
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
        expect(getICMBaseURL(store$.state)).toEqual('http://example.org');
        expect(getICMServerURL(store$.state)).toEqual('http://example.org/api');
        expect(getICMStaticURL(store$.state)).toEqual('http://example.org/static/site/app');
        expect(getFeatures(store$.state)).toIncludeAllMembers(['compare', 'recently']);
        expect(getRestEndpoint(store$.state)).toEqual('http://example.org/api/site/app');
        expect(getPipelineEndpoint(store$.state)).toEqual('http://example.org/web/site/en_US/app/USD');
      });
    });

    describe('after setting additional features', () => {
      beforeEach(() => {
        store$.dispatch(
          applyConfiguration({
            addFeatures: ['quoting'],
          })
        );
      });

      it('should have additional features active', () => {
        expect(getFeatures(store$.state)).toIncludeAllMembers(['compare', 'recently', 'quoting']);
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
        {
          "setting": "specific setting",
          "type": "id",
        }
      `);
    });
  });

  describe('after initialization', () => {
    describe('without ICM server configuration', () => {
      it('should not provide any locale or currency when no ICM is available', () => {
        store$.dispatch(
          applyConfiguration({
            defaultLocale: 'en_US',
            localeCurrencyOverride: undefined,
          })
        );
        expect(getCurrentLocale(store$.state)).toBeUndefined();
        expect(getCurrentCurrency(store$.state)).toBeUndefined();
        expect(getAvailableLocales(store$.state)).toBeUndefined();
        expect(getAvailableCurrencies(store$.state)).toBeUndefined();
      });

      it('should not choose a locale when no ICM or internal configuration is available', () => {
        store$.dispatch(
          applyConfiguration({
            defaultLocale: undefined,
          })
        );
        expect(getCurrentLocale(store$.state)).toBeUndefined();
        expect(getCurrentCurrency(store$.state)).toBeUndefined();
        expect(getAvailableLocales(store$.state)).toBeUndefined();
        expect(getAvailableCurrencies(store$.state)).toBeUndefined();
      });
    });

    describe('with ICM server configuration', () => {
      beforeEach(() => {
        store$.dispatch(
          loadServerConfigSuccess({
            config: {
              general: {
                defaultLocale: 'de_DE',
                defaultCurrency: 'EUR',
                locales: ['en_US', 'de_DE', 'fr_BE', 'nl_BE'],
                currencies: ['USD', 'EUR'],
              },
            },
          })
        );
      });

      it('should return ICM server locales for available locales', () => {
        expect(getAvailableLocales(store$.state)).toMatchInlineSnapshot(`
          [
            "en_US",
            "de_DE",
            "fr_BE",
            "nl_BE",
          ]
        `);
      });

      it('should return ICM server currencies for available currencies', () => {
        expect(getAvailableCurrencies(store$.state)).toMatchInlineSnapshot(`
          [
            "USD",
            "EUR",
          ]
        `);
      });

      it('should choose the ICM configured default locale when ICM configuration is available', () => {
        expect(getCurrentLocale(store$.state)).toMatchInlineSnapshot(`"de_DE"`);
      });

      it('should choose the ICM configured default currency when ICM configuration is available', () => {
        expect(getCurrentCurrency(store$.state)).toMatchInlineSnapshot(`"EUR"`);
      });

      it.each`
        requested  | chosen
        ${'de_DE'} | ${'de_DE'}
        ${'no_NO'} | ${'de_DE'}
        ${'nl_BE'} | ${'nl_BE'}
        ${'zh_CN'} | ${'de_DE'}
        ${'nl_NL'} | ${'de_DE'}
        ${'en_US'} | ${'en_US'}
      `('should choose $chosen when $requested is requested', ({ requested, chosen }) => {
        store$.dispatch(applyConfiguration({ lang: requested }));
        expect(getCurrentLocale(store$.state)).toEqual(chosen);
      });

      describe('with configured currency filter active', () => {
        beforeEach(() => {
          store$.dispatch(
            applyConfiguration({
              localeCurrencyOverride: {
                de_DE: 'JPY',
              },
            })
          );
        });

        it('should use the locale currency filter override for currencies', () => {
          expect(getCurrentCurrency(store$.state)).toMatchInlineSnapshot(`"JPY"`);
          expect(getAvailableCurrencies(store$.state)).toMatchInlineSnapshot(`
            [
              "JPY",
            ]
          `);
        });
      });
    });
  });
});
