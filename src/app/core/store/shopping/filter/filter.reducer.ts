import { createReducer, on } from '@ngrx/store';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';

import {
  applyFilterSuccess,
  loadFilterFail,
  loadFilterForCategory,
  loadFilterForSearch,
  loadFilterSuccess,
} from './filter.actions';

export interface FilterState {
  availableFilter: FilterNavigation;
}

export const initialState: FilterState = {
  availableFilter: undefined,
};

export const filterReducer = createReducer(
  initialState,
  on(loadFilterForCategory, loadFilterForSearch, () => ({ ...initialState })),
  on(loadFilterSuccess, (state, action) => ({
    ...state,
    availableFilter: action.payload.filterNavigation,
  })),
  on(loadFilterFail, state => ({
    ...state,
    availableFilter: undefined,
  })),
  on(applyFilterSuccess, (state, action) => {
    const { availableFilter } = action.payload;
    return {
      ...state,
      availableFilter,
    };
  })
);
