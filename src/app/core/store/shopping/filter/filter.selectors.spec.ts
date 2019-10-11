import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import {
  ApplyFilter,
  ApplyFilterFail,
  ApplyFilterSuccess,
  LoadFilterFail,
  LoadFilterForCategory,
  LoadFilterSuccess,
} from './filter.actions';
import { getAvailableFilter, getFilterLoading } from './filter.selectors';

describe('Filter Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        reducers: {
          shopping: combineReducers(shoppingReducers),
        },
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
      store$.dispatch(new LoadFilterForCategory({ uniqueId: 'dummy' }));
    });

    it('should set the state to loading', () => {
      expect(getFilterLoading(store$.state)).toBeTrue();
    });
  });

  describe('with LoadFilterSuccess state', () => {
    beforeEach(() => {
      store$.dispatch(new LoadFilterSuccess({ filterNavigation: { filter: [{ name: 'a' }] } as FilterNavigation }));
    });

    it('should set the state to loaded', () => {
      expect(getFilterLoading(store$.state)).toBeFalse();
    });

    it('should add the filter to the state', () => {
      expect(getAvailableFilter(store$.state)).toEqual({ filter: [{ name: 'a' }] } as FilterNavigation);
    });
  });

  describe('with LoadFilterFail state', () => {
    beforeEach(() => {
      store$.dispatch(new LoadFilterFail({ error: {} as HttpError }));
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
      store$.dispatch(new ApplyFilter({ searchParameter: 'b' }));
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
      store$.dispatch(new ApplyFilterFail({ error: {} as HttpError }));
    });

    it('should set the state to loaded', () => {
      expect(getFilterLoading(store$.state)).toBeFalse();
    });
  });
});
