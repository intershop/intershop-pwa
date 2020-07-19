import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import {
  applyFilter,
  applyFilterFail,
  applyFilterSuccess,
  loadFilterFail,
  loadFilterForCategory,
  loadFilterForSearch,
  loadFilterSuccess,
  loadProductsForFilter,
} from './filter.actions';
import { filterReducer, initialState } from './filter.reducer';

describe('Filter Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as ReturnType<
        | typeof loadFilterForCategory
        | typeof loadFilterSuccess
        | typeof loadFilterFail
        | typeof applyFilter
        | typeof applyFilterSuccess
        | typeof applyFilterFail
        | typeof loadFilterForSearch
        | typeof loadProductsForFilter
      >;
      const state = filterReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadFilterSuccess', () => {
    it('should set filter when reduced', () => {
      const filterNavigation = { filter: [{ name: 'a' }] } as FilterNavigation;
      const action = loadFilterSuccess({ filterNavigation });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toEqual(filterNavigation);
    });
  });

  describe('LoadFilterFailed', () => {
    it('should set filter when reduced', () => {
      const action = loadFilterFail({ error: makeHttpError({}) });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toBeFalsy();
    });
  });

  describe('LoadFilterSuccess', () => {
    it('should set filter when reduced', () => {
      const filterNavigation = { filter: [{ name: 'a' }] } as FilterNavigation;
      const action = loadFilterSuccess({ filterNavigation });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toEqual(filterNavigation);
    });
  });

  describe('LoadFilterFailed', () => {
    it('should set filter when reduced', () => {
      const action = loadFilterFail({ error: makeHttpError({}) });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toBeFalsy();
    });
  });

  describe('ApplyFilterSuccess', () => {
    it('should set filter when reduced', () => {
      const filter = { filter: [{ name: 'a' }] } as FilterNavigation;
      const action = applyFilterSuccess({
        availableFilter: filter,

        searchParameter: { param: ['b'] },
      });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toEqual(filter);
    });
  });
});
