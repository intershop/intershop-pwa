import { Action } from '@ngrx/store';
import { HttpError } from '../../../models/http-error/http-error.model';
import { QuoteLineItemResultModel } from '../../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteData } from '../../../models/quote/quote.interface';

export enum QuoteActionTypes {
  SelectQuote = '[Quote] Select Quote',
  LoadQuotes = '[Quote Internal] Load Quotes',
  LoadQuotesFail = '[Quote API] Load Quotes Fail',
  LoadQuotesSuccess = '[Quote API] Load Quotes Success',
  DeleteQuote = '[Quote] Delete Quote',
  DeleteQuoteFail = '[Quote API] Delete Quote Fail',
  DeleteQuoteSuccess = '[Quote API] Delete Quote Success',
  RejectQuote = '[Quote] Reject Quote',
  RejectQuoteFail = '[Quote API] Reject Quote Fail',
  RejectQuoteSuccess = '[Quote API] Reject Quote Success',
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
  constructor(public payload: HttpError) {}
}

export class LoadQuotesSuccess implements Action {
  readonly type = QuoteActionTypes.LoadQuotesSuccess;
  constructor(public payload: QuoteData[]) {}
}

export class DeleteQuote implements Action {
  readonly type = QuoteActionTypes.DeleteQuote;
  constructor(public payload: string) {}
}

export class DeleteQuoteFail implements Action {
  readonly type = QuoteActionTypes.DeleteQuoteFail;
  constructor(public payload: HttpError) {}
}

export class DeleteQuoteSuccess implements Action {
  readonly type = QuoteActionTypes.DeleteQuoteSuccess;
  constructor(public payload: string) {}
}

export class RejectQuote implements Action {
  readonly type = QuoteActionTypes.RejectQuote;
}

export class RejectQuoteFail implements Action {
  readonly type = QuoteActionTypes.RejectQuoteFail;
  constructor(public payload: HttpError) {}
}

export class RejectQuoteSuccess implements Action {
  readonly type = QuoteActionTypes.RejectQuoteSuccess;
  constructor(public payload: string) {}
}

export class CreateQuoteRequestFromQuote implements Action {
  readonly type = QuoteActionTypes.CreateQuoteRequestFromQuote;
}

export class CreateQuoteRequestFromQuoteFail implements Action {
  readonly type = QuoteActionTypes.CreateQuoteRequestFromQuoteFail;
  constructor(public payload: HttpError) {}
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
  | RejectQuote
  | RejectQuoteFail
  | RejectQuoteSuccess
  | CreateQuoteRequestFromQuote
  | CreateQuoteRequestFromQuoteFail
  | CreateQuoteRequestFromQuoteSuccess;
