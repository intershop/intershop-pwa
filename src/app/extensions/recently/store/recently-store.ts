import { createFeatureSelector } from '@ngrx/store';

import { RecentlyViewedProducts } from './recently/recently.reducer';

export interface RecentlyState {
  _recently: RecentlyViewedProducts;
}

export const getRecentlyState = createFeatureSelector<RecentlyState>('recently');
