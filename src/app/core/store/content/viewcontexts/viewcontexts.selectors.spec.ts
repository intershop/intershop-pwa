import { TestBed } from '@angular/core/testing';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentStoreModule } from 'ish-core/store/content/content-store.module';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import {
  loadViewContextEntrypoint,
  loadViewContextEntrypointFail,
  loadViewContextEntrypointSuccess,
} from './viewcontexts.actions';
import { getViewContextEntities } from './viewcontexts.selectors';

describe('Viewcontexts Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContentStoreModule.forTesting('viewcontexts'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not have entities when in initial state', () => {
      expect(getViewContextEntities(store$.state)).toBeEmpty();
    });
  });

  describe('loadViewContextEntrypoint', () => {
    const action = loadViewContextEntrypoint({
      viewContextId: 'test',
      callParameters: {},
    });

    beforeEach(() => {
      store$.dispatch(action);
    });

    describe('loadViewContextEntrypointSuccess', () => {
      const successAction = loadViewContextEntrypointSuccess({
        entrypoint: { id: 'test' } as ContentPageletEntryPoint,
        pagelets: [],
        viewContextId: 'test',
        callParameters: {},
      });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should have entities when successfully loading', () => {
        expect(getViewContextEntities(store$.state)).not.toBeEmpty();
      });
    });

    describe('loadViewcontFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = loadViewContextEntrypointFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should not have entities when reducing error', () => {
        expect(getViewContextEntities(store$.state)).toBeEmpty();
      });
    });
  });
});
