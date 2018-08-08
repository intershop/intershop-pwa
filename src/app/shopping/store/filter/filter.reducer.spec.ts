import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../../models/category/category.model';
import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';
import * as fromActions from './filter.actions';
import { filterReducer, initialState } from './filter.reducer';

describe('Filter Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as fromActions.FilterActions;
      const state = filterReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadFilterForCategory', () => {
    it('should change state to loading when reduced', () => {
      const action = new fromActions.LoadFilterForCategory({} as Category);
      const state = filterReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });
  });

  describe('LoadFilterForCategorySuccess', () => {
    it('should set filter when reduced', () => {
      const filter = { filter: [{ name: 'a' }] } as FilterNavigation;
      const action = new fromActions.LoadFilterForCategorySuccess(filter);
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toEqual(filter);
      expect(state.loading).toBeFalse();
    });
  });

  describe('LoadFilterForCategoryFailed', () => {
    it('should set filter when reduced', () => {
      const action = new fromActions.LoadFilterForCategoryFail({} as HttpErrorResponse);
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toBeFalsy();
      expect(state.loading).toBeFalse();
    });
  });

  describe('LoadFilterForSearch', () => {
    it('should change state to loading when reduced', () => {
      const action = new fromActions.LoadFilterForSearch('');
      const state = filterReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });
  });

  describe('LoadFilterForSearchSuccess', () => {
    it('should set filter when reduced', () => {
      const filter = { filter: [{ name: 'a' }] } as FilterNavigation;
      const action = new fromActions.LoadFilterForSearchSuccess(filter);
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toEqual(filter);
      expect(state.loading).toBeFalse();
    });
  });

  describe('LoadFilterForSearchFailed', () => {
    it('should set filter when reduced', () => {
      const action = new fromActions.LoadFilterForSearchFail({} as HttpErrorResponse);
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toBeFalsy();
      expect(state.loading).toBeFalse();
    });
  });

  describe('ApplyFilter', () => {
    it('should change state to loading when reduced', () => {
      const action = new fromActions.ApplyFilter({ filterId: 'a', searchParameter: 'b' });
      const state = filterReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });
  });

  describe('ApplyFilterSuccess', () => {
    it('should set filter when reduced', () => {
      const filter = { filter: [{ name: 'a' }] } as FilterNavigation;
      const action = new fromActions.ApplyFilterSuccess({
        availableFilter: filter,
        filterName: 'a',
        searchParameter: 'b',
      });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toEqual(filter);
      expect(state.loading).toBeFalse();
    });
  });

  describe('SetFilteredProducts', () => {
    it('should set product skus when reduced', () => {
      const action = new fromActions.SetFilteredProducts(['123', '234']);
      const state = filterReducer(initialState, action);

      expect(state.products).toEqual(['123', '234']);
    });
  });
});
