import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { QuoteStub, QuotingEntity } from '../../models/quoting/quoting.model';
import { QuotingStoreModule } from '../quoting-store.module';

import {
  deleteQuotingEntity,
  deleteQuotingEntitySuccess,
  loadQuoting,
  loadQuotingFail,
  loadQuotingSuccess,
} from './quoting.actions';
import { getQuotingEntities, getQuotingEntity, getQuotingError, getQuotingLoading } from './quoting.selectors';

describe('Quoting Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), QuotingStoreModule.forTesting('quoting')],
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
      expect(getQuotingEntity('1')(store$.state)).toBeUndefined();
    });
  });

  describe('loadQuoting', () => {
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
        expect(getQuotingEntity('1')(store$.state)).toBeTruthy();
      });

      describe('deleteQuotingEntity', () => {
        beforeEach(() => {
          store$.dispatch(deleteQuotingEntity({ entity: { id: '1' } as QuoteStub }));
        });

        it('should set loading to true', () => {
          expect(getQuotingLoading(store$.state)).toBeTrue();
        });

        describe('deleteQuotingEntitySuccess', () => {
          beforeEach(() => {
            store$.dispatch(deleteQuotingEntitySuccess({ id: '1' }));
          });

          it('should set loading to false', () => {
            expect(getQuotingLoading(store$.state)).toBeFalse();
          });

          it('should remove entity when reducing success message', () => {
            expect(getQuotingEntities(store$.state)).not.toBeEmpty();
            expect(getQuotingEntity('1')(store$.state)).toBeUndefined();
          });
        });
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
        expect(getQuotingEntity('1')(store$.state)).toBeUndefined();
      });
    });
  });
});
