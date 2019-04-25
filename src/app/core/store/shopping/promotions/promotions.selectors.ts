import { createSelector } from '@ngrx/store';

import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { ShoppingState, getShoppingState } from '../shopping-store';

import { promotionAdapter } from './promotions.reducer';

const getPromotionsState = createSelector(
  getShoppingState,
  (state: ShoppingState) => state.promotions
);

export const { selectEntities: getPromotionEntities, selectAll: getAllPromotions } = promotionAdapter.getSelectors(
  getPromotionsState
);

export const getPromotionLoading = createSelector(
  getPromotionsState,
  promotions => promotions.loading
);

export const getPromotion = createSelector(
  getPromotionEntities,
  (entities, props: { promoId: string }) => entities[props.promoId]
);

export const getPromotions = createSelector(
  getAllPromotions,
  (promotions, props: { promotionIds: string[] }): Promotion[] =>
    promotions.filter(e => props.promotionIds.includes(e.id))
);
