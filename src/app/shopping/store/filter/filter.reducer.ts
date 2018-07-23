import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';
import { FilterActions, FilterActionTypes } from './filter.actions';

export interface FilterState {
  loading: boolean;
  availableFilter: FilterNavigation;
  products: string[];
}

export const initialState: FilterState = {
  loading: false,
  availableFilter: undefined,
  products: undefined,
};

export function filterReducer(state = initialState, action: FilterActions): FilterState {
  switch (action.type) {
    case FilterActionTypes.LoadFilterForCategory:
    case FilterActionTypes.LoadFilterForSearch: {
      return { ...initialState, loading: true };
    }
    case FilterActionTypes.LoadFilterForCategorySuccess:
    case FilterActionTypes.LoadFilterForSearchSuccess: {
      return {
        ...state,
        availableFilter: action.payload,
        loading: false,
      };
    }
    case FilterActionTypes.LoadFilterForCategoryFail:
    case FilterActionTypes.LoadFilterForSearchFail: {
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

    case FilterActionTypes.SetFilteredProducts: {
      return {
        ...state,
        products: action.payload,
      };
    }
  }

  return state;
}
