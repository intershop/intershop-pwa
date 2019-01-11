import { TestBed } from '@angular/core/testing';

import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ApplyConfiguration } from './configuration.actions';
import {
  getFeatures,
  getICMBaseURL,
  getICMServerURL,
  getICMStaticURL,
  getRestEndpoint,
} from './configuration.selectors';

describe('Configuration Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        ...coreReducers,
      }),
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
    });
  });
});
