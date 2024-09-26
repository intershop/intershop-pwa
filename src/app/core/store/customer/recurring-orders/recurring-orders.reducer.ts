import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { recurringOrdersActions, recurringOrdersApiActions } from './recurring-orders.actions';

export const recurringOrdersAdapter = createEntityAdapter<RecurringOrder>();

export interface RecurringOrdersState extends EntityState<RecurringOrder> {
  loading: boolean;
  error: HttpError;
  contexts: { [key: string]: string[] };
}

export const initialState: RecurringOrdersState = recurringOrdersAdapter.getInitialState({
  loading: false,
  error: undefined,
  contexts: {},
});

export const recurringOrdersReducer = createReducer(
  initialState,
  setLoadingOn(recurringOrdersActions.loadRecurringOrders, recurringOrdersActions.deleteRecurringOrder),
  setErrorOn(recurringOrdersApiActions.loadRecurringOrdersFail, recurringOrdersApiActions.deleteRecurringOrderFail),
  unsetLoadingAndErrorOn(
    recurringOrdersApiActions.loadRecurringOrdersSuccess,
    recurringOrdersApiActions.deleteRecurringOrderSuccess
  ),
  on(recurringOrdersApiActions.loadRecurringOrdersSuccess, (state, action) => {
    const { recurringOrders } = action.payload;
    return recurringOrdersAdapter.upsertMany(recurringOrders, {
      ...state,
      contexts: {
        ...state.contexts,
        [action.payload.context || 'MY']: recurringOrders.map(recurringOrder => recurringOrder.id),
      },
    });
  }),
  on(
    recurringOrdersApiActions.loadRecurringOrderSuccess,
    recurringOrdersApiActions.updateRecurringOrderSuccess,
    (state, action) => recurringOrdersAdapter.upsertOne(action.payload.recurringOrder, state)
  ),
  on(recurringOrdersApiActions.deleteRecurringOrderSuccess, (state, action) => {
    const { recurringOrderId } = action.payload;
    return recurringOrdersAdapter.removeOne(recurringOrderId, {
      ...state,
      contexts: {
        ...Object.entries(state.contexts).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value.filter(id => id !== recurringOrderId) }),
          {}
        ),
      },
    });
  })
);
