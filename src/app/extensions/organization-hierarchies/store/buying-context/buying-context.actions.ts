import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

export const assignBuyingContext = createAction('[Organizational Groups API] Assign BuyingContext');

export const assignBuyingContextSuccess = createAction(
  '[Organizational Groups API] Assign BuyingContext Success',
  payload<{ bctx: string }>()
);
