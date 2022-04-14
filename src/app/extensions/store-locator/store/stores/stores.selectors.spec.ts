import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { StoreLocation as StoreModel } from '../../models/store-location/store-location.model';
import { StoreLocatorStoreModule } from '../store-locator-store.module';

import { getLoading, highlightStore } from '.';
import { loadStores, loadStoresSuccess } from './stores.actions';
import { getHighlightedStore, getStores } from './stores.selectors';

const store: StoreModel = {
  id: '1',
  name: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  countryCode: '',
  phone: '',
  fax: '',
  email: '',
  latitude: 0,
  longitude: 0,
};

describe('Stores Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), StoreLocatorStoreModule.forTesting('stores')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not have stores when in initial state', () => {
      expect(getStores(store$.state)).toBeEmpty();
    });
  });

  describe('setStores', () => {
    const action = loadStoresSuccess({ stores: [store] });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should write store entity in store', () => {
      expect(getStores(store$.state)).toMatchInlineSnapshot(`
        Array [
          Object {
            "address": "",
            "city": "",
            "country": "",
            "countryCode": "",
            "email": "",
            "fax": "",
            "id": "1",
            "latitude": 0,
            "longitude": 0,
            "name": "",
            "phone": "",
            "postalCode": "",
          },
        ]
      `);
    });
  });

  describe('highlightStore', () => {
    const action = highlightStore({ storeId: store.id });
    beforeEach(() => {
      store$.dispatch(loadStoresSuccess({ stores: [store] }));
      store$.dispatch(action);
    });

    it('should get highlighted store', () => {
      expect(getHighlightedStore(store$.state)).toMatchInlineSnapshot(`
        Object {
          "address": "",
          "city": "",
          "country": "",
          "countryCode": "",
          "email": "",
          "fax": "",
          "id": "1",
          "latitude": 0,
          "longitude": 0,
          "name": "",
          "phone": "",
          "postalCode": "",
        }
      `);
    });
  });

  describe('loaded flag', () => {
    const loadStoresAction = loadStores({ countryCode: '', postalCode: '', city: '' });

    const loadStoresSuccessAction = loadStoresSuccess({ stores: [store] });

    beforeEach(() => {
      store$.dispatch(loadStoresAction);
    });

    it('should set loading to true after dispatching load action', () => {
      expect(getLoading(store$.state)).toBeTrue();
    });

    it('should set loading to false on store loading success', () => {
      store$.dispatch(loadStoresSuccessAction);
      expect(getLoading(store$.state)).toBeFalse();
    });
  });
});
