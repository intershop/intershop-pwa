import { createReducer, on } from '@ngrx/store';

import { addToCompare, removeFromCompare } from './compare.actions';

export type CompareProducts = string[];

export const compareReducer = createReducer(
  [],
  on(addToCompare, (state, { payload: { sku } }) => (state.includes(sku) ? state : [...state, sku])),
  on(removeFromCompare, (state, { payload: { sku } }) => state.filter(current => current !== sku))
);
