import { TestBed } from '@angular/core/testing';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentStoreModule } from 'ish-core/store/content/content-store.module';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadPagelet, loadPageletFail, loadPageletSuccess } from './pagelets.actions';
import { getContentPageletEntities, getPageletError, getPageletLoading } from './pagelets.selectors';

describe('Pagelets Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContentStoreModule.forTesting('pagelets'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getPageletLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getPageletError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getContentPageletEntities(store$.state)).toBeEmpty();
    });
  });

  describe('loadPagelets', () => {
    const action = loadPagelet({ pageletId: '1' });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getPageletLoading(store$.state)).toBeTrue();
    });

    describe('loadPageletsSuccess', () => {
      const pagelet = { id: '1' } as ContentPagelet;
      const successAction = loadPageletSuccess({ pagelet });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getPageletLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getPageletError(store$.state)).toBeUndefined();
      });

      it('should have entities when successfully loading', () => {
        expect(getContentPageletEntities(store$.state)).not.toBeEmpty();
      });
    });

    describe('loadPageletsFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = loadPageletFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getPageletLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getPageletError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "ERROR",
            "name": "HttpErrorResponse",
          }
        `);
      });

      it('should not have entities when reducing error', () => {
        expect(getContentPageletEntities(store$.state)).toBeEmpty();
      });
    });
  });
});
