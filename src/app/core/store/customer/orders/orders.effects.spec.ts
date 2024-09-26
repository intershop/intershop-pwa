import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold, hot } from 'jasmine-marbles';
import { Observable, noop, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Order } from 'ish-core/models/order/order.model';
import { User } from 'ish-core/models/user/user.model';
import { OrderService } from 'ish-core/services/order/order.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadBasket, loadBasketSuccess } from 'ish-core/store/customer/basket';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { routerTestNavigatedAction } from 'ish-core/utils/dev/routing';

import {
  createOrder,
  createOrderFail,
  createOrderSuccess,
  loadMoreOrders,
  loadOrder,
  loadOrderByAPIToken,
  loadOrderFail,
  loadOrderSuccess,
  loadOrders,
  loadOrdersFail,
  loadOrdersSuccess,
  selectOrder,
  selectOrderAfterRedirect,
  selectOrderAfterRedirectFail,
} from './orders.actions';
import { OrdersEffects } from './orders.effects';

describe('Orders Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrdersEffects;
  let orderServiceMock: OrderService;
  let store: Store;
  let location: Location;
  let router: Router;

  const order = { id: '1', documentNo: '00000001', lineItems: [] } as Order;
  const orders = [order, { id: '2', documentNo: '00000002' }] as Order[];

  beforeEach(() => {
    orderServiceMock = mock(OrderService);
    when(orderServiceMock.getOrders(anything())).thenReturn(of(orders));
    when(orderServiceMock.getOrder(anyString())).thenReturn(of(order));
    when(orderServiceMock.getOrderByToken(anyString(), anyString())).thenReturn(of(order));

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router']),
        CustomerStoreModule.forTesting('user', 'orders', 'basket'),
        RouterTestingModule.withRoutes([
          {
            path: 'checkout',
            children: [
              { path: 'receipt', children: [] },
              { path: 'payment', children: [] },
            ],
          },
          { path: 'account/orders/:orderId', children: [] },
          { path: '**', children: [] },
        ]),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: OrderService, useFactory: () => instance(orderServiceMock) },
        OrdersEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(OrdersEffects);
    store = TestBed.inject(Store);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  describe('createOrder$', () => {
    beforeEach(() => {
      store.dispatch(loadBasketSuccess({ basket: { id: 'BID' } as Basket }));
    });

    it('should call the orderService for createOrder', done => {
      when(orderServiceMock.createOrder(anything(), anything())).thenReturn(of(undefined));
      const payload = 'BID';
      const action = createOrder();
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
      const action = createOrder();
      const completion = createOrderSuccess({ order: newOrder, basketId: 'BID' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createOrder$).toBeObservable(expected$);
    });

    it('should map an invalid request to action of type CreateOrderFail', () => {
      when(orderServiceMock.createOrder(anything(), anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = createOrder();
      const completion = createOrderFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createOrder$).toBeObservable(expected$);
    });
  });

  describe('continueAfterOrderCreation', () => {
    it('should navigate to /checkout/receipt after CreateOrderSuccess if there is no redirect required', fakeAsync(() => {
      const action = createOrderSuccess({ order: { id: '123' } as Order, basketId: 'BID' });
      actions$ = of(action);

      effects.continueAfterOrderCreation$.subscribe({ next: noop, error: fail, complete: noop });

      tick(500);

      expect(location.path()).toEqual('/checkout/receipt?orderId=123');
    }));

    it('should navigate to an external url after CreateOrderSuccess if there is redirect required', fakeAsync(() => {
      // mock location.assign() with jest.fn()
      Object.defineProperty(window, 'location', {
        value: { assign: jest.fn() },
        writable: true,
      });

      const action = createOrderSuccess({
        order: {
          id: '123',
          orderCreation: { status: 'STOPPED', stopAction: { type: 'Redirect', redirectUrl: 'http://test' } },
        } as Order,
        basketId: 'BID',
      });
      actions$ = of(action);

      effects.continueAfterOrderCreation$.subscribe({ next: noop, error: fail, complete: noop });

      tick(500);

      expect(window.location.assign).toHaveBeenCalled();
    }));
  });

  describe('rollbackAfterOrderCreation', () => {
    it('should navigate to /checkout/payment after CreateOrderSuccess if order creation was rolled back', done => {
      const action = createOrderSuccess({
        order: {
          id: '123',
          orderCreation: { status: 'ROLLED_BACK' },
          infos: [{ message: 'Info' }],
        } as Order,
        basketId: 'BID',
      });
      actions$ = of(action);

      effects.rollbackAfterOrderCreation$.pipe(toArray()).subscribe({
        next: actions => {
          expect(actions).toMatchInlineSnapshot(`
            [Basket Internal] Load Basket
            [Basket API] Validate Basket and continue with issues:
              targetRoute: undefined
              basketValidation: {"results":{"valid":false,"adjusted":false,"errors":[1]}}
          `);

          expect(location.path()).toMatchInlineSnapshot(`"/checkout/payment?error=true"`);

          done();
        },
        error: fail,
        complete: noop,
      });
    });
  });

  describe('loadOrders$', () => {
    it('should call the orderService for loadOrders', done => {
      const action = loadOrders({ query: { limit: 30 } });
      actions$ = of(action);

      effects.loadOrders$.subscribe(() => {
        verify(orderServiceMock.getOrders(anything())).once();
        done();
      });
    });

    it('should load all orders of a user and dispatch a LoadOrdersSuccess action', () => {
      const query = { limit: 30 };
      const action = loadOrders({ query });
      const completion = loadOrdersSuccess({ orders, query, allRetrieved: true });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrders$).toBeObservable(expected$);
    });

    it('should report more available if limit was reached', () => {
      const query = { limit: orders.length };
      const action = loadOrders({ query });
      const completion = loadOrdersSuccess({ orders, query, allRetrieved: false });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrders$).toBeObservable(expected$);
    });

    it('should dispatch a LoadOrdersFail action if a load error occurs', () => {
      when(orderServiceMock.getOrders(anything())).thenReturn(throwError(() => makeHttpError({ message: 'error' })));

      const action = loadOrders({ query: { limit: 30 } });
      const completion = loadOrdersFail({ error: makeHttpError({ message: 'error' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrders$).toBeObservable(expected$);
    });
  });

  describe('loadMoreOrders$', () => {
    it('should load more orders', () => {
      store.dispatch(loadOrdersSuccess({ orders, query: { limit: 30 } }));

      const action = loadMoreOrders();
      const completion = loadOrders({ query: { limit: 30, offset: 30 } });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadMoreOrders$).toBeObservable(expected$);
    });
  });

  describe('loadOrder$', () => {
    it('should call the orderService for loadOrder', done => {
      const action = loadOrder({ orderId: order.id });
      actions$ = of(action);

      effects.loadOrder$.subscribe(() => {
        verify(orderServiceMock.getOrder(order.id)).once();
        done();
      });
    });

    it('should load an order of a user and dispatch a LoadOrderSuccess action', () => {
      const action = loadOrder({ orderId: order.id });
      const completion = loadOrderSuccess({ order });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrder$).toBeObservable(expected$);
    });

    it('should dispatch a LoadOrderFail action if a load error occurs', () => {
      when(orderServiceMock.getOrder(anyString())).thenReturn(throwError(() => makeHttpError({ message: 'error' })));

      const action = loadOrder({ orderId: order.id });
      const completion = loadOrderFail({ error: makeHttpError({ message: 'error' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrder$).toBeObservable(expected$);
    });
  });

  describe('loadOrderByApiToken$', () => {
    it('should call the orderService for LoadOrderByAPIToken', done => {
      const action = loadOrderByAPIToken({ apiToken: 'dummy', orderId: order.id });
      actions$ = of(action);

      effects.loadOrderByAPIToken$.subscribe(() => {
        verify(orderServiceMock.getOrderByToken(order.id, 'dummy')).once();
        done();
      });
    });

    it('should load an order of a user and dispatch a LoadOrderSuccess action', () => {
      const action = loadOrderByAPIToken({ apiToken: 'dummy', orderId: order.id });
      const completion = loadOrderSuccess({ order });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrderByAPIToken$).toBeObservable(expected$);
    });

    it('should dispatch a LoadOrderFail action if a load error occurs', () => {
      when(orderServiceMock.getOrderByToken(anyString(), anyString())).thenReturn(
        throwError(() => makeHttpError({ message: 'error' }))
      );

      const action = loadOrderByAPIToken({ apiToken: 'dummy', orderId: order.id });
      const completion = loadOrderFail({ error: makeHttpError({ message: 'error' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrderByAPIToken$).toBeObservable(expected$);
    });
  });

  describe('loadOrderForSelectedOrder$', () => {
    it('should fire LoadOrder if an order is selected that is not yet loaded', () => {
      const orderId = '123';
      const action = selectOrder({ orderId });
      const completion = loadOrder({ orderId });
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
          [Orders Internal] Select Order:
            orderId: "123"
        `);
        done();
      });
    });

    it('should not fire SelectOrder when route /something is navigated', fakeAsync(() => {
      router.navigateByUrl('/something');

      effects.routeListenerForSelectingOrder$.subscribe({ next: fail, error: fail });

      tick(2000);
    }));
  });

  describe('returnFromRedirectAfterOrderCreation$', () => {
    it('should not trigger SelectOrderAfterRedirect action if checkout payment/receipt page is called with query param "redirect" and there is no logged in user and no order', fakeAsync(() => {
      router.navigate(['checkout', 'receipt'], {
        queryParams: { redirect: 'success', param1: 123, orderId: order.id },
      });

      effects.returnFromRedirectAfterOrderCreation$.subscribe({ next: fail, error: fail });

      tick(2000);
    }));

    it('should trigger SelectOrderAfterRedirect action if checkout payment/receipt page is called with query param "redirect" and a user is logged in', done => {
      const customer = { customerNo: 'patricia' } as Customer;
      const user = { firstName: 'patricia' } as User;
      store.dispatch(loginUserSuccess({ customer, user }));

      router.navigate(['checkout', 'receipt'], {
        queryParams: { redirect: 'success', param1: 123, orderId: order.id },
      });

      effects.returnFromRedirectAfterOrderCreation$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Orders Internal] Select Order After Checkout Redirect:
            params: {"redirect":"success","param1":"123","orderId":"1"}
        `);
        done();
      });
    });

    it('should trigger SelectOrderAfterRedirect action if checkout payment/receipt page is called with query param "redirect" and an order is available', done => {
      store.dispatch(createOrderSuccess({ order, basketId: 'BID' }));

      router.navigate(['checkout', 'receipt'], {
        queryParams: { redirect: 'success', param1: 123, orderId: order.id },
      });

      effects.returnFromRedirectAfterOrderCreation$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Orders Internal] Select Order After Checkout Redirect:
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

      const action = selectOrderAfterRedirect({ params });
      actions$ = of(action);

      effects.selectOrderAfterRedirect$.subscribe(() => {
        verify(orderServiceMock.updateOrderPayment(order.id, anything())).once();
        done();
      });
    });

    it('should map a successful request of a success redirect to action of type SelectOrder', () => {
      when(orderServiceMock.updateOrderPayment(order.id, anything())).thenReturn(of(order.id));
      const params = { redirect: 'success', param1: 123, orderId: order.id };

      const action = selectOrderAfterRedirect({ params });
      const completion = selectOrder({ orderId: order.id });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.selectOrderAfterRedirect$).toBeObservable(expected$);
    });

    it('should map a successful request of a cancelled redirect to action of type LoadBasket', () => {
      when(orderServiceMock.updateOrderPayment(order.id, anything())).thenReturn(of(order.id));
      const params = { redirect: 'cancel', param1: 123, orderId: order.id };

      const action = selectOrderAfterRedirect({ params });
      const completion = loadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.selectOrderAfterRedirect$).toBeObservable(expected$);
    });

    it('should map an failing request to action of type SelectOrderAfterRedirectFail', () => {
      when(orderServiceMock.updateOrderPayment(order.id, anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const params = { redirect: 'success', param1: 123, orderId: order.id };

      const action = selectOrderAfterRedirect({ params });
      const completion = selectOrderAfterRedirectFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.selectOrderAfterRedirect$).toBeObservable(expected$);
    });
  });

  describe('setOrderBreadcrumb$', () => {
    beforeEach(fakeAsync(() => {
      store.dispatch(loadOrdersSuccess({ orders, query: { limit: 30 } }));
      router.navigateByUrl(`/account/orders/${orders[0].id}`);
      tick(500);
      store.dispatch(selectOrder({ orderId: orders[0].id }));
    }));

    it('should set the breadcrumb of the selected order', done => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      actions$ = of(routerTestNavigatedAction({}));

      effects.setOrderBreadcrumb$.subscribe(action => {
        expect(action.payload).toMatchInlineSnapshot(`
          {
            "breadcrumbData": [
              {
                "key": "account.order_history.link",
                "link": "/account/orders",
              },
              {
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
