import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Quote } from '../../../models/quote/quote.model';

export enum QuoteActionTypes {
  LoadQuotes = '[Quote Internal] Load Quotes',
  LoadQuotesFail = '[Quote API] Load Quotes Fail',
  LoadQuotesSuccess = '[Quote API] Load Quotes Success',
  DeleteQuote = '[Quote] Delete Quote',
  DeleteQuoteFail = '[Quote API] Delete Quote Fail',
  DeleteQuoteSuccess = '[Quote API] Delete Quote Success',
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

export type QuoteAction =
  | LoadQuotes
  | LoadQuotesFail
  | LoadQuotesSuccess
  | DeleteQuote
  | DeleteQuoteFail
  | DeleteQuoteSuccess;
