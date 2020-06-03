import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold, hot } from 'jest-marbles';
import { Observable, noop, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { BasketFeedback } from 'ish-core/models/basket-feedback/basket-feedback.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';
import { User } from 'ish-core/models/user/user.model';
import { OrderService } from 'ish-core/services/order/order.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ContinueCheckoutWithIssues, LoadBasket } from 'ish-core/store/customer/basket';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { LoginUserSuccess } from 'ish-core/store/customer/user';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import {
  CreateOrder,
  CreateOrderFail,
  CreateOrderSuccess,
  LoadOrder,
  LoadOrderByAPIToken,
  LoadOrderFail,
  LoadOrderSuccess,
  LoadOrders,
  LoadOrdersFail,
  LoadOrdersSuccess,
  SelectOrder,
  SelectOrderAfterRedirect,
  SelectOrderAfterRedirectFail,
} from './orders.actions';
import { OrdersEffects } from './orders.effects';

describe('Orders Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrdersEffects;
  let orderServiceMock: OrderService;
  let store$: Store;
  let location: Location;
  let router: Router;

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
        CoreStoreModule.forTesting(['router']),
        CustomerStoreModule.forTesting('user', 'orders'),
        RouterTestingModule.withRoutes([
          {
            path: 'checkout',
            children: [
              { path: 'receipt', component: DummyComponent },
              { path: 'payment', component: DummyComponent },
            ],
          },
          { path: 'account/orders/:orderId', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
        ShoppingStoreModule.forTesting('products', 'categories'),
        TranslateModule.forRoot(),
      ],
      providers: [
        OrdersEffects,
        provideMockActions(() => actions$),
        { provide: OrderService, useFactory: () => instance(orderServiceMock) },
      ],
    });

    effects = TestBed.inject(OrdersEffects);
    store$ = TestBed.inject(Store);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  describe('createOrder$', () => {
    it('should call the orderService for createOrder', done => {
      when(orderServiceMock.createOrder(anything(), anything())).thenReturn(of(undefined));
      const payload = BasketMockData.getBasket().id;
      const action = new CreateOrder({ basketId: payload });
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
      const action = new CreateOrder({ basketId });
      const completion = new CreateOrderSuccess({ order: newOrder });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createOrder$).toBeObservable(expected$);
    });

    it('should map an invalid request to action of type CreateOrderFail', () => {
      when(orderServiceMock.createOrder(anything(), anything())).thenReturn(throwError({ message: 'invalid' }));
      const basketId = BasketMockData.getBasket().id;
      const action = new CreateOrder({ basketId });
      const completion = new CreateOrderFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createOrder$).toBeObservable(expected$);
    });
  });

  describe('continueAfterOrderCreation', () => {
    it('should navigate to /checkout/receipt after CreateOrderSuccess if there is no redirect required', fakeAsync(() => {
      const action = new CreateOrderSuccess({ order: { id: '123' } as Order });
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

      const action = new CreateOrderSuccess({
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
      const action = new CreateOrderSuccess({
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
      const action = new LoadOrders();
      actions$ = of(action);

      effects.loadOrders$.subscribe(() => {
        verify(orderServiceMock.getOrders()).once();
        done();
      });
    });

    it('should load all orders of a user and dispatch a LoadOrdersSuccess action', () => {
      const action = new LoadOrders();
      const completion = new LoadOrdersSuccess({ orders });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrders$).toBeObservable(expected$);
    });

    it('should dispatch a LoadOrdersFail action if a load error occurs', () => {
      when(orderServiceMock.getOrders()).thenReturn(throwError({ message: 'error' }));

      const action = new LoadOrders();
      const completion = new LoadOrdersFail({ error: { message: 'error' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrders$).toBeObservable(expected$);
    });
  });

  describe('loadOrder$', () => {
    it('should call the orderService for loadOrder', done => {
      const action = new LoadOrder({ orderId: order.id });
      actions$ = of(action);

      effects.loadOrder$.subscribe(() => {
        verify(orderServiceMock.getOrder(order.id)).once();
        done();
      });
    });

    it('should load an order of a user and dispatch a LoadOrderSuccess action', () => {
      const action = new LoadOrder({ orderId: order.id });
      const completion = new LoadOrderSuccess({ order });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrder$).toBeObservable(expected$);
    });

    it('should dispatch a LoadOrderFail action if a load error occurs', () => {
      when(orderServiceMock.getOrder(anyString())).thenReturn(throwError({ message: 'error' }));

      const action = new LoadOrder({ orderId: order.id });
      const completion = new LoadOrderFail({ error: { message: 'error' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrder$).toBeObservable(expected$);
    });
  });

  describe('loadOrderByApiToken$', () => {
    it('should call the orderService for LoadOrderByAPIToken', done => {
      const action = new LoadOrderByAPIToken({ apiToken: 'dummy', orderId: order.id });
      actions$ = of(action);

      effects.loadOrderByAPIToken$.subscribe(() => {
        verify(orderServiceMock.getOrderByToken(order.id, 'dummy')).once();
        done();
      });
    });

    it('should load an order of a user and dispatch a LoadOrderSuccess action', () => {
      const action = new LoadOrderByAPIToken({ apiToken: 'dummy', orderId: order.id });
      const completion = new LoadOrderSuccess({ order });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrderByAPIToken$).toBeObservable(expected$);
    });

    it('should dispatch a LoadOrderFail action if a load error occurs', () => {
      when(orderServiceMock.getOrderByToken(anyString(), anyString())).thenReturn(throwError({ message: 'error' }));

      const action = new LoadOrderByAPIToken({ apiToken: 'dummy', orderId: order.id });
      const completion = new LoadOrderFail({ error: { message: 'error' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrderByAPIToken$).toBeObservable(expected$);
    });
  });

  describe('loadOrderForSelectedOrder$', () => {
    it('should fire LoadOrder if an order is selected that is not yet loaded', () => {
      const orderId = '123';
      const action = new SelectOrder({ orderId });
      const completion = new LoadOrder({ orderId });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrderForSelectedOrder$).toBeObservable(expected$);
    });
  });

  describe('routeListenerForSelectingOrder$', () => {
    it('should fire SelectOrder when route account/order/XXX is navigated', done => {
      router.navigateByUrl('/account/orders/123');

      effects.routeListenerForSelectingOrder$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Order] Select Order:
            orderId: "123"
        `);
        done();
      });
    });

    it('should not fire SelectOrder when route /something is navigated', done => {
      router.navigateByUrl('/something');

      effects.routeListenerForSelectingOrder$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });
  });

  describe('returnFromRedirectAfterOrderCreation$', () => {
    it('should not trigger SelectOrderAfterRedirect action if checkout payment/receipt page is called with query param "redirect" and there is no logged in user and no order', done => {
      router.navigate(['checkout', 'receipt'], {
        queryParams: { redirect: 'success', param1: 123, orderId: order.id },
      });

      effects.returnFromRedirectAfterOrderCreation$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });

    it('should trigger SelectOrderAfterRedirect action if checkout payment/receipt page is called with query param "redirect" and a user is logged in', done => {
      const customer = { customerNo: 'patricia' } as Customer;
      const user = { firstName: 'patricia' } as User;
      store$.dispatch(new LoginUserSuccess({ customer, user }));

      router.navigate(['checkout', 'receipt'], {
        queryParams: { redirect: 'success', param1: 123, orderId: order.id },
      });

      effects.returnFromRedirectAfterOrderCreation$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Order Internal] Select Order After Checkout Redirect:
            params: {"redirect":"success","param1":"123","orderId":"1"}
        `);
        done();
      });
    });

    it('should trigger SelectOrderAfterRedirect action if checkout payment/receipt page is called with query param "redirect" and an order is available', done => {
      store$.dispatch(new CreateOrderSuccess({ order }));

      router.navigate(['checkout', 'receipt'], {
        queryParams: { redirect: 'success', param1: 123, orderId: order.id },
      });

      effects.returnFromRedirectAfterOrderCreation$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Order Internal] Select Order After Checkout Redirect:
            params: {"redirect":"success","param1":"123","orderId":"1"}
        `);
        done();
      });
    });
  });

  describe('selectOrderAfterRedirect$', () => {
    it('should call the orderService to updatePayment', done => {
      when(orderServiceMock.updateOrderPayment(order.id, anything())).thenReturn(of(undefined));
      const params = { redirect: 'success', param1: 123, orderId: order.id };

      const action = new SelectOrderAfterRedirect({ params });
      actions$ = of(action);

      effects.selectOrderAfterRedirect$.subscribe(() => {
        verify(orderServiceMock.updateOrderPayment(order.id, anything())).once();
        done();
      });
    });

    it('should map a successful request of a success redirect to action of type SelectOrder', () => {
      when(orderServiceMock.updateOrderPayment(order.id, anything())).thenReturn(of(order.id));
      const params = { redirect: 'success', param1: 123, orderId: order.id };

      const action = new SelectOrderAfterRedirect({ params });
      const completion = new SelectOrder({ orderId: order.id });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.selectOrderAfterRedirect$).toBeObservable(expected$);
    });

    it('should map a successful request of a cancelled redirect to action of type LoadBasket', () => {
      when(orderServiceMock.updateOrderPayment(order.id, anything())).thenReturn(of(order.id));
      const params = { redirect: 'cancel', param1: 123, orderId: order.id };

      const action = new SelectOrderAfterRedirect({ params });
      const completion = new LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.selectOrderAfterRedirect$).toBeObservable(expected$);
    });

    it('should map an failing request to action of type SelectOrderAfterRedirectFail', () => {
      when(orderServiceMock.updateOrderPayment(order.id, anything())).thenReturn(throwError({ message: 'invalid' }));
      const params = { redirect: 'success', param1: 123, orderId: order.id };

      const action = new SelectOrderAfterRedirect({ params });
      const completion = new SelectOrderAfterRedirectFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.selectOrderAfterRedirect$).toBeObservable(expected$);
    });
  });

  describe('selectOrderAfterRedirectFailed', () => {
    it('should navigate to /checkout/payment if order creation failed after redirect', fakeAsync(() => {
      const action = new SelectOrderAfterRedirectFail(undefined);
      actions$ = of(action);

      effects.selectOrderAfterRedirectFailed$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/checkout/payment?redirect=failure');
    }));

    it('should map to action of type LoadBasket', () => {
      const action = new SelectOrderAfterRedirectFail(undefined);
      const completion = new LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.selectOrderAfterRedirectFailed$).toBeObservable(expected$);
    });
  });

  describe('setOrderBreadcrumb$', () => {
    beforeEach(() => {
      store$.dispatch(new LoadOrdersSuccess({ orders }));
      store$.dispatch(new SelectOrder({ orderId: orders[0].id }));
    });

    it('should set the breadcrumb of the selected order', done => {
      effects.setOrderBreadcrumb$.subscribe(action => {
        expect(action.payload).toMatchInlineSnapshot(`
          Object {
            "breadcrumbData": Array [
              Object {
                "key": "account.order_history.link",
                "link": "/account/orders",
              },
              Object {
                "text": "account.orderdetails.breadcrumb - 00000001",
              },
            ],
          }
        `);
        done();
      });
    });
  });
});
