import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';

import { FilterActionTypes, FilterActions } from './filter.actions';

export interface FilterState {
  availableFilter: FilterNavigation;
}

export const initialState: FilterState = {
  availableFilter: undefined,
};

export function filterReducer(state = initialState, action: FilterActions): FilterState {
  switch (action.type) {
    case FilterActionTypes.LoadFilterForCategory:
    case FilterActionTypes.LoadFilterForSearch: {
      return { ...initialState };
    }
    case FilterActionTypes.LoadFilterSuccess: {
      return {
        ...state,
        availableFilter: action.payload.filterNavigation,
      };
    }
    case FilterActionTypes.LoadFilterFail: {
      return {
        ...state,
        availableFilter: undefined,
      };
    }
    case FilterActionTypes.ApplyFilterSuccess: {
      const { availableFilter } = action.payload;
      return {
        ...state,
        availableFilter,
      };
    }
  }

  return state;
}
