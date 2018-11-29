import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { HttpError } from '../../models/http-error/http-error.model';
import { Order } from '../../models/order/order.model';
import { OrderService } from '../../services/order/order.service';
import { coreReducers } from '../core.system';
import { LogoutUser } from '../user';

import * as orderActions from './orders.actions';
import { OrdersEffects } from './orders.effects';

describe('Orders Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrdersEffects;
  let orderServiceMock: OrderService;

  const orders = [{ id: '1', documentNo: '00000001' }, { id: '2', documentNo: '00000002' }] as Order[];

  beforeEach(() => {
    orderServiceMock = mock(OrderService);
    when(orderServiceMock.getOrders()).thenReturn(of(orders));

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
      providers: [
        OrdersEffects,
        provideMockActions(() => actions$),
        { provide: OrderService, useFactory: () => instance(orderServiceMock) },
      ],
    });

    effects = TestBed.get(OrdersEffects);
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
      const completion = new orderActions.LoadOrdersSuccess(orders);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrders$).toBeObservable(expected$);
    });

    it('should dispatch a LoadOrdersFail action if a load error occurs', () => {
      when(orderServiceMock.getOrders()).thenReturn(throwError({ message: 'error' }));

      const action = new orderActions.LoadOrders();
      const completion = new orderActions.LoadOrdersFail({ message: 'error' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrders$).toBeObservable(expected$);
    });
  });

  describe('routeListenerForSelectingOrder$', () => {
    it('should fire SelectOrder when route account/order/XXX is navigated', () => {
      const orderId = '123';
      const action = new RouteNavigation({
        path: 'order/:orderId',
        params: { orderId: orderId },
        queryParams: {},
      });
      const expected = new orderActions.SelectOrder(orderId);

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingOrder$).toBeObservable(cold('a', { a: expected }));
    });

    it('should not fire SelectOrder when route /something is navigated', () => {
      const action = new RouteNavigation({ path: 'something', params: {}, queryParams: {} });

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingOrder$).toBeObservable(cold('-'));
    });
  });

  describe('loadOrdersForSelectedOrder$', () => {
    it('should fire LoadOrders if an order is selected that is not yet loaded', () => {
      const orderId = '123';
      const action = new orderActions.SelectOrder(orderId);
      const completion = new orderActions.LoadOrders();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrdersForSelectedOrder$).toBeObservable(expected$);
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
