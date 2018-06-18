import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { Quote } from '../../../models/quote/quote.model';

export enum QuoteActionTypes {
  SelectQuote = '[Quote] Select Quote',
  LoadQuoteRequests = '[Quote Internal] Load QuoteRequests',
  LoadQuoteRequestsFail = '[Quote API] Load QuoteRequests Fail',
  LoadQuoteRequestsSuccess = '[Quote API] Load QuoteRequests Success',
  LoadQuotes = '[Quote Internal] Load Quotes',
  LoadQuotesFail = '[Quote API] Load Quotes Fail',
  LoadQuotesSuccess = '[Quote API] Load Quotes Success',
  AddQuoteRequest = '[Quote] Add Quote Request',
  AddQuoteRequestFail = '[Quote API] Add Quote Request Fail',
  AddQuoteRequestSuccess = '[Quote API] Add Quote Request Success',
  UpdateQuoteRequest = '[Quote] Update Quote Request',
  UpdateQuoteRequestFail = '[Quote API] Update Quote Request Fail',
  UpdateQuoteRequestSuccess = '[Quote API] Update Quote Request Success',
  DeleteQuoteRequest = '[Quote] Delete Quote Request',
  DeleteQuoteRequestFail = '[Quote API] Delete Quote Request Fail',
  DeleteQuoteRequestSuccess = '[Quote API] Delete Quote Request Success',
  DeleteQuote = '[Quote] Delete Quote',
  DeleteQuoteFail = '[Quote API] Delete Quote Fail',
  DeleteQuoteSuccess = '[Quote API] Delete Quote Success',
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

export class SelectQuote implements Action {
  readonly type = QuoteActionTypes.SelectQuote;
  constructor(public payload: string) {}
}

export class LoadQuoteRequests implements Action {
  readonly type = QuoteActionTypes.LoadQuoteRequests;
}

export class LoadQuoteRequestsFail implements Action {
  readonly type = QuoteActionTypes.LoadQuoteRequestsFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadQuoteRequestsSuccess implements Action {
  readonly type = QuoteActionTypes.LoadQuoteRequestsSuccess;
  constructor(public payload: Quote[]) {}
}

export class LoadQuotes implements Action {
  readonly type = QuoteActionTypes.LoadQuotes;
}

export class LoadQuotesFail implements Action {
  readonly type = QuoteActionTypes.LoadQuotesFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadQuotesSuccess implements Action {
  readonly type = QuoteActionTypes.LoadQuotesSuccess;
  constructor(public payload: Quote[]) {}
}

export class AddQuoteRequest implements Action {
  readonly type = QuoteActionTypes.AddQuoteRequest;
}

export class AddQuoteRequestFail implements Action {
  readonly type = QuoteActionTypes.AddQuoteRequestFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class AddQuoteRequestSuccess implements Action {
  readonly type = QuoteActionTypes.AddQuoteRequestSuccess;
}

export class UpdateQuoteRequest implements Action {
  readonly type = QuoteActionTypes.UpdateQuoteRequest;
  constructor(public payload: Quote) {}
}

export class UpdateQuoteRequestFail implements Action {
  readonly type = QuoteActionTypes.UpdateQuoteRequestFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateQuoteRequestSuccess implements Action {
  readonly type = QuoteActionTypes.UpdateQuoteRequestSuccess;
}

export class DeleteQuoteRequest implements Action {
  readonly type = QuoteActionTypes.DeleteQuoteRequest;
  constructor(public payload: string) {}
}

export class DeleteQuoteRequestFail implements Action {
  readonly type = QuoteActionTypes.DeleteQuoteRequestFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteQuoteRequestSuccess implements Action {
  readonly type = QuoteActionTypes.DeleteQuoteRequestSuccess;
}

export class DeleteQuote implements Action {
  readonly type = QuoteActionTypes.DeleteQuote;
  constructor(public payload: string) {}
}

export class DeleteQuoteFail implements Action {
  readonly type = QuoteActionTypes.DeleteQuoteFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteQuoteSuccess implements Action {
  readonly type = QuoteActionTypes.DeleteQuoteSuccess;
}

export class LoadQuoteRequestItems implements Action {
  readonly type = QuoteActionTypes.LoadQuoteRequestItems;
  constructor(public payload: string) {}
}

export class LoadQuoteRequestItemsFail implements Action {
  readonly type = QuoteActionTypes.LoadQuoteRequestItemsFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadQuoteRequestItemsSuccess implements Action {
  readonly type = QuoteActionTypes.LoadQuoteRequestItemsSuccess;
  constructor(public payload: QuoteRequestItem[]) {}
}

export class AddProductToQuoteRequest implements Action {
  readonly type = QuoteActionTypes.AddProductToQuoteRequest;
  constructor(public payload: { quoteRequestId?: string; sku: string; quantity: number }) {}
}

export class AddProductToQuoteRequestFail implements Action {
  readonly type = QuoteActionTypes.AddProductToQuoteRequestFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class AddProductToQuoteRequestSuccess implements Action {
  readonly type = QuoteActionTypes.AddProductToQuoteRequestSuccess;
}

export class UpdateQuoteRequestItems implements Action {
  readonly type = QuoteActionTypes.UpdateQuoteRequestItems;
  constructor(public payload: { quoteRequestId: string; items: { itemId: string; quantity: number }[] }) {}
}

export class UpdateQuoteRequestItemsFail implements Action {
  readonly type = QuoteActionTypes.UpdateQuoteRequestItemsFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateQuoteRequestItemsSuccess implements Action {
  readonly type = QuoteActionTypes.UpdateQuoteRequestItemsSuccess;
}

export class DeleteItemFromQuoteRequest implements Action {
  readonly type = QuoteActionTypes.DeleteItemFromQuoteRequest;
  constructor(public payload: { quoteRequestId: string; itemId: string }) {}
}

export class DeleteItemFromQuoteRequestFail implements Action {
  readonly type = QuoteActionTypes.DeleteItemFromQuoteRequestFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteItemFromQuoteRequestSuccess implements Action {
  readonly type = QuoteActionTypes.DeleteItemFromQuoteRequestSuccess;
}

export type QuoteAction =
  | SelectQuote
  | LoadQuoteRequests
  | LoadQuoteRequestsFail
  | LoadQuoteRequestsSuccess
  | LoadQuotes
  | LoadQuotesFail
  | LoadQuotesSuccess
  | AddQuoteRequest
  | AddQuoteRequestFail
  | AddQuoteRequestSuccess
  | UpdateQuoteRequest
  | UpdateQuoteRequestFail
  | UpdateQuoteRequestSuccess
  | DeleteQuoteRequest
  | DeleteQuoteRequestFail
  | DeleteQuoteRequestSuccess
  | DeleteQuote
  | DeleteQuoteFail
  | DeleteQuoteSuccess
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
