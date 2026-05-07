import { createSelector } from '@ngrx/store';

import { CompareProducts } from './compare/compare.reducer';

export interface CompareState {
  _compare: CompareProducts;
}

export const getCompareState = createSelector(
  (state: { compare?: CompareState }) => state.compare,
  compare => compare
);
