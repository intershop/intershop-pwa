import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { Category } from '../../../models/category/category.model';
import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';
import { shoppingReducers } from '../shopping.system';

import {
  ApplyFilter,
  ApplyFilterFail,
  ApplyFilterSuccess,
  LoadFilterForCategory,
  LoadFilterForCategoryFail,
  LoadFilterForCategorySuccess,
} from './filter.actions';
import { getAvailableFilter, getFilterLoading } from './filter.selectors';

describe('Filter Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        shopping: combineReducers(shoppingReducers),
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should not select any filters when used', () => {
      expect(getAvailableFilter(store$.state)).toBeUndefined();
    });
  });

  describe('with LoadFilterForCategory state', () => {
    beforeEach(() => {
      store$.dispatch(new LoadFilterForCategory({} as Category));
    });

    it('should set the state to loading', () => {
      expect(getFilterLoading(store$.state)).toBeTrue();
    });
  });

  describe('with LoadFilterForCategorySuccess state', () => {
    beforeEach(() => {
      store$.dispatch(new LoadFilterForCategorySuccess({ filter: [{ name: 'a' }] } as FilterNavigation));
    });

    it('should set the state to loaded', () => {
      expect(getFilterLoading(store$.state)).toBeFalse();
    });

    it('should add the filter to the state', () => {
      expect(getAvailableFilter(store$.state)).toEqual({ filter: [{ name: 'a' }] } as FilterNavigation);
    });
  });

  describe('with LoadFilterForCategoryFail state', () => {
    beforeEach(() => {
      store$.dispatch(new LoadFilterForCategoryFail({} as HttpError));
    });

    it('should set the state to loaded', () => {
      expect(getFilterLoading(store$.state)).toBeFalse();
    });

    it('should set undefined to the filter in the state', () => {
      expect(getAvailableFilter(store$.state)).toBeUndefined();
    });
  });

  describe('with ApplyFilter state', () => {
    beforeEach(() => {
      store$.dispatch(new ApplyFilter({ filterId: 'a', searchParameter: 'b' }));
    });

    it('should set the state to loaded', () => {
      expect(getFilterLoading(store$.state)).toBeTrue();
    });
  });

  describe('with ApplyFilterSuccess state', () => {
    beforeEach(() => {
      store$.dispatch(
        new ApplyFilterSuccess({
          availableFilter: {} as FilterNavigation,
          filterName: 'a',
          searchParameter: 'b',
        })
      );
    });

    it('should set the state to loaded', () => {
      expect(getFilterLoading(store$.state)).toBeFalse();
    });
  });

  describe('with ApplyFilterFail state', () => {
    beforeEach(() => {
      store$.dispatch(new ApplyFilterFail({} as HttpError));
    });

    it('should set the state to loaded', () => {
      expect(getFilterLoading(store$.state)).toBeFalse();
    });
  });
});
