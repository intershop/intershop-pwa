import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { Address } from 'ish-core/models/address/address.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { AddressService } from 'ish-core/services/address/address.service';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { SuccessMessage } from 'ish-core/store/messages';
import { LoginUserSuccess, LogoutUser } from 'ish-core/store/user';
import { userReducer } from 'ish-core/store/user/user.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import * as addressesActions from './addresses.actions';
import { AddressesEffects } from './addresses.effects';

describe('Addresses Effects', () => {
  let actions$: Observable<Action>;
  let addressServiceMock: AddressService;
  let effects: AddressesEffects;
  let store$: Store<{}>;

  beforeEach(() => {
    addressServiceMock = mock(AddressService);

    when(addressServiceMock.getCustomerAddresses(anyString())).thenReturn(of([{ urn: 'test' } as Address]));
    when(addressServiceMock.createCustomerAddress(anyString(), anything())).thenReturn(of({ urn: 'test' } as Address));
    when(addressServiceMock.deleteCustomerAddress(anyString(), anything())).thenReturn(of('123'));

    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: {
            checkout: combineReducers(checkoutReducers),
            user: userReducer,
          },
        }),
      ],
      providers: [
        AddressesEffects,
        provideMockActions(() => actions$),
        { provide: AddressService, useFactory: () => instance(addressServiceMock) },
      ],
    });

    effects = TestBed.get(AddressesEffects);
    store$ = TestBed.get(Store);
    const customer = { customerNo: 'patricia' } as Customer;
    store$.dispatch(new LoginUserSuccess({ customer }));
  });

  describe('loadAddresses$', () => {
    it('should call the addressService for loadAddresses', done => {
      const action = new addressesActions.LoadAddresses();
      actions$ = of(action);

      effects.loadAddresses$.subscribe(() => {
        verify(addressServiceMock.getCustomerAddresses('patricia')).once();
        done();
      });
    });

    it('should map to action of type LoadAddressesSuccess', () => {
      const action = new addressesActions.LoadAddresses();
      const completion = new addressesActions.LoadAddressesSuccess({ addresses: [{ urn: 'test' } as Address] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAddresses$).toBeObservable(expected$);
    });
  });

  describe('createCustomerAddress$', () => {
    it('should call the addressService for createCustomerAddress', done => {
      const address = { urn: '123' } as Address;
      const action = new addressesActions.CreateCustomerAddress({ address });
      actions$ = of(action);

      effects.createCustomerAddress$.subscribe(() => {
        verify(addressServiceMock.createCustomerAddress('patricia', anything())).once();
        done();
      });
    });

    it('should map to action of type CreateCustomerSuccess', () => {
      const address = { urn: '123' } as Address;
      const action = new addressesActions.CreateCustomerAddress({ address });
      const completion = new addressesActions.CreateCustomerAddressSuccess({ address: { urn: 'test' } as Address });
      const completion2 = new SuccessMessage({
        message: 'account.addresses.new_address_created.message',
      });

      actions$ = hot('-a----a----a----|', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)-|', { c: completion, d: completion2 });

      expect(effects.createCustomerAddress$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type CreateCustomerFail', () => {
      when(addressServiceMock.createCustomerAddress(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const address = { urn: '123' } as Address;
      const action = new addressesActions.CreateCustomerAddress({ address });
      const error = { message: 'invalid' } as HttpError;
      const completion = new addressesActions.CreateCustomerAddressFail({ error });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createCustomerAddress$).toBeObservable(expected$);
    });
  });

  describe('deleteCustomerAddress$', () => {
    it('should call the addressService for deleteCustomerAddress', done => {
      const addressId = '123';
      const action = new addressesActions.DeleteCustomerAddress({ addressId });
      actions$ = of(action);

      effects.deleteCustomerAddress$.subscribe(() => {
        verify(addressServiceMock.deleteCustomerAddress('patricia', '123')).once();
        done();
      });
    });

    it('should map to action of type DeleteCustomerSuccess', () => {
      const addressId = '123';
      const action = new addressesActions.DeleteCustomerAddress({ addressId });
      const completion = new addressesActions.DeleteCustomerAddressSuccess({ addressId });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteCustomerAddress$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteCustomerFail', () => {
      when(addressServiceMock.deleteCustomerAddress(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const addressId = '123';
      const action = new addressesActions.DeleteCustomerAddress({ addressId });
      const error = { message: 'invalid' } as HttpError;
      const completion = new addressesActions.DeleteCustomerAddressFail({ error });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteCustomerAddress$).toBeObservable(expected$);
    });
  });

  describe('resetAddressesAfterLogout$', () => {
    it('should map to action of type ResetAddresses if LogoutUser action triggered', () => {
      const action = new LogoutUser();
      const completion = new addressesActions.ResetAddresses();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.resetAddressesAfterLogout$).toBeObservable(expected$);
    });
  });
});
