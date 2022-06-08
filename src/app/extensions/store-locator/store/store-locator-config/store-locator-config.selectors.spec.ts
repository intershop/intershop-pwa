import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { StoreLocatorStoreModule } from '../store-locator-store.module';

import { setGMAKey } from './store-locator-config.actions';
import { getGMAKey } from './store-locator-config.selectors';

describe('Store Locator Config Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), StoreLocatorStoreModule.forTesting('storeLocatorConfig')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not have gmaKey in initial state', () => {
      expect(getGMAKey(store$.state)).toBeUndefined();
    });
  });

  describe('loadStoreLocatorConfig', () => {
    const action = setGMAKey({ gmaKey: 'gmaKey' });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set gma key correctly', () => {
      expect(getGMAKey(store$.state)).toEqual('gmaKey');
    });
  });
});
