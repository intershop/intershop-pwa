import { TestBed } from '@angular/core/testing';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { Requisition } from '../../models/requisition/requisition.model';
import { RequisitionManagementStoreModule } from '../requisition-management-store.module';

import { loadRequisitions, loadRequisitionsFail, loadRequisitionsSuccess } from './requisitions.actions';
import {
  getNumberOfRequisitions,
  getRequisitions,
  getRequisitionsEntities,
  getRequisitionsError,
  getRequisitionsLoading,
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
      expect(getRequisitionsEntities(store$.state)).toBeEmpty();
      expect(getRequisitions(store$.state)).toBeEmpty();
      expect(getNumberOfRequisitions(store$.state)).toBe(0);
    });
  });

  describe('LoadRequisitions', () => {
    const action = loadRequisitions();

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
        expect(getRequisitionsEntities(store$.state)).not.toBeEmpty();
        expect(getRequisitions(store$.state)).not.toBeEmpty();
        expect(getNumberOfRequisitions(store$.state)).toBe(2);
      });
    });

    describe('loadRequisitionsFail', () => {
      const error = { error: 'ERROR' } as HttpError;
      const failAction = loadRequisitionsFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getRequisitionsLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getRequisitionsError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(getRequisitionsEntities(store$.state)).toBeEmpty();
        expect(getRequisitions(store$.state)).toBeEmpty();
        expect(getNumberOfRequisitions(store$.state)).toBe(0);
      });
    });
  });
});
