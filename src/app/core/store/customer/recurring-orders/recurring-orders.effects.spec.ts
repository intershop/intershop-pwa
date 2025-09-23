import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { RecurringOrdersService } from 'ish-core/services/recurring-orders/recurring-orders.service';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectQueryParam } from 'ish-core/store/core/router';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { recurringOrdersActions, recurringOrdersApiActions } from './recurring-orders.actions';
import { RecurringOrdersEffects } from './recurring-orders.effects';
import { getRecurringOrder } from './recurring-orders.selectors';

describe('Recurring Orders Effects', () => {
  let actions$: Observable<Action>;
  let effects: RecurringOrdersEffects;
  let recurringOrdersServiceMock: RecurringOrdersService;
  let store$: MockStore;

  const recurringOrder = { documentNo: '0000001', id: '1', active: true, lineItems: [] } as RecurringOrder;
  const recurringOrders = [
    recurringOrder,
    { number: '0000002', id: '2', active: true, lineItems: [] },
  ] as RecurringOrder[];

  beforeEach(() => {
    recurringOrdersServiceMock = mock(RecurringOrdersService);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: RecurringOrdersService, useFactory: () => instance(recurringOrdersServiceMock) },
        provideMockActions(() => actions$),
        provideMockStore(),
        RecurringOrdersEffects,
      ],
    });

    effects = TestBed.inject(RecurringOrdersEffects);
    store$ = TestBed.inject(MockStore);
  });

  describe('loadRecurringOrders$', () => {
    beforeEach(() => {
      when(recurringOrdersServiceMock.getRecurringOrders(anything())).thenReturn(of(recurringOrders));
    });

    it('should call the recurringOrderService for loadRecurringOrders', done => {
      const action = recurringOrdersActions.loadRecurringOrders({ context: 'MY' });
      actions$ = of(action);

      effects.loadRecurringOrders$.subscribe(() => {
        verify(recurringOrdersServiceMock.getRecurringOrders(anything())).once();
        done();
      });
    });

    it('should load all recurring orders of a user and dispatch a loadRecurringOrdersSuccess action', () => {
      const action = recurringOrdersActions.loadRecurringOrders({ context: 'MY' });
      const completion = recurringOrdersApiActions.loadRecurringOrdersSuccess({ recurringOrders, context: 'MY' });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadRecurringOrders$).toBeObservable(expected$);
    });

    it('should dispatch a loadRecurringOrdersFail action if a load error occurs', () => {
      when(recurringOrdersServiceMock.getRecurringOrders(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'error' }))
      );

      const action = recurringOrdersActions.loadRecurringOrders({ context: 'MY' });
      const completion = recurringOrdersApiActions.loadRecurringOrdersFail({
        error: makeHttpError({ message: 'error' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadRecurringOrders$).toBeObservable(expected$);
    });
  });

  describe('loadRecurringOrder$', () => {
    beforeEach(() => {
      when(recurringOrdersServiceMock.getRecurringOrder(anything(), anything())).thenReturn(of(recurringOrder));
      store$.overrideSelector(selectQueryParam(anything()), 'MY');
    });

    it('should call the recurringOrderService for loadRecurringOrder', done => {
      const action = recurringOrdersActions.loadRecurringOrder({ recurringOrderId: recurringOrder.id });
      actions$ = of(action);

      effects.loadRecurringOrder$.subscribe(() => {
        verify(recurringOrdersServiceMock.getRecurringOrder(recurringOrder.id, anything())).once();
        done();
      });
    });

    it('should map to actions of type loadRecurringOrderSuccess action', () => {
      const action = recurringOrdersActions.loadRecurringOrder({ recurringOrderId: recurringOrder.id });
      const completion = recurringOrdersApiActions.loadRecurringOrderSuccess({ recurringOrder });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadRecurringOrder$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadRecurringOrderFail action', () => {
      when(recurringOrdersServiceMock.getRecurringOrder(anything(), anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'error' }))
      );

      const action = recurringOrdersActions.loadRecurringOrder({ recurringOrderId: recurringOrder.id });
      const completion = recurringOrdersApiActions.loadRecurringOrderFail({
        error: makeHttpError({ message: 'error' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadRecurringOrder$).toBeObservable(expected$);
    });
  });

  describe('updateRecurringOrder$', () => {
    beforeEach(() => {
      when(recurringOrdersServiceMock.updateRecurringOrder(anything(), anything(), anything())).thenReturn(
        of(recurringOrder)
      );
      store$.overrideSelector(selectQueryParam(anything()), 'MY');
      store$.overrideSelector(getRecurringOrder(anything()), recurringOrder);
    });

    it('should call the recurringOrderService for updateRecurringOrder', done => {
      const action = recurringOrdersActions.updateRecurringOrder({
        recurringOrderId: recurringOrder.id,
        active: false,
      });
      actions$ = of(action);

      effects.updateRecurringOrder$.subscribe(() => {
        verify(recurringOrdersServiceMock.updateRecurringOrder(recurringOrder.id, false, anything())).once();
        done();
      });
    });

    it('should call the recurringOrderService to update a recurring order and dispatch updateRecurringOrderSuccess', () => {
      when(recurringOrdersServiceMock.updateRecurringOrder(anything(), anything(), anything())).thenReturn(
        of({ ...recurringOrder, active: false })
      );
      const action = recurringOrdersActions.updateRecurringOrder({
        recurringOrderId: recurringOrder.id,
        active: false,
      });
      const completion = recurringOrdersApiActions.updateRecurringOrderSuccess({
        recurringOrder: { ...recurringOrder, active: false },
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.updateRecurringOrder$).toBeObservable(expected$);
    });

    it('should dispatch updateRecurringOrderFail if an error occurs while updating a recurring order', () => {
      when(recurringOrdersServiceMock.updateRecurringOrder(recurringOrder.id, false, undefined)).thenReturn(
        throwError(() => makeHttpError({ message: 'error' }))
      );

      const action = recurringOrdersActions.updateRecurringOrder({
        recurringOrderId: recurringOrder.id,
        active: false,
      });
      const completion = recurringOrdersApiActions.updateRecurringOrderFail({
        error: makeHttpError({ message: 'error' }),
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.updateRecurringOrder$).toBeObservable(expected$);
    });
  });

  describe('deleteRecurringOrder$', () => {
    beforeEach(() => {
      when(recurringOrdersServiceMock.deleteRecurringOrder(recurringOrder.id, anything())).thenReturn(of(undefined));
      store$.overrideSelector(selectQueryParam(anything()), 'MY');
    });

    it('should call the service when deleteRecurringOrder event is called', done => {
      const action = recurringOrdersActions.deleteRecurringOrder({
        recurringOrderId: recurringOrder.id,
      });
      actions$ = of(action);

      effects.deleteRecurringOrder$.subscribe(() => {
        verify(recurringOrdersServiceMock.deleteRecurringOrder(recurringOrder.id, anything())).once();
        done();
      });
    });

    it('should dispatch a deleteRecurringOrder action on successful', () => {
      const action = recurringOrdersActions.deleteRecurringOrder({
        recurringOrderId: recurringOrder.id,
      });
      const completion1 = recurringOrdersApiActions.deleteRecurringOrderSuccess({
        recurringOrderId: recurringOrder.id,
      });

      const completion2 = displaySuccessMessage({
        message: 'account.recurring_order.delete.confirmation',
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.deleteRecurringOrder$).toBeObservable(expected$);
    });

    it('should dispatch a deleteRecurringOrderFail action on failed', () => {
      when(recurringOrdersServiceMock.deleteRecurringOrder(anything(), anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'error' }))
      );

      const action = recurringOrdersActions.deleteRecurringOrder({
        recurringOrderId: recurringOrder.id,
      });
      const completion = recurringOrdersApiActions.deleteRecurringOrderFail({
        error: makeHttpError({ message: 'error' }),
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.deleteRecurringOrder$).toBeObservable(expected$);
    });
  });
});
