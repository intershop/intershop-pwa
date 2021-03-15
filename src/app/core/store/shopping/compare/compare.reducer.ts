import { createReducer, on } from '@ngrx/store';

import { addToCompare, removeFromCompare } from './compare.actions';

export interface CompareState {
  products: string[];
}

export const initialState: CompareState = {
  products: [],
};

export const compareReducer = createReducer(
  initialState,
  on(addToCompare, (state, action) => {
    const { sku } = action.payload;
    const products = state.products.includes(sku) ? [...state.products] : [...state.products, sku];

    return { ...state, products };
  }),
  on(removeFromCompare, (state, action) => {
    const { sku } = action.payload;
    const products = state.products.filter(current => current !== sku);

    return { ...state, products };
  })
);
