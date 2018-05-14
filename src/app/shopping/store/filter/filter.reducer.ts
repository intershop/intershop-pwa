import { FilterActions, FilterActionTypes } from './filter.actions';

export interface FilterState {
  loading: boolean;
  availablefilter: any;
  active: boolean;
  products: string[];
}

export const initialState: FilterState = {
  loading: false,
  active: false,
  availablefilter: {},
  products: null,
};

export function filterReducer(state = initialState, action: FilterActions): FilterState {
  switch (action.type) {
    case FilterActionTypes.LoadFilterForCategory: {
      return { ...initialState, loading: true };
    }
    case FilterActionTypes.LoadFilterForCategorySuccess: {
      return {
        ...state,
        availablefilter: action.payload,
        loading: false,
      };
    }
    case FilterActionTypes.LoadFilterForCategoryFail: {
      return {
        ...state,
        availablefilter: {},
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
      return {
        ...state,
        availablefilter: action.payload,
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
