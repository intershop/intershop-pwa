import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { PunchoutType } from '../../models/punchout-user/punchout-user.model';
import { PunchoutStoreModule } from '../punchout-store.module';

import { loadPunchoutTypes, loadPunchoutTypesFail, loadPunchoutTypesSuccess } from './punchout-types.actions';
import { getPunchoutTypes, getPunchoutTypesError, getPunchoutTypesLoading } from './punchout-types.selectors';

describe('Punchout Types Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), PunchoutStoreModule.forTesting('punchoutTypes')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getPunchoutTypesLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getPunchoutTypesError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getPunchoutTypes(store$.state)).toBeEmpty();
    });
  });

  describe('loadPunchoutTypes', () => {
    const action = loadPunchoutTypes();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getPunchoutTypesLoading(store$.state)).toBeTrue();
    });

    describe('loadPunchoutTypesSuccess', () => {
      const types = ['oci', 'cxml'] as PunchoutType[];
      const successAction = loadPunchoutTypesSuccess({ types });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getPunchoutTypesLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getPunchoutTypesError(store$.state)).toBeUndefined();
      });

      it('should have entities when successfully loading', () => {
        expect(getPunchoutTypes(store$.state)).not.toBeEmpty();
        expect(getPunchoutTypes(store$.state)).toHaveLength(2);
      });
    });

    describe('loadPunchoutTypesFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = loadPunchoutTypesFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getPunchoutTypesLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getPunchoutTypesError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(getPunchoutTypes(store$.state)).toBeEmpty();
      });
    });
  });
});
