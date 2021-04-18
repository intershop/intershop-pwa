import { TestBed } from '@angular/core/testing';

import { Locale } from 'ish-core/models/locale/locale.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadServerConfigSuccess } from 'ish-core/store/core/server-config';
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
      imports: [CoreStoreModule.forTesting(['configuration', 'serverConfig'])],
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

  describe('after setting default locales', () => {
    beforeEach(() => {
      store$.dispatch(
        applyConfiguration({
          locales: [
            { lang: 'de_DE' },
            { lang: 'en_US' },
            { lang: 'fr_BE' },
            { lang: 'nl_BE' },
            { lang: 'no_NO' },
            { lang: 'zh_CN' },
          ] as Locale[],
        })
      );
    });

    describe('without ICM server configuration', () => {
      it('should choose the first locale when no ICM configuration is available', () => {
        expect(getCurrentLocale(store$.state)).toMatchInlineSnapshot(`
          Object {
            "lang": "de_DE",
          }
        `);
      });

      it.each`
        requested  | chosen
        ${'de_DE'} | ${'de_DE'}
        ${'no_NO'} | ${'no_NO'}
        ${'nl_BE'} | ${'nl_BE'}
        ${'zh_CN'} | ${'zh_CN'}
        ${'nl_NL'} | ${'nl_BE'}
        ${'de'}    | ${'de_DE'}
        ${'de-DE'} | ${'de_DE'}
        ${'no'}    | ${'no_NO'}
        ${'zh'}    | ${'zh_CN'}
        ${'fr'}    | ${'fr_BE'}
        ${'en'}    | ${'en_US'}
        ${'nl'}    | ${'nl_BE'}
        ${'nl-BE'} | ${'nl_BE'}
        ${'nl-NL'} | ${'nl_BE'}
      `('should choose $chosen when $requested is requested', ({ requested, chosen }) => {
        store$.dispatch(applyConfiguration({ lang: requested }));
        expect(getCurrentLocale(store$.state)?.lang).toEqual(chosen);
      });
    });

    describe('with ICM server configuration', () => {
      beforeEach(() => {
        store$.dispatch(
          loadServerConfigSuccess({
            config: {
              general: {
                defaultLocale: 'en_US',
                locales: ['en_US', 'de_DE', 'fr_BE', 'nl_BE', 'fr_FR'],
              },
            },
          })
        );
      });

      it('should filter available locales for matching ICM server locales', () => {
        expect(getAvailableLocales(store$.state)?.map(l => l.lang)).toMatchInlineSnapshot(`
          Array [
            "en_US",
            "de_DE",
            "fr_BE",
            "nl_BE",
          ]
        `);
      });

      it('should choose the ICM configured default locale when ICM configuration is available', () => {
        expect(getCurrentLocale(store$.state)).toMatchInlineSnapshot(`
          Object {
            "lang": "en_US",
          }
        `);
      });

      it.each`
        requested  | chosen
        ${'de_DE'} | ${'de_DE'}
        ${'no_NO'} | ${'en_US'}
        ${'nl_BE'} | ${'nl_BE'}
        ${'zh_CN'} | ${'en_US'}
        ${'nl_NL'} | ${'nl_BE'}
        ${'de'}    | ${'de_DE'}
        ${'de-DE'} | ${'de_DE'}
        ${'no'}    | ${'en_US'}
        ${'zh'}    | ${'en_US'}
        ${'fr'}    | ${'fr_BE'}
        ${'en'}    | ${'en_US'}
        ${'nl'}    | ${'nl_BE'}
        ${'nl-BE'} | ${'nl_BE'}
        ${'nl-NL'} | ${'nl_BE'}
      `('should choose $chosen when $requested is requested', ({ requested, chosen }) => {
        store$.dispatch(applyConfiguration({ lang: requested }));
        expect(getCurrentLocale(store$.state)?.lang).toEqual(chosen);
      });
    });
  });
});
