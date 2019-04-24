import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { Promotion } from '../../../models/promotion/promotion.model';

import { PromotionsAction, PromotionsActionTypes } from './promotions.actions';

export const promotionAdapter = createEntityAdapter<Promotion>({
  selectId: promotion => promotion.id,
});

export interface PromotionsState extends EntityState<Promotion> {
  loading: boolean;
}

export const initialState: PromotionsState = promotionAdapter.getInitialState({
  loading: false,
});

export function promotionsReducer(state = initialState, action: PromotionsAction): PromotionsState {
  switch (action.type) {
    case PromotionsActionTypes.LoadPromotion: {
      return {
        ...state,
        loading: true,
      };
    }

    case PromotionsActionTypes.LoadPromotionFail: {
      return {
        ...state,
        loading: false,
      };
    }

    case PromotionsActionTypes.LoadPromotionSuccess: {
      const promotion = action.payload.promotion;
      return promotionAdapter.upsertOne(promotion, {
        ...state,
        loading: false,
      });
    }
  }

  return state;
}
