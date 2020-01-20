import { TestBed } from '@angular/core/testing';

import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ApplyConfiguration, SetGTMToken } from './configuration.actions';
import {
  getFeatures,
  getGTMToken,
  getICMBaseURL,
  getICMServerURL,
  getICMStaticURL,
  getRestEndpoint,
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
    });

    describe('after importing settings', () => {
      beforeEach(() => {
        store$.dispatch(
          new ApplyConfiguration({
            baseURL: 'http://example.org',
            urlPrefix: 'INTERSHOP',
            restURLPath: 'api',
            staticURLPath: 'static',
            serverGroup: 'WFS',
            channel: 'site',
            features: ['compare', 'recently'],
          })
        );
      });

      it('should have defined values for all selectors', () => {
        expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/api/WFS/site/-"`);
        expect(getICMBaseURL(store$.state)).toMatchInlineSnapshot(`"http://example.org"`);
        expect(getICMServerURL(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/api/WFS"`);
        expect(getICMStaticURL(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/static/WFS/site/-"`);
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
          expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(
            `"http://example.org/INTERSHOP/api/WFS/site/app"`
          );
          expect(getICMBaseURL(store$.state)).toMatchInlineSnapshot(`"http://example.org"`);
          expect(getICMServerURL(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/api/WFS"`);
          expect(getICMStaticURL(store$.state)).toMatchInlineSnapshot(
            `"http://example.org/INTERSHOP/static/WFS/site/app"`
          );
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
  });
});
