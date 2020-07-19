import { TestBed } from '@angular/core/testing';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadFilterFail, loadFilterSuccess } from './filter.actions';
import { getAvailableFilter } from './filter.selectors';

describe('Filter Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), ShoppingStoreModule.forTesting('filter')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not select any filters when used', () => {
      expect(getAvailableFilter(store$.state)).toBeUndefined();
    });
  });

  describe('with LoadFilterSuccess state', () => {
    beforeEach(() => {
      store$.dispatch(loadFilterSuccess({ filterNavigation: { filter: [{ name: 'a' }] } as FilterNavigation }));
    });
    it('should add the filter to the state', () => {
      expect(getAvailableFilter(store$.state)).toEqual({ filter: [{ name: 'a' }] } as FilterNavigation);
    });
  });

  describe('with LoadFilterFail state', () => {
    beforeEach(() => {
      store$.dispatch(loadFilterFail({ error: makeHttpError({}) }));
    });
    it('should set undefined to the filter in the state', () => {
      expect(getAvailableFilter(store$.state)).toBeUndefined();
    });
  });
});
