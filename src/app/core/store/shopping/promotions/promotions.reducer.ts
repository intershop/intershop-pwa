import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Promotion } from 'ish-core/models/promotion/promotion.model';

import { loadPromotionSuccess } from './promotions.actions';

export const promotionAdapter = createEntityAdapter<Promotion>({
  selectId: promotion => promotion.id,
});

export type PromotionsState = EntityState<Promotion>;

const initialState: PromotionsState = promotionAdapter.getInitialState({});

export const promotionsReducer = createReducer(
  initialState,
  on(loadPromotionSuccess, (state, action) => {
    const promotion = action.payload.promotion;
    return promotionAdapter.upsertOne(promotion, state);
  })
);
