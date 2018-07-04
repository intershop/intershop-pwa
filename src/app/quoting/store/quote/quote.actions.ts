import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { QuoteLineItemResultModel } from '../../../models/quote-line-item-result/quote-line-item-result.model';
import { Quote } from '../../../models/quote/quote.model';

export enum QuoteActionTypes {
  SelectQuote = '[Quote] Select Quote',
  LoadQuotes = '[Quote Internal] Load Quotes',
  LoadQuotesFail = '[Quote API] Load Quotes Fail',
  LoadQuotesSuccess = '[Quote API] Load Quotes Success',
  DeleteQuote = '[Quote] Delete Quote',
  DeleteQuoteFail = '[Quote API] Delete Quote Fail',
  DeleteQuoteSuccess = '[Quote API] Delete Quote Success',
  CreateQuoteRequestFromQuote = '[Quote] Create Quote Request from Quote',
  CreateQuoteRequestFromQuoteFail = '[Quote API] Create Quote Request from Quote Fail',
  CreateQuoteRequestFromQuoteSuccess = '[Quote API] Create Quote Request from Quote Success',
}

export class SelectQuote implements Action {
  readonly type = QuoteActionTypes.SelectQuote;
  constructor(public payload: string) {}
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
  constructor(public payload: string) {}
}

export class CreateQuoteRequestFromQuote implements Action {
  readonly type = QuoteActionTypes.CreateQuoteRequestFromQuote;
}

export class CreateQuoteRequestFromQuoteFail implements Action {
  readonly type = QuoteActionTypes.CreateQuoteRequestFromQuoteFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class CreateQuoteRequestFromQuoteSuccess implements Action {
  readonly type = QuoteActionTypes.CreateQuoteRequestFromQuoteSuccess;
  constructor(public payload: QuoteLineItemResultModel) {}
}

export type QuoteAction =
  | SelectQuote
  | LoadQuotes
  | LoadQuotesFail
  | LoadQuotesSuccess
  | DeleteQuote
  | DeleteQuoteFail
  | DeleteQuoteSuccess
  | CreateQuoteRequestFromQuote
  | CreateQuoteRequestFromQuoteFail
  | CreateQuoteRequestFromQuoteSuccess;
