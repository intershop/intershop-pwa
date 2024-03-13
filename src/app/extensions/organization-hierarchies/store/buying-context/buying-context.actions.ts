import { createAction } from '@ngrx/store';

import { OrderListQuery } from 'ish-core/services/order/order.service';
import { payload } from 'ish-core/utils/ngrx-creators';

export const assignBuyingContext = createAction('[Organizational Groups API] Assign BuyingContext');

export const assignBuyingContextSuccess = createAction(
  '[Organizational Groups API] Assign BuyingContext Success',
  payload<{ bctx: string }>()
);

export const loadOrdersForBuyingContext = createAction(
  '[Organizational Groups API] Get Orders for BuyingContext',
  payload<{ query: OrderListQuery }>()
);
