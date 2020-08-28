import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { QuotingEntity } from '../../models/quoting/quoting.model';
import { Quoting2StoreModule } from '../quoting2-store.module';

import { loadQuoting, loadQuotingFail, loadQuotingSuccess } from './quoting.actions';
import { getQuotingEntities, getQuotingError, getQuotingLoading } from './quoting.selectors';

describe('Quoting Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), Quoting2StoreModule.forTesting('quoting')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getQuotingLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getQuotingError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getQuotingEntities(store$.state)).toBeEmpty();
    });
  });

  describe('LoadQuoting', () => {
    const action = loadQuoting();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getQuotingLoading(store$.state)).toBeTrue();
    });

    describe('loadQuotingSuccess', () => {
      const quoting = [{ id: '1' }, { id: '2' }] as QuotingEntity[];
      const successAction = loadQuotingSuccess({ quoting });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getQuotingLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getQuotingError(store$.state)).toBeUndefined();
      });

      it('should have entities when successfully loading', () => {
        expect(getQuotingEntities(store$.state)).not.toBeEmpty();
      });
    });

    describe('loadQuotingFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = loadQuotingFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getQuotingLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getQuotingError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(getQuotingEntities(store$.state)).toBeEmpty();
      });
    });
  });
});
