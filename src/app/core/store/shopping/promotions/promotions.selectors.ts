import { createSelector } from '@ngrx/store';

import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { ShoppingState, getShoppingState } from '../shopping-store';

import { promotionAdapter } from './promotions.reducer';

const getPromotionsState = createSelector(
  getShoppingState,
  (state: ShoppingState) => state.promotions
);

export const { selectEntities: getPromotionEntities, selectIds: getPromotionIds } = promotionAdapter.getSelectors(
  getPromotionsState
);

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

// todo
// export const getPromotions = createSelector(
//  getPromotionEntities,
//  (entities, props: { productPromotions: ProductPromotion[] }): Promotion[] =>
//    entities.filter(e =>
//      props.productPromotions.forEach(eachObj => {
//        if (e.id === eachObj.itemid) {
//          return e.id;
//        }
//      })
//    )
// );
