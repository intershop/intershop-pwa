import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';

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
  LoadQuoteRequestItems = '[Quote] Load QuoteRequestItems',
  LoadQuoteRequestItemsFail = '[Quote API] Load QuoteRequestItems Fail',
  LoadQuoteRequestItemsSuccess = '[Quote API] Load QuoteRequestItems Success',
  AddProductToQuoteRequest = '[Quote] Add Item to Quote Request',
  AddProductToQuoteRequestFail = '[Quote API] Add Item to  Quote Request Fail',
  AddProductToQuoteRequestSuccess = '[Quote API] Add Item to Quote Request Success',
  UpdateQuoteRequestItems = '[Quote] Update Quote Request Items',
  UpdateQuoteRequestItemsFail = '[Quote API] Update Quote Request Items Fail',
  UpdateQuoteRequestItemsSuccess = '[Quote API] Update Quote Request Items Success',
  DeleteItemFromQuoteRequest = '[Quote] Delete Item from Quote Request',
  DeleteItemFromQuoteRequestFail = '[Quote API] Delete Item from  Quote Request Fail',
  DeleteItemFromQuoteRequestSuccess = '[Quote API] Delete Item from Quote Request Success',
}

export class SelectQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.SelectQuoteRequest;
  constructor(public payload: string) {}
}

export class LoadQuoteRequests implements Action {
  readonly type = QuoteRequestActionTypes.LoadQuoteRequests;
}

export class LoadQuoteRequestsFail implements Action {
  readonly type = QuoteRequestActionTypes.LoadQuoteRequestsFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadQuoteRequestsSuccess implements Action {
  readonly type = QuoteRequestActionTypes.LoadQuoteRequestsSuccess;
  constructor(public payload: QuoteRequest[]) {}
}

export class AddQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.AddQuoteRequest;
}

export class AddQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.AddQuoteRequestFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class AddQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.AddQuoteRequestSuccess;
  constructor(public payload: string) {}
}

export class UpdateQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.UpdateQuoteRequest;
  constructor(public payload: QuoteRequest) {}
}

export class UpdateQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.UpdateQuoteRequestFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.UpdateQuoteRequestSuccess;
  constructor(public payload: QuoteRequest) {}
}

export class DeleteQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.DeleteQuoteRequest;
  constructor(public payload: string) {}
}

export class DeleteQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.DeleteQuoteRequestFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.DeleteQuoteRequestSuccess;
  constructor(public payload: string) {}
}

export class LoadQuoteRequestItems implements Action {
  readonly type = QuoteRequestActionTypes.LoadQuoteRequestItems;
  constructor(public payload: string) {}
}

export class LoadQuoteRequestItemsFail implements Action {
  readonly type = QuoteRequestActionTypes.LoadQuoteRequestItemsFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadQuoteRequestItemsSuccess implements Action {
  readonly type = QuoteRequestActionTypes.LoadQuoteRequestItemsSuccess;
  constructor(public payload: QuoteRequestItem[]) {}
}

export class AddProductToQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.AddProductToQuoteRequest;
  constructor(public payload: { quoteRequestId?: string; sku: string; quantity: number }) {}
}

export class AddProductToQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.AddProductToQuoteRequestFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class AddProductToQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.AddProductToQuoteRequestSuccess;
  constructor(public payload: string) {}
}

export class UpdateQuoteRequestItems implements Action {
  readonly type = QuoteRequestActionTypes.UpdateQuoteRequestItems;
  constructor(public payload: { quoteRequestId?: string; items: { itemId: string; quantity: number }[] }) {}
}

export class UpdateQuoteRequestItemsFail implements Action {
  readonly type = QuoteRequestActionTypes.UpdateQuoteRequestItemsFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateQuoteRequestItemsSuccess implements Action {
  readonly type = QuoteRequestActionTypes.UpdateQuoteRequestItemsSuccess;
  constructor(public payload: string[]) {}
}

export class DeleteItemFromQuoteRequest implements Action {
  readonly type = QuoteRequestActionTypes.DeleteItemFromQuoteRequest;
  constructor(public payload: { quoteRequestId?: string; itemId: string }) {}
}

export class DeleteItemFromQuoteRequestFail implements Action {
  readonly type = QuoteRequestActionTypes.DeleteItemFromQuoteRequestFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteItemFromQuoteRequestSuccess implements Action {
  readonly type = QuoteRequestActionTypes.DeleteItemFromQuoteRequestSuccess;
  constructor(public payload: string) {}
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
  | LoadQuoteRequestItems
  | LoadQuoteRequestItemsFail
  | LoadQuoteRequestItemsSuccess
  | AddProductToQuoteRequest
  | AddProductToQuoteRequestFail
  | AddProductToQuoteRequestSuccess
  | UpdateQuoteRequestItems
  | UpdateQuoteRequestItemsFail
  | UpdateQuoteRequestItemsSuccess
  | DeleteItemFromQuoteRequest
  | DeleteItemFromQuoteRequestFail
  | DeleteItemFromQuoteRequestSuccess;
