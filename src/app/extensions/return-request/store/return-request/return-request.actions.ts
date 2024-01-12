import { createAction } from '@ngrx/store';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import {
  CreateReturnRequestPayload,
  ReturnRequest,
  ReturnablePosition,
} from '../../models/return-request/return-request.model';

export const loadOrderReturnReasons = createAction('[Order Return Reason] Load Order Return Reasons');

export const loadOrderReturnReasonsSuccess = createAction(
  '[Order Return Request] Load Order Return Reasons Success',
  payload<{ reasons: SelectOption[] }>()
);

export const loadOrderReturnReasonsFail = createAction(
  '[Order Return Request] Load Order Return Reasons Fail',
  httpError()
);

export const loadOrderReturnableItems = createAction(
  '[Order Return Request] Load Order Returnable Items',
  payload<{ orderId: string }>()
);

export const loadOrderReturnableItemsSuccess = createAction(
  '[Order Return Request] Load Order Returnable Items Success',
  payload<{ orderReturnableItems: ReturnablePosition[] }>()
);

export const loadOrderReturnableItemsFail = createAction(
  '[Order Return Request] Load Order Returnable Items Fail',
  httpError()
);

export const loadOrderReturnRequests = createAction(
  '[Order Return Request] Load Order Return Requests',
  payload<{ orderIds: string[] }>()
);

export const loadOrderReturnRequestsSuccess = createAction(
  '[Order Return Request] Load Order Return Requests Success',
  payload<{ orderReturnRequests: ReturnRequest[] }>()
);

export const loadOrderReturnRequestsFail = createAction(
  '[Order Return Request] Load Order Return Requests Fail',
  httpError()
);

export const createReturnRequest = createAction(
  '[Order Return Request] Create Return Request',
  payload<{ orderId: string; body: CreateReturnRequestPayload }>()
);

export const createReturnRequestSuccess = createAction('[Order Return Request] Create Return Request Success');

export const createReturnRequestFail = createAction('[Order Return Request] Create Return Request Fail', httpError());
