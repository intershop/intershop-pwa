import { createFeatureSelector } from '@ngrx/store';

import { CompareProducts } from './compare/compare.reducer';

export interface CompareState {
  _compare: CompareProducts;
}

export const getCompareState = createFeatureSelector<CompareState>('compare');
