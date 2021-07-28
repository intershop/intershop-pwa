import { TestBed } from '@angular/core/testing';

import { User } from 'ish-core/models/user/user.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadCostCenter, loadCostCenterFail, loadCostCenterSuccess } from './cost-center.actions';
import {
  getCostCenter,
  getCostCenterEntities,
  getCostCenterError,
  getCostCenterLoading,
  getNumberOfCostCenter,
} from './cost-center.selectors';

describe('Cost Center Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), CustomerStoreModule.forTesting('costCenter')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getCostCenterLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getCostCenterError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getCostCenterEntities(store$.state)).toBeEmpty();
      expect(getCostCenter(store$.state)).toBeEmpty();
      expect(getNumberOfCostCenter(store$.state)).toBe(0);
    });
  });

  describe('loadCostCenter', () => {
    const action = loadCostCenter();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getCostCenterLoading(store$.state)).toBeTrue();
    });

    describe('loadCostCenterSuccess', () => {
      const costCenter = [{ id: '1' }, { id: '2' }] as User[];
      const successAction = loadCostCenterSuccess({ costCenter });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getCostCenterLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getCostCenterError(store$.state)).toBeUndefined();
      });

      it('should have entities when successfully loading', () => {
        expect(getCostCenterEntities(store$.state)).not.toBeEmpty();
        expect(getCostCenter(store$.state)).not.toBeEmpty();
        expect(getNumberOfCostCenter(store$.state)).toBe(2);
      });
    });

    describe('loadCostCenterFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = loadCostCenterFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getCostCenterLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getCostCenterError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(getCostCenterEntities(store$.state)).toBeEmpty();
        expect(getCostCenter(store$.state)).toBeEmpty();
        expect(getNumberOfCostCenter(store$.state)).toBe(0);
      });
    });
  });
});
