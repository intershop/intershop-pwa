import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';

import { FilterActionTypes, FilterActions } from './filter.actions';

export interface FilterState {
  loading: boolean;
  availableFilter: FilterNavigation;
}

export const initialState: FilterState = {
  loading: false,
  availableFilter: undefined,
};

export function filterReducer(state = initialState, action: FilterActions): FilterState {
  switch (action.type) {
    case FilterActionTypes.LoadFilterForCategory:
    case FilterActionTypes.LoadFilterForSearch: {
      return { ...initialState, loading: true };
    }
    case FilterActionTypes.LoadFilterSuccess: {
      return {
        ...state,
        availableFilter: action.payload.filterNavigation,
        loading: false,
      };
    }
    case FilterActionTypes.LoadFilterFail: {
      return {
        ...state,
        availableFilter: undefined,
        loading: false,
      };
    }
    case FilterActionTypes.ApplyFilter: {
      return {
        ...state,
        loading: true,
      };
    }
    case FilterActionTypes.ApplyFilterSuccess: {
      const { availableFilter } = action.payload;
      return {
        ...state,
        availableFilter,
        loading: false,
      };
    }
  }

  return state;
}
