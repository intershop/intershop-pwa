import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { ApplyFilterSuccess, FilterActions, LoadFilterFail, LoadFilterSuccess } from './filter.actions';
import { filterReducer, initialState } from './filter.reducer';

describe('Filter Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as FilterActions;
      const state = filterReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadFilterSuccess', () => {
    it('should set filter when reduced', () => {
      const filterNavigation = { filter: [{ name: 'a' }] } as FilterNavigation;
      const action = new LoadFilterSuccess({ filterNavigation });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toEqual(filterNavigation);
    });
  });

  describe('LoadFilterFailed', () => {
    it('should set filter when reduced', () => {
      const action = new LoadFilterFail({ error: {} as HttpError });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toBeFalsy();
    });
  });

  describe('LoadFilterSuccess', () => {
    it('should set filter when reduced', () => {
      const filterNavigation = { filter: [{ name: 'a' }] } as FilterNavigation;
      const action = new LoadFilterSuccess({ filterNavigation });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toEqual(filterNavigation);
    });
  });

  describe('LoadFilterFailed', () => {
    it('should set filter when reduced', () => {
      const action = new LoadFilterFail({ error: {} as HttpError });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toBeFalsy();
    });
  });

  describe('ApplyFilterSuccess', () => {
    it('should set filter when reduced', () => {
      const filter = { filter: [{ name: 'a' }] } as FilterNavigation;
      const action = new ApplyFilterSuccess({
        availableFilter: filter,
        searchParameter: 'b',
      });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toEqual(filter);
    });
  });
});
