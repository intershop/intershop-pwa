import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Address } from '../../../models/address/address.model';
import { c } from '../../../utils/dev/marbles-utils';
import { CheckoutState } from '../checkout.state';
import { checkoutReducers } from '../checkout.system';
import { LoadAddresses, LoadAddressesFail, LoadAddressesSuccess } from './addresses.actions';
import { getAddressesError, getAddressesLoading, getAllAddresses } from './addresses.selectors';

describe('Addresses Selectors', () => {
  let store$: Store<CheckoutState>;

  let addresses$: Observable<Address[]>;
  let addressesLoading$: Observable<boolean>;
  let addressesError$: Observable<HttpErrorResponse>;

  const addresses = [{ id: '4711', firstname: 'Patricia' }, { id: '4712', firstName: 'John' }] as Address[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
        }),
      ],
    });
    store$ = TestBed.get(Store);

    addresses$ = store$.pipe(select(getAllAddresses));
    addressesLoading$ = store$.pipe(select(getAddressesLoading));
    addressesError$ = store$.pipe(select(getAddressesError));
  });

  describe('with empty state', () => {
    it('should not select any addresses when used', () => {
      expect(addresses$).toBeObservable(c([]));
      expect(addressesLoading$).toBeObservable(c(false));
      expect(addressesError$).toBeObservable(c(null));
    });
  });

  describe('loading addresses', () => {
    beforeEach(() => {
      store$.dispatch(new LoadAddresses());
    });

    it('should set the state to loading', () => {
      expect(addressesLoading$).toBeObservable(c(true));
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadAddressesSuccess(addresses));
      });

      it('should set loading to false', () => {
        expect(addressesLoading$).toBeObservable(c(false));
        expect(addresses$).toBeObservable(c(addresses));
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadAddressesFail({ message: 'error' } as HttpErrorResponse));
      });

      it('should not have loaded addresses on error', () => {
        expect(addressesLoading$).toBeObservable(c(false));
        expect(addresses$).toBeObservable(c([]));
        expect(addressesError$).toBeObservable(c({ message: 'error' }));
      });
    });
  });
});
