import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { GeneralStoreModule } from 'ish-core/store/general/general-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadServerConfigSuccess } from './server-config.actions';
import { getServerConfigParameter, isServerConfigurationLoaded } from './server-config.selectors';

describe('Server Config Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), GeneralStoreModule.forTesting('serverConfig')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should be undefined or empty values for most selectors', () => {
      expect(isServerConfigurationLoaded(store$.state)).toBeFalsy();
      expect(getServerConfigParameter('application.applicationType')(store$.state)).toMatchInlineSnapshot(`undefined`);
      expect(getServerConfigParameter('basket.acceleration')(store$.state)).toMatchInlineSnapshot(`undefined`);
      expect(getServerConfigParameter('services.captcha.siteKey')(store$.state)).toMatchInlineSnapshot(`undefined`);
      expect(getServerConfigParameter('general.locales')(store$.state)).toMatchInlineSnapshot(`undefined`);
    });
  });

  describe('after setting serverConfig', () => {
    beforeEach(() => {
      store$.dispatch(
        loadServerConfigSuccess({
          config: {
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
