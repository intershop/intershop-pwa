import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { RecurringOrdersService } from 'ish-core/services/recurring-orders/recurring-orders.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { recurringOrdersActions } from './recurring-orders.actions';
import { RecurringOrdersEffects } from './recurring-orders.effects';

describe('Recurring Orders Effects', () => {
  let actions$: Observable<Action>;
  let effects: RecurringOrdersEffects;
  let recurringOrdersServiceMock: RecurringOrdersService;

  const order = { documentNo: '0000001', id: '1', active: true, lineItems: [] } as RecurringOrder;
  const recurringOrders = [order, { number: '0000002', id: '2', active: true, lineItems: [] }] as RecurringOrder[];

  beforeEach(() => {
    recurringOrdersServiceMock = mock(RecurringOrdersService);
    when(recurringOrdersServiceMock.getRecurringOrders(anything())).thenReturn(of(recurringOrders));

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), TranslateModule.forRoot()],
      providers: [
        { provide: RecurringOrdersService, useFactory: () => instance(recurringOrdersServiceMock) },
        provideMockActions(() => actions$),
        RecurringOrdersEffects,
      ],
    });

    effects = TestBed.inject(RecurringOrdersEffects);
  });

  describe('loadRecurringOrders$', () => {
    it('should call the RecurringOrderService for loadRecurringOrders', done => {
      const action = recurringOrdersActions.loadRecurringOrders({ context: 'MY' });
      actions$ = of(action);

      effects.loadRecurringOrders$.subscribe(() => {
        verify(recurringOrdersServiceMock.getRecurringOrders(anything())).once();
        done();
      });
    });
  });
});
