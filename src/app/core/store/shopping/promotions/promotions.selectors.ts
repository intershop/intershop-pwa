import { createSelector } from '@ngrx/store';

import { ProductPromotion, Promotion } from 'ish-core/models/promotion/promotion.model';
import { ShoppingState, getShoppingState } from '../shopping-store';

import { promotionAdapter } from './promotions.reducer';

const getPromotionsState = createSelector(
  getShoppingState,
  (state: ShoppingState) => state.promotions
);

export const {
  selectEntities: getPromotionEntities,
  selectAll: getAllPromotions,
  selectIds: getPromotionIds,
} = promotionAdapter.getSelectors(getPromotionsState);

export const getFailed = createSelector(
  getPromotionsState,
  state => state.failed
);

export const getPromotionLoading = createSelector(
  getPromotionsState,
  promotions => promotions.loading
);

export const getPromotion = createSelector(
  getPromotionEntities,
  getFailed,
  (entities, failed, props: { promoId: string }) =>
    failed.includes(props.promoId)
      ? // tslint:disable-next-line:ish-no-object-literal-type-assertion
        ({ id: props.promoId } as Promotion)
      : entities[props.promoId]
);

export const getPromotions = createSelector(
  getAllPromotions,
  (promotions, props: { productPromotions: ProductPromotion[] }): Promotion[] =>
    promotions.filter(e => props.productPromotions.some(s => s.itemId === e.id))
  // promotions.filter(e => props.productPromotions.includes(e.id))
);
