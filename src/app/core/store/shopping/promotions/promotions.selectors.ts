import { createSelector } from '@ngrx/store';

import { ShoppingState, getShoppingState } from '../shopping-store';

import { promotionAdapter } from './promotions.reducer';

const getPromotionsState = createSelector(
  getShoppingState,
  (state: ShoppingState) => state.promotions
);

export const {
  selectEntities: getPromotionEntities,
  selectAll: getPromotions,
  selectIds: getPromotionIds,
} = promotionAdapter.getSelectors(getPromotionsState);

export const getSelectedPromotionId = createSelector(
  getPromotionsState,
  state => state.selected
);

export const getFailed = createSelector(
  getPromotionsState,
  state => state.failed
);

export const getPromotionLoading = createSelector(
  getPromotionsState,
  promotions => promotions.loading
);
