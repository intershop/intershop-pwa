import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { Address } from '../../../models/address/address.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';
import { checkoutReducers } from '../checkout.system';

import { LoadAddresses, LoadAddressesFail, LoadAddressesSuccess } from './addresses.actions';
import { getAddressesError, getAddressesLoading, getAllAddresses } from './addresses.selectors';

describe('Addresses Selectors', () => {
  let store$: TestStore;

  const addresses = [{ id: '4711', firstname: 'Patricia' }, { id: '4712', firstName: 'John' }] as Address[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        checkout: combineReducers(checkoutReducers),
      }),
    });
    store$ = TestBed.get(TestStore);
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
      store$.dispatch(new LoadAddresses());
    });

    it('should set the state to loading', () => {
      expect(getAddressesLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadAddressesSuccess(addresses));
      });

      it('should set loading to false', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toEqual(addresses);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadAddressesFail({ message: 'error' } as HttpError));
      });

      it('should not have loaded addresses on error', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toBeEmpty();
        expect(getAddressesError(store$.state)).toEqual({ message: 'error' });
      });
    });
  });
});
