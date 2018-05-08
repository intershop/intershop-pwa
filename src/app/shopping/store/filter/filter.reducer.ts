import { FilterActions, FilterActionTypes, FilterProducts, LoadFilterForCategorySuccess } from './filter.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ProductMapper } from '../../../models/product/product.mapper';
import { Product } from '../../../models/product/product.model';
import { State } from '@ngrx/store';

export interface FilterState {
  loading: boolean;
  availablefilter: any;
  active: boolean;
}

export const initialState: FilterState = {
  loading: false,
  active: false,
  availablefilter: {},
};

export function filterReducer(state = initialState, action: FilterActions): FilterState {
  switch (action.type) {
    case FilterActionTypes.FilterProducts: {
      console.log('WW');
      return {
        ...state,
        loading: true,
      };
    }
    case FilterActionTypes.LoadFilterForCategorySuccess: {
      console.log('w2');
      return {
        ...state,
        availablefilter: action.payload,
        loading: false,
      };
    }
  }

  return state;
}
