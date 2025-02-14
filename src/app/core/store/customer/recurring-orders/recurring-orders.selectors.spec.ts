import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { recurringOrdersActions } from './recurring-orders.actions';
import { getRecurringOrdersError, getRecurringOrdersLoading } from './recurring-orders.selectors';

describe('Recurring Orders Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), CustomerStoreModule.forTesting('recurringOrders')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getRecurringOrdersLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getRecurringOrdersError(store$.state)).toBeUndefined();
    });
  });

  describe('loadRecurringOrders', () => {
    beforeEach(() => {
      store$.dispatch(recurringOrdersActions.loadRecurringOrders({ context: 'MY' }));
    });

    it('should set loading to true', () => {
      expect(getRecurringOrdersLoading(store$.state)).toBeTrue();
    });
  });
});
