import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { Address } from 'ish-core/models/address/address.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { AddressService } from 'ish-core/services/address/address.service';
import { AccountStoreModule } from 'ish-core/store/account/account-store.module';
import { LoginUserSuccess } from 'ish-core/store/account/user';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { SuccessMessage } from 'ish-core/store/core/messages';

import {
  CreateCustomerAddress,
  CreateCustomerAddressFail,
  CreateCustomerAddressSuccess,
  DeleteCustomerAddress,
  DeleteCustomerAddressFail,
  DeleteCustomerAddressSuccess,
  LoadAddresses,
  LoadAddressesSuccess,
} from './addresses.actions';
import { AddressesEffects } from './addresses.effects';

describe('Addresses Effects', () => {
  let actions$: Observable<Action>;
  let addressServiceMock: AddressService;
  let effects: AddressesEffects;
  let store$: Store;

  beforeEach(() => {
    addressServiceMock = mock(AddressService);

    when(addressServiceMock.getCustomerAddresses(anyString())).thenReturn(of([{ urn: 'test' } as Address]));
    when(addressServiceMock.createCustomerAddress(anyString(), anything())).thenReturn(of({ urn: 'test' } as Address));
    when(addressServiceMock.deleteCustomerAddress(anyString(), anything())).thenReturn(of('123'));

    TestBed.configureTestingModule({
      imports: [AccountStoreModule.forTesting('user'), CoreStoreModule.forTesting()],
      providers: [
        AddressesEffects,
        provideMockActions(() => actions$),
        { provide: AddressService, useFactory: () => instance(addressServiceMock) },
      ],
    });

    effects = TestBed.inject(AddressesEffects);
    store$ = TestBed.inject(Store);
    const customer = { customerNo: 'patricia' } as Customer;
    store$.dispatch(new LoginUserSuccess({ customer }));
  });

  describe('loadAddresses$', () => {
    it('should call the addressService for loadAddresses', done => {
      const action = new LoadAddresses();
      actions$ = of(action);

      effects.loadAddresses$.subscribe(() => {
        verify(addressServiceMock.getCustomerAddresses('patricia')).once();
        done();
      });
    });

    it('should map to action of type LoadAddressesSuccess', () => {
      const action = new LoadAddresses();
      const completion = new LoadAddressesSuccess({ addresses: [{ urn: 'test' } as Address] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAddresses$).toBeObservable(expected$);
    });
  });

  describe('createCustomerAddress$', () => {
    it('should call the addressService for createCustomerAddress', done => {
      const address = { urn: '123' } as Address;
      const action = new CreateCustomerAddress({ address });
      actions$ = of(action);

      effects.createCustomerAddress$.subscribe(() => {
        verify(addressServiceMock.createCustomerAddress('patricia', anything())).once();
        done();
      });
    });

    it('should map to action of type CreateCustomerSuccess', () => {
      const address = { urn: '123' } as Address;
      const action = new CreateCustomerAddress({ address });
      const completion = new CreateCustomerAddressSuccess({ address: { urn: 'test' } as Address });
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
      const action = new CreateCustomerAddress({ address });
      const error = { message: 'invalid' } as HttpError;
      const completion = new CreateCustomerAddressFail({ error });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createCustomerAddress$).toBeObservable(expected$);
    });
  });

  describe('deleteCustomerAddress$', () => {
    it('should call the addressService for deleteCustomerAddress', done => {
      const addressId = '123';
      const action = new DeleteCustomerAddress({ addressId });
      actions$ = of(action);

      effects.deleteCustomerAddress$.subscribe(() => {
        verify(addressServiceMock.deleteCustomerAddress('patricia', '123')).once();
        done();
      });
    });

    it('should map to action of type DeleteCustomerSuccess', () => {
      const addressId = '123';
      const action = new DeleteCustomerAddress({ addressId });
      const completion = new DeleteCustomerAddressSuccess({ addressId });
      const completion2 = new SuccessMessage({
        message: 'account.addresses.new_address_deleted.message',
      });
      actions$ = hot('-a----a----a----|', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)-|', { c: completion, d: completion2 });

      expect(effects.deleteCustomerAddress$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteCustomerFail', () => {
      when(addressServiceMock.deleteCustomerAddress(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const addressId = '123';
      const action = new DeleteCustomerAddress({ addressId });
      const error = { message: 'invalid' } as HttpError;
      const completion = new DeleteCustomerAddressFail({ error });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteCustomerAddress$).toBeObservable(expected$);
    });
  });
});
