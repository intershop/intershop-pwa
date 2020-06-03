import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { AddressService } from 'ish-core/services/address/address.service';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { OrderService } from 'ish-core/services/order/order.service';
import { AccountStoreModule } from 'ish-core/store/account/account-store.module';
import {
  DeleteCustomerAddressFail,
  DeleteCustomerAddressSuccess,
  UpdateCustomerAddressFail,
  UpdateCustomerAddressSuccess,
} from 'ish-core/store/account/addresses';
import { LoginUserSuccess } from 'ish-core/store/account/user';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { BasketAddressesEffects } from './basket-addresses.effects';
import {
  AssignBasketAddress,
  CreateBasketAddress,
  CreateBasketAddressSuccess,
  DeleteBasketShippingAddress,
  LoadBasket,
  ResetBasketErrors,
  UpdateBasket,
  UpdateBasketAddress,
} from './basket.actions';

describe('Basket Addresses Effects', () => {
  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let orderServiceMock: OrderService;
  let addressServiceMock: AddressService;
  let effects: BasketAddressesEffects;
  let store$: Store;

  beforeEach(() => {
    basketServiceMock = mock(BasketService);
    orderServiceMock = mock(OrderService);
    addressServiceMock = mock(AddressService);

    TestBed.configureTestingModule({
      imports: [AccountStoreModule.forTesting('user'), CoreStoreModule.forTesting()],
      providers: [
        BasketAddressesEffects,
        provideMockActions(() => actions$),
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        { provide: OrderService, useFactory: () => instance(orderServiceMock) },
        { provide: AddressService, useFactory: () => instance(addressServiceMock) },
      ],
    });

    effects = TestBed.inject(BasketAddressesEffects);
    store$ = TestBed.inject(Store);
  });

  describe('createAddressForBasket$ for a logged in user', () => {
    beforeEach(() => {
      when(addressServiceMock.createCustomerAddress('-', anything())).thenReturn(of(BasketMockData.getAddress()));

      store$.dispatch(
        new LoginUserSuccess({
          customer: {
            customerNo: '4711',
          } as Customer,
        })
      );
    });
    it('should call the addressService if user is logged in', done => {
      const address = BasketMockData.getAddress();
      const action = new CreateBasketAddress({ address, scope: 'invoice' });
      actions$ = of(action);

      effects.createAddressForBasket$.subscribe(() => {
        verify(addressServiceMock.createCustomerAddress('-', anything())).once();
        done();
      });
    });

    it('should map to Action createBasketAddressSuccess', () => {
      const address = BasketMockData.getAddress();
      const action = new CreateBasketAddress({ address, scope: 'invoice' });
      const completion = new CreateBasketAddressSuccess({ address, scope: 'invoice' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createAddressForBasket$).toBeObservable(expected$);
    });
  });

  describe('createAddressForBasket$ for an anonymous user', () => {
    beforeEach(() => {
      when(basketServiceMock.createBasketAddress('current', anything())).thenReturn(of(BasketMockData.getAddress()));
    });
    it('should call the basketService if user is not logged in', done => {
      const address = BasketMockData.getAddress();
      const action = new CreateBasketAddress({ address, scope: 'invoice' });
      actions$ = of(action);

      effects.createAddressForBasket$.subscribe(() => {
        verify(basketServiceMock.createBasketAddress('current', anything())).once();
        done();
      });
    });

    it('should map to Action createBasketAddressSuccess', () => {
      const address = BasketMockData.getAddress();
      const action = new CreateBasketAddress({ address, scope: 'invoice' });
      const completion = new CreateBasketAddressSuccess({ address, scope: 'invoice' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createAddressForBasket$).toBeObservable(expected$);
    });
  });

  describe('assignNewAddressToBasket$', () => {
    it('should map to Action AssignBasketAddress for Invoice Address', () => {
      const address = BasketMockData.getAddress();
      const action = new CreateBasketAddressSuccess({ address, scope: 'invoice' });
      const completion = new AssignBasketAddress({ addressId: address.id, scope: 'invoice' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.assignNewAddressToBasket$).toBeObservable(expected$);
    });

    it('should map to Action AssignBasketAddress for Shipping Address', () => {
      const address = BasketMockData.getAddress();
      const action = new CreateBasketAddressSuccess({ address, scope: 'shipping' });
      const completion = new AssignBasketAddress({ addressId: address.id, scope: 'shipping' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.assignNewAddressToBasket$).toBeObservable(expected$);
    });

    it('should map to Action AssignBasketAddress for Invoice and Shipping Address', () => {
      const address = BasketMockData.getAddress();
      const action = new CreateBasketAddressSuccess({ address, scope: 'any' });
      const completion = new AssignBasketAddress({ addressId: address.id, scope: 'any' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.assignNewAddressToBasket$).toBeObservable(expected$);
    });
  });

  describe('assignBasketAddress$', () => {
    it('should trigger the updateBasket action to assign an Invoice Address', () => {
      const addressId = 'addressId';
      const action = new AssignBasketAddress({ addressId, scope: 'invoice' });
      const completion = new UpdateBasket({
        update: { invoiceToAddress: addressId },
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.assignBasketAddress$).toBeObservable(expected$);
    });

    it('should trigger the updateBasket action to assign a Shipping Address', () => {
      const addressId = 'addressId';
      const action = new AssignBasketAddress({ addressId, scope: 'shipping' });

      const completion = new UpdateBasket({
        update: { commonShipToAddress: addressId },
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.assignBasketAddress$).toBeObservable(expected$);
    });

    it('should trigger the updateBasket action to assign an Invoice and Shipping Address', () => {
      const addressId = 'addressId';
      const action = new AssignBasketAddress({ addressId, scope: 'any' });
      const completion = new UpdateBasket({
        update: { invoiceToAddress: addressId, commonShipToAddress: addressId },
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.assignBasketAddress$).toBeObservable(expected$);
    });
  });

  describe('updateBasketAddress$ for logged in user', () => {
    beforeEach(() => {
      when(addressServiceMock.updateCustomerAddress(anyString(), anything())).thenReturn(
        of(BasketMockData.getAddress())
      );
      store$.dispatch(new LoginUserSuccess({ customer: {} as Customer }));
    });

    it('should call the addressService for updateBasketAddress', done => {
      const address = BasketMockData.getAddress();
      const action = new UpdateBasketAddress({ address });
      actions$ = of(action);

      effects.updateBasketAddress$.subscribe(() => {
        verify(addressServiceMock.updateCustomerAddress('-', anything())).once();
        done();
      });
    });

    it('should map to action of type UpdateCustomerAddressSuccess and LoadBasket', () => {
      const address = BasketMockData.getAddress();
      const action = new UpdateBasketAddress({ address });
      const completion1 = new UpdateCustomerAddressSuccess({ address });
      const completion2 = new LoadBasket();
      const completion3 = new ResetBasketErrors();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cde)', { c: completion1, d: completion2, e: completion3 });

      expect(effects.updateBasketAddress$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateCustomerAddressFail', () => {
      const address = BasketMockData.getAddress();
      when(addressServiceMock.updateCustomerAddress(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );

      const action = new UpdateBasketAddress({ address });
      const completion = new UpdateCustomerAddressFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketAddress$).toBeObservable(expected$);
    });
  });

  describe('updateBasketAddress$ for anonymous user', () => {
    beforeEach(() => {
      when(basketServiceMock.updateBasketAddress(anyString(), anything())).thenReturn(of(BasketMockData.getAddress()));
    });

    it('should call the basketService for updateBasketAddress', done => {
      const address = BasketMockData.getAddress();
      const action = new UpdateBasketAddress({ address });
      actions$ = of(action);

      effects.updateBasketAddress$.subscribe(() => {
        verify(basketServiceMock.updateBasketAddress('current', anything())).once();
        done();
      });
    });

    it('should map to action of type UpdateCustomerAddressSuccess and LoadBasket', () => {
      const address = BasketMockData.getAddress();
      const action = new UpdateBasketAddress({ address });
      const completion1 = new UpdateCustomerAddressSuccess({ address });
      const completion2 = new LoadBasket();
      const completion3 = new ResetBasketErrors();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cde)', { c: completion1, d: completion2, e: completion3 });

      expect(effects.updateBasketAddress$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateCustomerAddressFail', () => {
      const address = BasketMockData.getAddress();
      when(basketServiceMock.updateBasketAddress(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );

      const action = new UpdateBasketAddress({ address });
      const completion = new UpdateCustomerAddressFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketAddress$).toBeObservable(expected$);
    });
  });

  describe('deleteBasketShippingAddress$', () => {
    beforeEach(() => {
      when(addressServiceMock.deleteCustomerAddress(anyString(), anyString())).thenReturn(of(undefined));
    });

    it('should call the addressService for deleteBasketShippingAddress', done => {
      const addressId = 'addressId';
      const action = new DeleteBasketShippingAddress({ addressId });
      actions$ = of(action);

      effects.deleteBasketShippingAddress$.subscribe(() => {
        verify(addressServiceMock.deleteCustomerAddress('-', anything())).once();
        done();
      });
    });

    it('should map to action of type DeleteCustomerAddressSuccess and LoadBasket', () => {
      const addressId = 'addressId';
      const action = new DeleteBasketShippingAddress({ addressId });
      const completion1 = new DeleteCustomerAddressSuccess({ addressId });
      const completion2 = new LoadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.deleteBasketShippingAddress$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteCustomerAddressFail', () => {
      const addressId = 'addressId';
      when(addressServiceMock.deleteCustomerAddress(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );

      const action = new DeleteBasketShippingAddress({ addressId });
      const completion = new DeleteCustomerAddressFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketShippingAddress$).toBeObservable(expected$);
    });
  });
});
