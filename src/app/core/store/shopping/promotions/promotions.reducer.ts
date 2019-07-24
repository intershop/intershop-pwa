import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { Promotion } from 'ish-core/models/promotion/promotion.model';

import { PromotionsAction, PromotionsActionTypes } from './promotions.actions';

export const promotionAdapter = createEntityAdapter<Promotion>({
  selectId: promotion => promotion.id,
});

export interface PromotionsState extends EntityState<Promotion> {}

export const initialState: PromotionsState = promotionAdapter.getInitialState({});

export function promotionsReducer(state = initialState, action: PromotionsAction): PromotionsState {
  switch (action.type) {
    case PromotionsActionTypes.LoadPromotionSuccess: {
      const promotion = action.payload.promotion;
      return promotionAdapter.upsertOne(promotion, state);
    }
  }

  return state;
}
