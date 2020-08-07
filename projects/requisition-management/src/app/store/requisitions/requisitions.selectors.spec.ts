import { TestBed } from '@angular/core/testing';

import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { Requisition } from '../../models/requisition/requisition.model';
import { RequisitionManagementStoreModule } from '../requisition-management-store.module';

import {
  loadRequisition,
  loadRequisitionSuccess,
  loadRequisitions,
  loadRequisitionsFail,
  loadRequisitionsSuccess,
} from './requisitions.actions';
import {
  getRequisition,
  getRequisitions,
  getRequisitionsError,
  getRequisitionsLoading,
} from './requisitions.selectors';

describe('Requisitions Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        RequisitionManagementStoreModule.forTesting('requisitions'),
        ShoppingStoreModule.forTesting('products', 'categories'),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getRequisitionsLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getRequisitionsError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getRequisitions(store$.state)).toBeEmpty();
    });
  });

  describe('LoadRequisitions', () => {
    const action = loadRequisitions({ view: 'buyer', status: 'pending' });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getRequisitionsLoading(store$.state)).toBeTrue();
    });

    describe('loadRequisitionsSuccess', () => {
      const requisitions = [{ id: '1' }, { id: '2' }] as Requisition[];
      const successAction = loadRequisitionsSuccess({ requisitions });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getRequisitionsLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getRequisitionsError(store$.state)).toBeUndefined();
      });

      it('should have entities when successfully loading', () => {
        expect(getRequisitions(store$.state)).not.toBeEmpty();
      });
    });

    describe('loadRequisitionsFail', () => {
      beforeEach(() => {
        store$.dispatch(loadRequisitionsFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should set loading to false', () => {
        expect(getRequisitionsLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getRequisitionsError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(getRequisitions(store$.state)).toBeEmpty();
      });
    });
  });

  describe('LoadRequisition', () => {
    const action = loadRequisition({ requisitionId: '12345' });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getRequisitionsLoading(store$.state)).toBeTrue();
    });

    describe('loadRequisitionSuccess', () => {
      const requisition = {
        id: '1',
        lineItems: [{ id: 'test', productSKU: 'sku', quantity: { value: 5 } } as LineItem],
      } as Requisition;
      const successAction = loadRequisitionSuccess({ requisition });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getRequisitionsLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getRequisitionsError(store$.state)).toBeUndefined();
      });

      it('should have an entities when successfully loading', () => {
        expect(getRequisition(store$.state)).not.toBeEmpty();
      });
    });

    describe('loadRequisitionFail', () => {
      beforeEach(() => {
        store$.dispatch(loadRequisitionsFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should set loading to false', () => {
        expect(getRequisitionsLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getRequisitionsError(store$.state)).toBeTruthy();
      });

      /* ToDo: getRequisition is empty */
    });
  });
});
