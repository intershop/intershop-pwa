import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../models/quote-request/quote-request.interface';

export enum QuoteRequestActionTypes {
  SelectQuoteRequest = '[Quote] Select QuoteRequest',
  LoadQuoteRequests = '[Quote Internal] Load QuoteRequests',
  LoadQuoteRequestsFail = '[Quote API] Load QuoteRequests Fail',
  LoadQuoteRequestsSuccess = '[Quote API] Load QuoteRequests Success',
  AddQuoteRequest = '[Quote] Add Quote Request',
  AddQuoteRequestFail = '[Quote API] Add Quote Request Fail',
  AddQuoteRequestSuccess = '[Quote API] Add Quote Request Success',
  UpdateQuoteRequest = '[Quote] Update Quote Request',
  UpdateQuoteRequestFail = '[Quote API] Update Quote Request Fail',
  UpdateQuoteRequestSuccess = '[Quote API] Update Quote Request Success',
  DeleteQuoteRequest = '[Quote] Delete Quote Request',
  DeleteQuoteRequestFail = '[Quote API] Delete Quote Request Fail',
  DeleteQuoteRequestSuccess = '[Quote API] Delete Quote Request Success',
  SubmitQuoteRequest = '[Quote] Submit Quote Request',
  SubmitQuoteRequestFail = '[Quote API] Submit Quote Request Fail',
  SubmitQuoteRequestSuccess = '[Quote API] Submit Quote Request Success',
  UpdateSubmitQuoteRequest = '[Quote] Update and Submit Quote Request',
  CreateQuoteRequestFromQuoteRequest = '[Quote] Create Quote Request from Quote Request',
  CreateQuoteRequestFromQuoteRequestFail = '[Quote API] Create Quote Request from Quote Request Fail',
  CreateQuoteRequestFromQuoteRequestSuccess = '[Quote API] Create Quote Request from Quote Request Success',
  LoadQuoteRequestItems = '[Quote] Load QuoteRequestItems',
  LoadQuoteRequestItemsFail = '[Quote API] Load QuoteRequestItems Fail',
  LoadQuoteRequestItemsSuccess = '[Quote API] Load QuoteRequestItems Success',
  AddProductToQuoteRequest = '[Quote] Add Item to Quote Request',
  AddProductToQuoteRequestFail = '[Quote API] Add Item to Quote Request Fail',
  AddProductToQuoteRequestSuccess = '[Quote API] Add Item to Quote Request Success',
  AddBasketToQuoteRequest = '[Quote] Add Basket to Quote Request',
  AddBasketToQuoteRequestFail = '[Quote API] Add Basket to Quote Request Fail',
  AddBasketToQuoteRequestSuccess = '[Quote API] Add Basket to Quote Request Success',
  UpdateQuoteRequestItems = '[Quote] Update Quote Request Items',
  UpdateQuoteRequestItemsFail = '[Quote API] Update Quote Request Items Fail',
  UpdateQuoteRequestItemsSuccess = '[Quote API] Update Quote Request Items Success',
  DeleteItemFromQuoteRequest = '[Quote] Delete Item from Quote Request',
  DeleteItemFromQuoteRequestFail = '[Quote API] Delete Item from  Quote Request Fail',
  DeleteItemFromQuoteRequestSuccess = '[Quote API] Delete Item from Quote Request Success',
}

export class SelectQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.SelectQuoteRequest;
  constructor(public payload: { id: string }) {}
}

export class LoadQuoteRequests implements Action {
  readonly type = QuoteRequestActionTypes.LoadQuoteRequests;
}

export class LoadQuoteRequestsFail implements Action {
  readonly type = QuoteRequestActionTypes.LoadQuoteRequestsFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadQuoteRequestsSuccess implements Action {
  readonly type = QuoteRequestActionTypes.LoadQuoteRequestsSuccess;
  constructor(public payload: { quoteRequests: QuoteRequestData[] }) {}
}

export class AddQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.AddQuoteRequest;
}

export class AddQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.AddQuoteRequestFail;
  constructor(public payload: { error: HttpError }) {}
}

export class AddQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.AddQuoteRequestSuccess;
  constructor(public payload: { id: string }) {}
}

export class UpdateQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.UpdateQuoteRequest;
  constructor(public payload: { displayName?: string; description?: string }) {}
}

export class UpdateQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.UpdateQuoteRequestFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UpdateQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.UpdateQuoteRequestSuccess;
  constructor(public payload: { quoteRequest: QuoteRequestData }) {}
}

export class DeleteQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.DeleteQuoteRequest;
  constructor(public payload: { id: string }) {}
}

export class DeleteQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.DeleteQuoteRequestFail;
  constructor(public payload: { error: HttpError }) {}
}

