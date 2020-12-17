import { TestBed } from '@angular/core/testing';

import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { Requisition, RequisitionApproval } from '../../models/requisition/requisition.model';
import { RequisitionManagementStoreModule } from '../requisition-management-store.module';

import {
  loadRequisition,
  loadRequisitionSuccess,
  loadRequisitions,
  loadRequisitionsFail,
  loadRequisitionsSuccess,
} from './requisitions.actions';
import {
  getRequisitions,
  getRequisitionsError,
  getRequisitionsLoading,
  selectEntities,
} from './requisitions.selectors';

describe('Requisitions Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), RequisitionManagementStoreModule.forTesting('requisitions')],
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
      expect(selectEntities(store$.state)).toBeEmpty();
    });
  });

  describe('LoadRequisitions', () => {
    const action = loadRequisitions({ view: 'buyer', status: 'PENDING' });

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
        expect(selectEntities(store$.state)).not.toBeEmpty();
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
        expect(selectEntities(store$.state)).toBeEmpty();
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

      it('should have entities when successfully loading', () => {
        expect(selectEntities(store$.state)).not.toBeEmpty();
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
    });
  });

  describe('getBuyerPendingRequisitions', () => {
    const requisitions = [
      {
        id: '1',
        lineItems: [{ id: 'test1', productSKU: 'sku1', quantity: { value: 5 } } as LineItem],
        user: { email: 'testmail@intershop.de' },
        approval: {
          statusCode: 'PENDING',
          status: 'pending',
        } as RequisitionApproval,
      } as Requisition,
      {
        id: '2',
        lineItems: [{ id: 'test2', productSKU: 'sku2', quantity: { value: 1 } } as LineItem],
        user: { email: 'testmail@intershop.de' },
        approval: {
          statusCode: 'PENDING',
          status: 'pending',
        } as RequisitionApproval,
      } as Requisition,
    ];

    beforeEach(() => {
      store$.dispatch(loadRequisitionsSuccess({ requisitions, view: 'buyer', status: 'PENDING' }));
    });

    it('should return correct buyer requisitions for the user', () => {
      expect(getRequisitions('buyer', 'PENDING')(store$.state)).toEqual(requisitions);
    });
  });
});
