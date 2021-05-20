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
        entrypoint: { id: 'the_viewcontext' } as ContentPageletEntryPoint,
        pagelets: [],
        viewContextId: 'the_viewcontext',
        callParameters: { Product: 'TEST', Category: 'Hello@World', Extra: 'foo', Alternative: 'bar' },
      });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should have entities when successfully loading', () => {
        expect(getViewContextEntities(store$.state)).not.toBeEmpty();
      });
    });

    describe('loadViewContextEntrypointFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = loadViewContextEntrypointFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should not have entities when reducing error', () => {
        expect(getViewContextEntities(store$.state)).toBeEmpty();
      });
    });

    describe('entity ids', () => {
      it.each([
        [
          'the_viewcontext@@Alternative-bar@@Category-Hello@World@@Extra-foo@@Product-TEST',
          { Product: 'TEST', Category: 'Hello@World', Extra: 'foo', Alternative: 'bar' },
        ],
        ['the_viewcontext', {}],
        ['the_viewcontext', undefined],
      ])(
        `should get '%s' as id when view context entrypoint with '%s' callParameters is loaded`,
        (result, callParameters) => {
          store$.dispatch(
            loadViewContextEntrypointSuccess({
              entrypoint: { id: 'the_viewcontext' } as ContentPageletEntryPoint,
              pagelets: [],
              viewContextId: 'the_viewcontext',
              callParameters,
            })
          );
          expect(Object.keys(getViewContextEntities(store$.state))).toEqual([result]);
        }
      );
    });
  });
});