export class DeleteQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.DeleteQuoteRequestSuccess;
  constructor(public payload: { id: string }) {}
}

export class SubmitQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.SubmitQuoteRequest;
}

export class SubmitQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.SubmitQuoteRequestFail;
  constructor(public payload: { error: HttpError }) {}
}

export class SubmitQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.SubmitQuoteRequestSuccess;
  constructor(public payload: { id: string }) {}
}

export class UpdateSubmitQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.UpdateSubmitQuoteRequest;
  constructor(public payload: { displayName?: string; description?: string }) {}
}

export class CreateQuoteRequestFromQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequest;
  constructor(public payload?: { redirect?: boolean }) {}
}

export class CreateQuoteRequestFromQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequestFail;
  constructor(public payload: { error: HttpError }) {}
}

export class CreateQuoteRequestFromQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequestSuccess;
  constructor(public payload: { quoteLineItemResult: QuoteLineItemResult }) {}
}

export class LoadQuoteRequestItems implements Action {
  readonly type = QuoteRequestActionTypes.LoadQuoteRequestItems;
  constructor(public payload: { id: string }) {}
}

export class LoadQuoteRequestItemsFail implements Action {
  readonly type = QuoteRequestActionTypes.LoadQuoteRequestItemsFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadQuoteRequestItemsSuccess implements Action {
  readonly type = QuoteRequestActionTypes.LoadQuoteRequestItemsSuccess;
  constructor(public payload: { quoteRequestItems: QuoteRequestItem[] }) {}
}

export class AddProductToQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.AddProductToQuoteRequest;
  constructor(public payload: { sku: string; quantity: number }) {}
}

export class AddProductToQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.AddProductToQuoteRequestFail;
  constructor(public payload: { error: HttpError }) {}
}

export class AddProductToQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.AddProductToQuoteRequestSuccess;
  constructor(public payload: { id: string }) {}
}

export class AddBasketToQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.AddBasketToQuoteRequest;
}

export class AddBasketToQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.AddBasketToQuoteRequestFail;
  constructor(public payload: { error: HttpError }) {}
}

export class AddBasketToQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.AddBasketToQuoteRequestSuccess;
  constructor(public payload: { id: string }) {}
}

export class UpdateQuoteRequestItems implements Action {
  readonly type = QuoteRequestActionTypes.UpdateQuoteRequestItems;
  constructor(public payload: { lineItemUpdates: LineItemUpdate[] }) {}
}

export class UpdateQuoteRequestItemsFail implements Action {
  readonly type = QuoteRequestActionTypes.UpdateQuoteRequestItemsFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UpdateQuoteRequestItemsSuccess implements Action {
  readonly type = QuoteRequestActionTypes.UpdateQuoteRequestItemsSuccess;
  constructor(public payload: { itemIds: string[] }) {}
}

export class DeleteItemFromQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.DeleteItemFromQuoteRequest;
  constructor(public payload: { itemId: string }) {}
}

export class DeleteItemFromQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.DeleteItemFromQuoteRequestFail;
  constructor(public payload: { error: HttpError }) {}
}

export class DeleteItemFromQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.DeleteItemFromQuoteRequestSuccess;
  constructor(public payload: { id: string }) {}
}

export type QuoteAction =
  | SelectQuoteRequest
  | LoadQuoteRequests
  | LoadQuoteRequestsFail
  | LoadQuoteRequestsSuccess
  | AddQuoteRequest
  | AddQuoteRequestFail
  | AddQuoteRequestSuccess
  | UpdateQuoteRequest
  | UpdateQuoteRequestFail
  | UpdateQuoteRequestSuccess
  | DeleteQuoteRequest
  | DeleteQuoteRequestFail
  | DeleteQuoteRequestSuccess
  | SubmitQuoteRequest
  | SubmitQuoteRequestFail
  | SubmitQuoteRequestSuccess
  | UpdateSubmitQuoteRequest
  | CreateQuoteRequestFromQuoteRequest
  | CreateQuoteRequestFromQuoteRequestFail
  | CreateQuoteRequestFromQuoteRequestSuccess
  | LoadQuoteRequestItems
  | LoadQuoteRequestItemsFail
  | LoadQuoteRequestItemsSuccess
  | AddProductToQuoteRequest
  | AddProductToQuoteRequestFail
  | AddProductToQuoteRequestSuccess
  | AddBasketToQuoteRequest
  | AddBasketToQuoteRequestFail
  | AddBasketToQuoteRequestSuccess
  | UpdateQuoteRequestItems
  | UpdateQuoteRequestItemsFail
  | UpdateQuoteRequestItemsSuccess
  | DeleteItemFromQuoteRequest
  | DeleteItemFromQuoteRequestFail
  | DeleteItemFromQuoteRequestSuccess;
