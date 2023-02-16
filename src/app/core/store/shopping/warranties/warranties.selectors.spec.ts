import { TestBed } from '@angular/core/testing';

import { Warranty } from 'ish-core/models/warranty/warranty.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadWarranty, loadWarrantyFail, loadWarrantySuccess } from './warranties.actions';
import { getWarranty, getWarrantyError, getWarrantyLoading } from './warranties.selectors';

describe('Warranties Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), ShoppingStoreModule.forTesting('warranties')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getWarrantyLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getWarrantyError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getWarranty('w123')(store$.state)).toBeUndefined();
    });
  });

  describe('loadWarranties', () => {
    describe('loadWarranty', () => {
      beforeEach(() => {
        store$.dispatch(loadWarranty({ warrantyId: 'war1' }));
      });
      it('should set loading to true', () => {
        expect(getWarrantyLoading(store$.state)).toBeTrue();
      });
    });

    describe('loadWarrantySuccess', () => {
      const successAction = loadWarrantySuccess({ warranty: { id: 'war1' } as Warranty });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getWarrantyLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getWarrantyError(store$.state)).toBeUndefined();
      });

      it('should have entities when successfully loading', () => {
        expect(getWarranty('war1')).toBeTruthy();
      });
    });

    describe('loadWarrantyFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = loadWarrantyFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getWarrantyLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getWarrantyError(store$.state)).toBeTruthy();
      });
    });
  });
});
