import { createSelector } from '@ngrx/store';

import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { recommendationsAdapter } from './recommendations.reducer';

const getRecommendationsState = createSelector(
  getShoppingState,
  (state: ShoppingState) => state.productRecommendations
);

const { selectEntities } = recommendationsAdapter.getSelectors(getRecommendationsState);

export const getRecommendationsForStrategy = (strategy: string) =>
  createSelector(selectEntities, entities => entities[strategy]);
