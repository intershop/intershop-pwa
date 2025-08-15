import { TestBed } from '@angular/core/testing';

import { ContentStoreModule } from 'ish-core/store/content/content-store.module';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { designViewActions } from './design-view.actions';
import { getDesignViewSelectedPageletId } from './design-view.selectors';

describe('Design View Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContentStoreModule.forTesting('designView'), CoreStoreModule.forTesting()],
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
});
