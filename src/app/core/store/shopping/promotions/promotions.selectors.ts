import { createSelector } from '@ngrx/store';

import { Promotion } from 'ish-core/models/promotion/promotion.model';
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

export const getSelectedPromotion = createSelector(
  getPromotionEntities,
  getSelectedPromotionId,
  (entities, id) => entities[id]
);

export const getPromotionLoading = createSelector(
  getPromotionsState,
  promotions => promotions.loading
);

export const getPromotion = createSelector(
  getPromotionEntities,
  getFailed,
  (promotions, failed, props: { id: string }) =>
    failed.includes(props.id)
      ? // tslint:disable-next-line:ish-no-object-literal-type-assertion
        ({ id: props.id } as Promotion)
      : promotions[props.id]
);
