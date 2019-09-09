import { createSelector } from '@ngrx/store';
import { memoize } from 'lodash-es';

import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { promotionAdapter } from './promotions.reducer';

const getPromotionsState = createSelector(
  getShoppingState,
  (state: ShoppingState) => state.promotions
);

export const { selectEntities: getPromotionEntities, selectAll: getAllPromotions } = promotionAdapter.getSelectors(
  getPromotionsState
);

export const getPromotion = createSelector(
  getPromotionEntities,
  (entities, props: { promoId: string }) => entities[props.promoId]
);

export const getPromotions = createSelector(
  getAllPromotions,
  memoize(
    (promotions, props): Promotion[] =>
      props.promotionIds.map(id => promotions.find(p => p.id === id)).filter(x => !!x),
    (promotions: Promotion[], props: { promotionIds: string[] }) =>
      `${props.promotionIds.join()}#${promotions.map(p => p.id).join()}`
  )
);
