import { createAction } from '@ngrx/store';

import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadPromotion = createAction('[Promotions Internal] Load Promotion', payload<{ promoId: string }>());

export const loadPromotionFail = createAction('[Promotions API] Load Promotion Fail', httpError<{ promoId: string }>());

export const loadPromotionSuccess = createAction(
  '[Promotions API] Load Promotion Success',
  payload<{ promotion: Promotion }>()
);
