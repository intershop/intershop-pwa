import { createAction } from '@ngrx/store';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../models/quote-request/quote-request.interface';

export const selectQuoteRequest = createAction('[Quote] Select QuoteRequest', payload<{ id: string }>());

export const loadQuoteRequests = createAction('[Quote Internal] Load QuoteRequests');

export const loadQuoteRequestsFail = createAction('[Quote API] Load QuoteRequests Fail', httpError());

export const loadQuoteRequestsSuccess = createAction(
  '[Quote API] Load QuoteRequests Success',
  payload<{ quoteRequests: QuoteRequestData[] }>()
);

export const addQuoteRequest = createAction('[Quote] Add Quote Request');

export const addQuoteRequestFail = createAction('[Quote API] Add Quote Request Fail', httpError());

export const addQuoteRequestSuccess = createAction('[Quote API] Add Quote Request Success', payload<{ id: string }>());

export const updateQuoteRequest = createAction(
  '[Quote] Update Quote Request',
  payload<{ displayName?: string; description?: string }>()
);

export const updateQuoteRequestFail = createAction('[Quote API] Update Quote Request Fail', httpError());

export const updateQuoteRequestSuccess = createAction(
  '[Quote API] Update Quote Request Success',
  payload<{ quoteRequest: QuoteRequestData }>()
);

export const deleteQuoteRequest = createAction('[Quote] Delete Quote Request', payload<{ id: string }>());

export const deleteQuoteRequestFail = createAction('[Quote API] Delete Quote Request Fail', httpError());

export const deleteQuoteRequestSuccess = createAction(
  '[Quote API] Delete Quote Request Success',
  payload<{ id: string }>()
);

export const submitQuoteRequest = createAction('[Quote] Submit Quote Request');

export const submitQuoteRequestFail = createAction('[Quote API] Submit Quote Request Fail', httpError());

export const submitQuoteRequestSuccess = createAction(
  '[Quote API] Submit Quote Request Success',
  payload<{ id: string }>()
);

export const updateSubmitQuoteRequest = createAction(
  '[Quote] Update and Submit Quote Request',
  payload<{ displayName?: string; description?: string }>()
);

export const createQuoteRequestFromQuoteRequest = createAction(
  '[Quote] Create Quote Request from Quote Request',
  payload<{ redirect?: boolean }>()
);

export const createQuoteRequestFromQuoteRequestFail = createAction(
  '[Quote API] Create Quote Request from Quote Request Fail',
  httpError()
);

export const createQuoteRequestFromQuoteRequestSuccess = createAction(
  '[Quote API] Create Quote Request from Quote Request Success',
  payload<{ quoteLineItemResult: QuoteLineItemResult }>()
);

export const loadQuoteRequestItems = createAction('[Quote] Load QuoteRequestItems', payload<{ id: string }>());

export const loadQuoteRequestItemsFail = createAction('[Quote API] Load QuoteRequestItems Fail', httpError());

export const loadQuoteRequestItemsSuccess = createAction(
  '[Quote API] Load QuoteRequestItems Success',
  payload<{ quoteRequestItems: QuoteRequestItem[] }>()
);

export const addProductToQuoteRequest = createAction(
  '[Quote] Add Item to Quote Request',
  payload<{ sku: string; quantity: number }>()
);

export const addProductToQuoteRequestFail = createAction('[Quote API] Add Item to Quote Request Fail', httpError());

export const addProductToQuoteRequestSuccess = createAction(
  '[Quote API] Add Item to Quote Request Success',
  payload<{ id: string }>()
);

export const addBasketToQuoteRequest = createAction('[Quote] Add Basket to Quote Request');

export const addBasketToQuoteRequestFail = createAction('[Quote API] Add Basket to Quote Request Fail', httpError());

export const addBasketToQuoteRequestSuccess = createAction(
  '[Quote API] Add Basket to Quote Request Success',
  payload<{ id: string }>()
);

export const updateQuoteRequestItems = createAction(
  '[Quote] Update Quote Request Items',
  payload<{ lineItemUpdates: LineItemUpdate[] }>()
);

export const updateQuoteRequestItemsFail = createAction('[Quote API] Update Quote Request Items Fail', httpError());

export const updateQuoteRequestItemsSuccess = createAction(
  '[Quote API] Update Quote Request Items Success',
  payload<{ itemIds: string[] }>()
);

export const deleteItemFromQuoteRequest = createAction(
  '[Quote] Delete Item from Quote Request',
  payload<{ itemId: string }>()
);

export const deleteItemFromQuoteRequestFail = createAction(
  '[Quote API] Delete Item from  Quote Request Fail',
  httpError()
);

export const deleteItemFromQuoteRequestSuccess = createAction(
  '[Quote API] Delete Item from Quote Request Success',
  payload<{ id: string }>()
);
