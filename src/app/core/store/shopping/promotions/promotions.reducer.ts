import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { Promotion } from '../../../models/promotion/promotion.model';

import { PromotionsAction, PromotionsActionTypes } from './promotions.actions';

export const promotionAdapter = createEntityAdapter<Promotion>({
  selectId: promotion => promotion.id,
});

export interface PromotionsState extends EntityState<Promotion> {
  loading: boolean;
  failed: string[];
}

export const initialState: PromotionsState = promotionAdapter.getInitialState({
  loading: false,
  failed: [],
});

function addFailed(failed: string[], promoId: string): string[] {
  return [...failed, promoId].filter((val, idx, arr) => arr.indexOf(val) === idx);
}

function removeFailed(failed: string[], promoId: string): string[] {
  return failed.filter(val => val !== promoId);
}

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
        failed: addFailed(state.failed, action.payload.promoId),
      };
    }

    case PromotionsActionTypes.LoadPromotionSuccess: {
      const promotion = action.payload.promotion;
      return promotionAdapter.upsertOne(promotion, {
        ...state,
        loading: false,
        failed: removeFailed(state.failed, promotion.id),
      });
    }
  }

  return state;
}
