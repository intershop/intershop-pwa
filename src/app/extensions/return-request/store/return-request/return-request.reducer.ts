import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { ReturnRequest, ReturnablePosition } from '../../models/return-request/return-request.model';

import {
  createReturnRequest,
  createReturnRequestFail,
  createReturnRequestSuccess,
  loadOrderByDocumentNoAndEmail,
  loadOrderByDocumentNoAndEmailFail,
  loadOrderByDocumentNoAndEmailSuccess,
  loadOrderReturnReasons,
  loadOrderReturnReasonsFail,
  loadOrderReturnReasonsSuccess,
  loadOrderReturnRequests,
  loadOrderReturnRequestsFail,
  loadOrderReturnRequestsSuccess,
  loadOrderReturnableItems,
  loadOrderReturnableItemsFail,
  loadOrderReturnableItemsSuccess,
} from './return-request.actions';

export const returnRequestAdapter = createEntityAdapter<ReturnRequest>({
  selectId: request => `${request.orderId}_${request.id}`,
});

export interface ReturnRequestState extends EntityState<ReturnRequest> {
  loading: boolean;
  error: HttpError;
  reasons: SelectOption[];
  orderReturnableItems: ReturnablePosition[];
  guestUserOrder: Order;
}

export const initialState: ReturnRequestState = returnRequestAdapter.getInitialState({
  loading: false,
  error: undefined,
  reasons: undefined,
  orderReturnableItems: undefined,
  guestUserOrder: undefined,
});

export const returnRequestReducer = createReducer(
  initialState,
  setLoadingOn(
    loadOrderReturnReasons,
    loadOrderReturnRequests,
    createReturnRequest,
    loadOrderReturnableItems,
    loadOrderByDocumentNoAndEmail
  ),
  setErrorOn(
    loadOrderReturnReasonsFail,
    loadOrderReturnRequestsFail,
    createReturnRequestFail,
    loadOrderReturnableItemsFail,
    loadOrderByDocumentNoAndEmailFail
  ),
  unsetLoadingAndErrorOn(
    loadOrderReturnReasonsSuccess,
    loadOrderReturnRequestsSuccess,
    createReturnRequestSuccess,
    loadOrderReturnableItemsSuccess
  ),
  on(
    loadOrderReturnableItemsSuccess,
    (state, action): ReturnRequestState => ({ ...state, orderReturnableItems: action.payload.orderReturnableItems })
  ),
  on(
    loadOrderReturnRequestsSuccess,
    (state, action): ReturnRequestState => returnRequestAdapter.addMany(action.payload.orderReturnRequests, state)
  ),
  on(
    loadOrderReturnReasonsSuccess,
    (state, action): ReturnRequestState => ({ ...state, reasons: action.payload.reasons })
  ),
  on(
    loadOrderByDocumentNoAndEmailSuccess,
    (state, action): ReturnRequestState => ({ ...state, guestUserOrder: action.payload.order })
  )
);
