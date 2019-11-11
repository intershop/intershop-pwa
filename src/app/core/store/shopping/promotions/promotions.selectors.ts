import {
  DefaultProjectorFn,
  MemoizedSelectorWithProps,
  createSelector,
  createSelectorFactory,
  defaultMemoize,
} from '@ngrx/store';
import { isEqual } from 'lodash-es';

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

export const getPromotion = () =>
  createSelector(
    getPromotionEntities,
    (entities, props: { promoId: string }): Promotion => entities[props.promoId]
  );

export const getPromotions = (): MemoizedSelectorWithProps<
  object,
  { promotionIds: string[] },
  Promotion[],
  DefaultProjectorFn<Promotion[]>
> =>
  createSelectorFactory(projector => defaultMemoize(projector, isEqual, isEqual))(
    getAllPromotions,
    (promotions: Promotion[], props: { promotionIds: string[] }): Promotion[] =>
      props.promotionIds.map(id => promotions.find(p => p.id === id)).filter(x => !!x)
  );
