import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';

import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';
import { isArrayEqual } from 'ish-core/utils/functions';

import { promotionAdapter } from './promotions.reducer';

const getPromotionsState = createSelector(getShoppingState, (state: ShoppingState) => state.promotions);

const { selectEntities } = promotionAdapter.getSelectors(getPromotionsState);

export const getPromotion = (promoId: string) => createSelector(selectEntities, entities => entities[promoId]);

export const getPromotions = (promotionIds: string[]) =>
  createSelectorFactory<object, Promotion[]>(projector => resultMemoize(projector, isArrayEqual))(
    selectEntities,
    (promotions: Dictionary<Promotion>) => promotionIds.map(id => promotions[id]).filter(x => !!x)
  );
