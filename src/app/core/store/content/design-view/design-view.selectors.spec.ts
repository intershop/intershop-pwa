import { TestBed } from '@angular/core/testing';

import { ContentStoreProviders } from 'ish-core/store/content/content-store.providers';
import { CoreStoreProviders } from 'ish-core/store/core/core-store.providers';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { designViewActions } from './design-view.actions';
import {
  getDesignViewPreviewedPageletId,
  getDesignViewScrollToPageletId,
  getDesignViewSelectedPageletId,
} from './design-view.selectors';

describe('Design View Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContentStoreProviders.forTesting('designView'), ...CoreStoreProviders.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not select a selectedPageletId in initial state', () => {
      expect(getDesignViewSelectedPageletId(store$.state)).toBeUndefined();
    });
  });

  describe('SelectedPageletId', () => {
    it('should select a selectedPageletId after it was set', () => {
      store$.dispatch(designViewActions.selectPagelet({ pageletId: 'dummy' }));

      expect(getDesignViewSelectedPageletId(store$.state)).toBe('dummy');
    });
  });

  describe('PreviewedPageletId', () => {
    it('should select a previewedPageletId after it was set', () => {
      store$.dispatch(designViewActions.previewPagelet({ pageletId: 'dummy' }));

      expect(getDesignViewPreviewedPageletId(store$.state)).toBe('dummy');
    });
  });

  describe('ScrollToPageletId', () => {
    it('should select a scrollToPageletId after it was set', () => {
      store$.dispatch(designViewActions.scrollToPagelet({ pageletId: 'dummy' }));

      expect(getDesignViewScrollToPageletId(store$.state)).toBe('dummy');
    });
  });
});
