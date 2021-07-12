import { createAction } from '@ngrx/store';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const spContinueCheckout = createAction(
  '[SPC Flow] [Basket] Validate Basket and continue checkout',
  payload<{ targetStep: number }>()
);

export const spContinueCheckoutFail = createAction('[SPC Flow] [Basket] Validate Basket and continue checkout Fail', httpError());
