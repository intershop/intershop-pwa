import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { contentReducers } from 'ish-core/store/content/content-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import * as actions from './pages.actions';
import { getContentPage, getContentPageLoading } from './pages.selectors';

describe('Pages Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        reducers: {
          ...coreReducers,
          content: combineReducers(contentReducers),
        },
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getContentPageLoading(store$.state)).toBeFalse();
    });
  });

  describe('LoadPages', () => {
    it('should select no includes when nothing was reduced', () => {
      expect(getContentPage(store$.state, 'dummy')).toBeUndefined();
    });

    it('should select include when it was successfully loaded', () => {
      store$.dispatch(
        new actions.LoadContentPageSuccess({ page: { id: 'dummy' } as ContentPageletEntryPoint, pagelets: [] })
      );

      expect(getContentPage(store$.state, 'dummy')).toHaveProperty('id', 'dummy');
    });

    describe('loading multiple includes', () => {
      const IDS = ['dummy1', 'dummy2', 'dummy3'];

      beforeEach(() => {
        IDS.forEach(title =>
          store$.dispatch(
            new actions.LoadContentPageSuccess({ page: { id: title } as ContentPageletEntryPoint, pagelets: [] })
          )
        );
      });

      it('should contain all includes when loading multiple items', () => {
        IDS.forEach(includeId => expect(getContentPage(store$.state, includeId)).toHaveProperty('id', includeId));
      });

      it('should not contain includes for unrelated ids', () => {
        expect(getContentPage(store$.state, 'unrelated')).toBeUndefined();
      });
    });
  });
});
