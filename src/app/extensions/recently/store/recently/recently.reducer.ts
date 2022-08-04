import { createReducer, on } from '@ngrx/store';

import { RecentlyViewedProduct } from '../../models/recently-viewed-product/recently-viewed-product.model';

import { addToRecently, clearRecently } from './recently.actions';

export type RecentlyViewedProducts = RecentlyViewedProduct[];

const initialState: RecentlyViewedProducts = [];

export const recentlyReducer = createReducer(
  [],
  on(addToRecently, (state, action): RecentlyViewedProducts => [action.payload, ...state]),
  on(clearRecently, (): RecentlyViewedProducts => initialState)
);
