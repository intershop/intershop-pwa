import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { recurringOrdersActions, recurringOrdersApiActions } from './recurring-orders.actions';
import {
  getRecurringOrder,
  getRecurringOrders,
  getRecurringOrdersError,
  getRecurringOrdersLoading,
  getSelectedRecurringOrder,
} from './recurring-orders.selectors';

describe('Recurring Orders Selectors', () => {
  let store$: StoreWithSnapshots;
  let router: Router;

  const recurringOrders = [
    { documentNo: '0000001', id: '1', active: true, lineItems: [] },
    { documentNo: '0000002', id: '2', active: true, lineItems: [] },
  ] as RecurringOrder[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router']),
        CustomerStoreModule.forTesting('recurringOrders'),
        RouterTestingModule.withRoutes([{ path: 'recurring-orders/:recurringOrderId', children: [] }]),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getRecurringOrdersLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getRecurringOrdersError(store$.state)).toBeUndefined();
    });

    it('should not have an entity when in initial state', () => {
      expect(getRecurringOrder('1')(store$.state)).toBeUndefined();
    });
  });

  describe('LoadRecurringOrdersSuccess', () => {
    beforeEach(() => {
      store$.dispatch(recurringOrdersApiActions.loadRecurringOrdersSuccess({ recurringOrders, context: 'MY' }));
    });

    it('should set loading to false', () => {
      expect(getRecurringOrdersLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when successfully loaded', () => {
      expect(getRecurringOrdersError(store$.state)).toBeUndefined();
    });

    it('should have recurring orders when successfully loaded', () => {
      expect(getRecurringOrders('MY')(store$.state)).toHaveLength(2);
    });

    it('should have recurring orders entities when loaded', () => {
      expect(getRecurringOrder('1')(store$.state)).toBeTruthy();
      expect(getRecurringOrder('1')(store$.state)).toMatchInlineSnapshot(`
        {
          "active": true,
          "documentNo": "0000001",
          "id": "1",
          "lineItems": [],
        }
      `);
    });
  });

  describe('loadRecurringOrdersFail', () => {
    beforeEach(() => {
      store$.dispatch(
        recurringOrdersApiActions.loadRecurringOrdersFail({ error: makeHttpError({ message: 'error' }) })
      );
    });

    it('should set loading to false', () => {
      expect(getRecurringOrdersLoading(store$.state)).toBeFalse();
    });

    it('should have an error when reducing', () => {
      expect(getRecurringOrdersError(store$.state)).toBeTruthy();
    });
  });

  describe('loadRecurringOrder', () => {
    beforeEach(() => {
      store$.dispatch(recurringOrdersApiActions.loadRecurringOrderSuccess({ recurringOrder: recurringOrders[0] }));
    });

    it('should set loading to false', () => {
      expect(getRecurringOrdersLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when successfully loaded entities', () => {
      expect(getRecurringOrdersError(store$.state)).toBeUndefined();
    });

    it('should have entities when successfully loading', () => {
      expect(getRecurringOrder('1')(store$.state)).toBeTruthy();
      expect(getRecurringOrder('1')(store$.state)).toMatchInlineSnapshot(`
        {
          "active": true,
          "documentNo": "0000001",
          "id": "1",
          "lineItems": [],
        }
      `);
    });

    describe('SelectedRecurringOrder', () => {
      beforeEach(() => {
        store$.dispatch(recurringOrdersApiActions.loadRecurringOrdersSuccess({ recurringOrders, context: 'MY' }));
      });

      describe('with recurring order detail route', () => {
        beforeEach(fakeAsync(() => {
          router.navigate(['recurring-orders', '2']);
          tick(500);
        }));

        it('should return the recurring order information when used', () => {
          expect(getRecurringOrders('MY')(store$.state)).not.toBeEmpty();
          expect(getRecurringOrdersLoading(store$.state)).toBeFalse();
        });

        it('should return the selected recurring order when the id is given as query param', () => {
          expect(getSelectedRecurringOrder(store$.state)).toBeTruthy();
        });
      });
    });

    describe('DeleteRecurringOrder', () => {
      beforeEach(() => {
        store$.dispatch(recurringOrdersActions.deleteRecurringOrder({ recurringOrderId: '1' }));
      });

      it('should set loading to true', () => {
        expect(getRecurringOrdersLoading(store$.state)).toBeTrue();
      });

      describe('deleteRecurringOrderSuccess', () => {
        beforeEach(() => {
          store$.dispatch(recurringOrdersApiActions.loadRecurringOrdersSuccess({ recurringOrders, context: 'MY' }));
          store$.dispatch(recurringOrdersApiActions.deleteRecurringOrderSuccess({ recurringOrderId: '1' }));
        });

        it('should set loading to false', () => {
          expect(getRecurringOrdersLoading(store$.state)).toBeFalse();
        });

        it('should update the recurring order after deletion', () => {
          expect(getRecurringOrders('MY')(store$.state)).toContainEqual(recurringOrders[1]);
          expect(getRecurringOrders('MY')(store$.state)).toHaveLength(1);
          expect(getRecurringOrder('1')(store$.state)).toBeUndefined();
        });
      });

      describe('DeleteRecurringOrderFail', () => {
        const failAction = recurringOrdersApiActions.deleteRecurringOrderFail({
          error: makeHttpError({ message: 'invalid' }),
        });

        beforeEach(() => {
          store$.dispatch(failAction);
        });

        it('should set loading to false', () => {
          expect(getRecurringOrdersLoading(store$.state)).toBeFalse();
        });

        it('should add the error to state', () => {
          expect(getRecurringOrdersError(store$.state)).toMatchInlineSnapshot(`
          {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
        });
      });
    });
  });
});
