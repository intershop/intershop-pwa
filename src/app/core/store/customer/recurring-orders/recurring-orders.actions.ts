import { createActionGroup } from '@ngrx/store';

import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const recurringOrdersActions = createActionGroup({
  source: 'Recurring Orders',
  events: {
    'Load Recurring Orders': payload<{ context: string }>(),
    'Load Recurring Order': payload<{ recurringOrderId: string }>(),
    'Update Recurring Order': payload<{ recurringOrderId: string; active: boolean }>(),
    'Delete Recurring Order': payload<{ recurringOrderId: string }>(),
  },
});

export const recurringOrdersApiActions = createActionGroup({
  source: 'Recurring Orders API',
  events: {
    'Load Recurring Orders Success': payload<{ recurringOrders: RecurringOrder[]; context: string }>(),
    'Load Recurring Orders Fail': httpError<{}>(),
    'Load Recurring Order Success': payload<{ recurringOrder: RecurringOrder }>(),
    'Load Recurring Order Fail': httpError<{}>(),
    'Update Recurring Order Success': payload<{ recurringOrder: RecurringOrder }>(),
    'Update Recurring Order Fail': httpError<{}>(),
    'Delete Recurring Order Success': payload<{ recurringOrderId: string }>(),
    'Delete Recurring Order Fail': httpError<{}>(),
  },
});
