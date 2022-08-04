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

const initialState: FilterState = {
  availableFilter: undefined,
};

export const filterReducer = createReducer(
  initialState,
  on(loadFilterForCategory, loadFilterForSearch, (): FilterState => ({ ...initialState })),
  on(
    loadFilterSuccess,
    (state, action): FilterState => ({
      ...state,
      availableFilter: action.payload.filterNavigation,
    })
  ),
  on(
    loadFilterFail,
    (state): FilterState => ({
      ...state,
      availableFilter: undefined,
    })
  ),
  on(applyFilterSuccess, (state, action): FilterState => {
    const { availableFilter } = action.payload;
    return {
      ...state,
      availableFilter,
    };
  })
);
