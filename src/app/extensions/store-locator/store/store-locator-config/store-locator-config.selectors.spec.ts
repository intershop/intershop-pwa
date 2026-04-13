import { TestBed } from '@angular/core/testing';

import { CoreStoreProviders } from 'ish-core/store/core/core-store.providers';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { StoreLocatorStoreProviders } from '../store-locator-store.providers';

import { setGMAKey } from './store-locator-config.actions';
import { getGMAKey } from './store-locator-config.selectors';

describe('Store Locator Config Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...CoreStoreProviders.forTesting(), StoreLocatorStoreProviders.forTesting('storeLocatorConfig')],
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
