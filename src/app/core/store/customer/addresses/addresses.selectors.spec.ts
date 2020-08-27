import { TestBed } from '@angular/core/testing';

import { Address } from 'ish-core/models/address/address.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadAddresses, loadAddressesFail, loadAddressesSuccess } from './addresses.actions';
import { getAddressesError, getAddressesLoading, getAllAddresses } from './addresses.selectors';

describe('Addresses Selectors', () => {
  let store$: StoreWithSnapshots;

  const addresses = [
    { id: '4711', firstname: 'Patricia' },
    { id: '4712', firstName: 'John' },
  ] as Address[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), CustomerStoreModule.forTesting('addresses')],
      providers: [provideStoreSnapshots()],
    });
    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not select any addresses when used', () => {
      expect(getAllAddresses(store$.state)).toBeEmpty();
      expect(getAddressesLoading(store$.state)).toBeFalse();
      expect(getAddressesError(store$.state)).toBeUndefined();
    });
  });

  describe('loading addresses', () => {
    beforeEach(() => {
      store$.dispatch(loadAddresses());
    });

    it('should set the state to loading', () => {
      expect(getAddressesLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(loadAddressesSuccess({ addresses }));
      });

      it('should set loading to false', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toEqual(addresses);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(loadAddressesFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should not have loaded addresses on error', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toBeEmpty();
        expect(getAddressesError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "error",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });
});
