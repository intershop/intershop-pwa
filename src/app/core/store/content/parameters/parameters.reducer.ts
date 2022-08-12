import { createReducer, on } from '@ngrx/store';

import { loadParametersProductListFilterSuccess } from './parameters.actions';

export interface ParametersState {
  productLists: { [id: string]: string[] };
}

const initialState: ParametersState = {
  productLists: {},
};

export const parametersReducer = createReducer(
  initialState,
  on(
    loadParametersProductListFilterSuccess,
    (state, action): ParametersState => ({
      ...state,
      productLists: { ...state.productLists, [action.payload.id]: action.payload.productList },
    })
  )
);
