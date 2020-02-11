import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, noop, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { BasketFeedback } from 'ish-core/models/basket-feedback/basket-feedback.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';
import { User } from 'ish-core/models/user/user.model';
import { OrderService } from 'ish-core/services/order/order.service';
import { ContinueCheckoutWithIssues, LoadBasket } from 'ish-core/store/checkout/basket';
import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { LoginUserSuccess, LogoutUser } from 'ish-core/store/user';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import * as orderActions from './orders.actions';
import { OrdersEffects } from './orders.effects';

describe('Orders Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrdersEffects;
  let orderServiceMock: OrderService;
  let store$: Store<{}>;
  let location: Location;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  const order = { id: '1', documentNo: '00000001', lineItems: [] } as Order;
  const orders = [order, { id: '2', documentNo: '00000002' }] as Order[];

  beforeEach(() => {
    orderServiceMock = mock(OrderService);
    when(orderServiceMock.getOrders()).thenReturn(of(orders));
    when(orderServiceMock.getOrder(anyString())).thenReturn(of(order));
    when(orderServiceMock.getOrderByToken(anyString(), anyString())).thenReturn(of(order));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'checkout',
            children: [{ path: 'receipt', component: DummyComponent }, { path: 'payment', component: DummyComponent }],
          },
        ]),
        ngrxTesting({
          reducers: {
            ...coreReducers,
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
      providers: [
        OrdersEffects,
        provideMockActions(() => actions$),
        { provide: OrderService, useFactory: () => instance(orderServiceMock) },
      ],
    });

    effects = TestBed.get(OrdersEffects);
    store$ = TestBed.get(Store);
    location = TestBed.get(Location);
  });

  describe('createOrder$', () => {
    it('should call the orderService for createOrder', done => {
      when(orderServiceMock.createOrder(anything(), anything())).thenReturn(of(undefined));
      const payload = BasketMockData.getBasket().id;
      const action = new orderActions.CreateOrder({ basketId: payload });
      actions$ = of(action);

      effects.createOrder$.subscribe(() => {
        verify(orderServiceMock.createOrder(payload, true)).once();
        done();
      });
    });

    it('should map a valid request to action of type CreateOrderSuccess', () => {
      when(orderServiceMock.createOrder(anything(), anything())).thenReturn(
        of({ id: BasketMockData.getBasket().id } as Order)
      );
      const basketId = BasketMockData.getBasket().id;
      const newOrder = { id: basketId } as Order;
      const action = new orderActions.CreateOrder({ basketId });
      const completion = new orderActions.CreateOrderSuccess({ order: newOrder });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createOrder$).toBeObservable(expected$);
    });

    it('should map an invalid request to action of type CreateOrderFail', () => {
      when(orderServiceMock.createOrder(anything(), anything())).thenReturn(throwError({ message: 'invalid' }));
      const basketId = BasketMockData.getBasket().id;
      const action = new orderActions.CreateOrder({ basketId });
      const completion = new orderActions.CreateOrderFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createOrder$).toBeObservable(expected$);
    });
  });

  describe('continueAfterOrderCreation', () => {
    it('should navigate to /checkout/receipt after CreateOrderSuccess if there is no redirect required', fakeAsync(() => {
      const action = new orderActions.CreateOrderSuccess({ order: { id: '123' } as Order });
      actions$ = of(action);

      effects.continueAfterOrderCreation$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/checkout/receipt');
    }));

    it('should navigate to an external url after CreateOrderSuccess if there is redirect required', fakeAsync(() => {
      // mock location.assign() with jest.fn()
      Object.defineProperty(window, 'location', {
        value: { assign: jest.fn() },
        writable: true,
      });

      const action = new orderActions.CreateOrderSuccess({
        order: {
          id: '123',
          orderCreation: { status: 'STOPPED', stopAction: { type: 'Redirect', redirectUrl: 'http://test' } },
        } as Order,
      });
      actions$ = of(action);

      effects.continueAfterOrderCreation$.subscribe(noop, fail, noop);

      tick(500);

      expect(window.location.assign).toHaveBeenCalled();
    }));
  });

  describe('rollbackAfterOrderCreation', () => {
    it('should navigate to /checkout/payment after CreateOrderSuccess if order creation was rolled back', () => {
      const action = new orderActions.CreateOrderSuccess({
        order: {
          id: '123',
          orderCreation: { status: 'ROLLED_BACK' },
          infos: [{ message: 'Info' }],
        } as Order,
      });
      actions$ = of(action);

      const completion1 = new LoadBasket();
      const completion2 = new ContinueCheckoutWithIssues({
        targetRoute: undefined,
        basketValidation: {
          basket: undefined,
          results: {
            valid: false,
            adjusted: false,
            errors: [{ message: 'Info' } as BasketFeedback],
          },
        },
      });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.rollbackAfterOrderCreation$).toBeObservable(expected$);
    });
  });

  describe('loadOrders$', () => {
    it('should call the orderService for loadOrders', done => {
      const action = new orderActions.LoadOrders();
      actions$ = of(action);

      effects.loadOrders$.subscribe(() => {
        verify(orderServiceMock.getOrders()).once();
        done();
      });
    });

    it('should load all orders of a user and dispatch a LoadOrdersSuccess action', () => {
      const action = new orderActions.LoadOrders();
      const completion = new orderActions.LoadOrdersSuccess({ orders });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrders$).toBeObservable(expected$);
    });

    it('should dispatch a LoadOrdersFail action if a load error occurs', () => {
      when(orderServiceMock.getOrders()).thenReturn(throwError({ message: 'error' }));

      const action = new orderActions.LoadOrders();
      const completion = new orderActions.LoadOrdersFail({ error: { message: 'error' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrders$).toBeObservable(expected$);
    });
  });

  describe('loadOrder$', () => {
    it('should call the orderService for loadOrder', done => {
      const action = new orderActions.LoadOrder({ orderId: order.id });
      actions$ = of(action);

      effects.loadOrder$.subscribe(() => {
        verify(orderServiceMock.getOrder(order.id)).once();
        done();
      });
    });

    it('should load an order of a user and dispatch a LoadOrderSuccess action', () => {
      const action = new orderActions.LoadOrder({ orderId: order.id });
      const completion = new orderActions.LoadOrderSuccess({ order });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrder$).toBeObservable(expected$);
    });

    it('should dispatch a LoadOrderFail action if a load error occurs', () => {
      when(orderServiceMock.getOrder(anyString())).thenReturn(throwError({ message: 'error' }));

      const action = new orderActions.LoadOrder({ orderId: order.id });
      const completion = new orderActions.LoadOrderFail({ error: { message: 'error' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrder$).toBeObservable(expected$);
    });
  });

  describe('loadOrderByApiToken$', () => {
    it('should call the orderService for LoadOrderByAPIToken', done => {
      const action = new orderActions.LoadOrderByAPIToken({ apiToken: 'dummy', orderId: order.id });
      actions$ = of(action);

      effects.loadOrderByAPIToken$.subscribe(() => {
        verify(orderServiceMock.getOrderByToken(order.id, 'dummy')).once();
        done();
      });
    });

    it('should load an order of a user and dispatch a LoadOrderSuccess action', () => {
      const action = new orderActions.LoadOrderByAPIToken({ apiToken: 'dummy', orderId: order.id });
      const completion = new orderActions.LoadOrderSuccess({ order });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrderByAPIToken$).toBeObservable(expected$);
    });

    it('should dispatch a LoadOrderFail action if a load error occurs', () => {
      when(orderServiceMock.getOrderByToken(anyString(), anyString())).thenReturn(throwError({ message: 'error' }));

      const action = new orderActions.LoadOrderByAPIToken({ apiToken: 'dummy', orderId: order.id });
      const completion = new orderActions.LoadOrderFail({ error: { message: 'error' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrderByAPIToken$).toBeObservable(expected$);
    });
  });

  describe('loadOrderForSelectedOrder$', () => {
    it('should fire LoadOrder if an order is selected that is not yet loaded', () => {
      const orderId = '123';
      const action = new orderActions.SelectOrder({ orderId });
      const completion = new orderActions.LoadOrder({ orderId });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrderForSelectedOrder$).toBeObservable(expected$);
    });
  });

  describe('routeListenerForSelectingOrder$', () => {
    it('should fire SelectOrder when route account/order/XXX is navigated', () => {
      const orderId = '123';
      const action = new RouteNavigation({
        path: 'account/orders/:orderId',
        params: { orderId },
      });
      const expected = new orderActions.SelectOrder({ orderId });

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingOrder$).toBeObservable(cold('a', { a: expected }));
    });

    it('should not fire SelectOrder when route /something is navigated', () => {
      const action = new RouteNavigation({ path: 'something' });

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingOrder$).toBeObservable(cold('-'));
    });
  });

  describe('returnFromRedirectAfterOrderCreation$', () => {
    it('should not trigger SelectOrderAfterRedirect action if checkout payment/receipt page is called with query param "redirect" and there is no logged in user and no order', () => {
      const action = new RouteNavigation({
        path: 'checkout/receipt',
        queryParams: { redirect: 'success', param1: 123, orderId: order.id },
      });
      actions$ = hot('-a', { a: action });

      expect(effects.returnFromRedirectAfterOrderCreation$).toBeObservable(cold('-'));
    });

    it('should trigger SelectOrderAfterRedirect action if checkout payment/receipt page is called with query param "redirect" and a user is logged in', () => {
      const customer = { customerNo: 'patricia' } as Customer;
      const user = { firstName: 'patricia' } as User;
      store$.dispatch(new LoginUserSuccess({ customer, user }));
      const params = { redirect: 'success', param1: 123, orderId: order.id };

      const action = new RouteNavigation({
        path: 'checkout/receipt',
        queryParams: { redirect: 'success', param1: 123, orderId: order.id },
      });
      actions$ = hot('-a', { a: action });

      expect(effects.returnFromRedirectAfterOrderCreation$).toBeObservable(
        cold('-c', { c: new orderActions.SelectOrderAfterRedirect({ params }) })
      );
    });

    it('should trigger SelectOrderAfterRedirect action if checkout payment/receipt page is called with query param "redirect" and an order is available', () => {
      store$.dispatch(new orderActions.CreateOrderSuccess({ order }));

      const params = { redirect: 'success', param1: 123, orderId: order.id };

      const action = new RouteNavigation({
        path: 'checkout/receipt',
        queryParams: { redirect: 'success', param1: 123, orderId: order.id },
      });
      actions$ = hot('-a', { a: action });

      expect(effects.returnFromRedirectAfterOrderCreation$).toBeObservable(
        cold('-c', { c: new orderActions.SelectOrderAfterRedirect({ params }) })
      );
    });
  });

  describe('selectOrderAfterRedirect$', () => {
    it('should call the orderService to updatePayment', done => {
      when(orderServiceMock.updateOrderPayment(order.id, anything())).thenReturn(of(undefined));
      const params = { redirect: 'success', param1: 123, orderId: order.id };

      const action = new orderActions.SelectOrderAfterRedirect({ params });
      actions$ = of(action);

      effects.selectOrderAfterRedirect$.subscribe(() => {
        verify(orderServiceMock.updateOrderPayment(order.id, anything())).once();
        done();
      });
    });

    it('should map a successful request of a success redirect to action of type SelectOrder', () => {
      when(orderServiceMock.updateOrderPayment(order.id, anything())).thenReturn(of(order.id));
      const params = { redirect: 'success', param1: 123, orderId: order.id };

      const action = new orderActions.SelectOrderAfterRedirect({ params });
      const completion = new orderActions.SelectOrder({ orderId: order.id });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.selectOrderAfterRedirect$).toBeObservable(expected$);
    });

    it('should map a successful request of a cancelled redirect to action of type LoadBasket', () => {
      when(orderServiceMock.updateOrderPayment(order.id, anything())).thenReturn(of(order.id));
      const params = { redirect: 'cancel', param1: 123, orderId: order.id };

      const action = new orderActions.SelectOrderAfterRedirect({ params });
      const completion = new LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.selectOrderAfterRedirect$).toBeObservable(expected$);
    });

    it('should map an failing request to action of type SelectOrderAfterRedirectFail', () => {
      when(orderServiceMock.updateOrderPayment(order.id, anything())).thenReturn(throwError({ message: 'invalid' }));
      const params = { redirect: 'success', param1: 123, orderId: order.id };

      const action = new orderActions.SelectOrderAfterRedirect({ params });
      const completion = new orderActions.SelectOrderAfterRedirectFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.selectOrderAfterRedirect$).toBeObservable(expected$);
    });
  });

  describe('resetOrdersAfterLogout$', () => {
    it('should map to action of type ResetOrders if LogoutUser action triggered', () => {
      const action = new LogoutUser();
      const completion = new orderActions.ResetOrders();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.resetOrdersAfterLogout$).toBeObservable(expected$);
    });
  });
});
